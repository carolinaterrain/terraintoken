/**
 * TerrainToken Event Emitter
 * 
 * Emits events to BOTH:
 * 1. Local Lovable Cloud Supabase (for TerrainToken-specific data)
 * 2. Canonical Ecosystem Supabase (for cross-app observability)
 * 
 * V1 SCOPE: TerrainToken emits ONLY token-adjacent events:
 * - trn.wallet.linked (when user links wallet)
 * - trn.wallet.unlinked (when user unlinks wallet)
 * - trn.tier.updated (when user tier changes - future)
 * 
 * TerrainToken does NOT emit:
 * - Property/work order/compliance events (owned by other apps)
 */

import { ECOSYSTEM_EVENTS_ENDPOINT } from '@/lib/ecosystemClient';
import { supabase } from '@/integrations/supabase/client';

export type TerrainTokenEventType = 
  | 'trn.wallet.linked'
  | 'trn.wallet.unlinked'
  | 'trn.tier.updated'
  | 'trn.report.published';

export interface TerrainTokenEvent {
  event_type: TerrainTokenEventType;
  wallet_address?: string;
  session_id?: string;
  user_id?: string;
  payload: Record<string, unknown>;
}

/**
 * Generate idempotency key for event deduplication
 */
function generateIdempotencyKey(eventType: string, walletAddress?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `trn:${eventType}:${walletAddress || 'anon'}:${timestamp}:${random}`;
}

/**
 * Emit event to local Supabase (via edge function)
 */
async function emitToLocal(event: TerrainTokenEvent, idempotencyKey: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('ecosystem-events', {
      body: {
        event_type: event.event_type,
        source_app: 'terraintoken',
        producer: 'trn',
        wallet_address: event.wallet_address,
        session_id: event.session_id,
        user_id: event.user_id,
        idempotency_key: idempotencyKey,
        payload: event.payload,
      },
    });
    
    if (error) {
      console.error('[EventEmitter] Local emission failed:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('[EventEmitter] Local emission error:', err);
    return false;
  }
}

/**
 * Emit event to canonical ecosystem (if configured)
 * This is a best-effort emission - failures don't block the UI
 */
async function emitToCanonical(event: TerrainTokenEvent, idempotencyKey: string): Promise<boolean> {
  try {
    const response = await fetch(ECOSYSTEM_EVENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
        // Note: HMAC signature would require TRN_SYNC_SECRET on client
        // For now, canonical endpoint must allow unsigned from trusted origins
      },
      body: JSON.stringify({
        event_type: event.event_type,
        source_app: 'terraintoken',
        producer: 'trn',
        wallet_address: event.wallet_address,
        session_id: event.session_id,
        user_id: event.user_id,
        idempotency_key: idempotencyKey,
        payload: event.payload,
      }),
    });
    
    if (!response.ok) {
      console.warn('[EventEmitter] Canonical emission returned:', response.status);
      return false;
    }
    
    return true;
  } catch (err) {
    // Canonical emission is best-effort
    console.warn('[EventEmitter] Canonical emission failed (non-blocking):', err);
    return false;
  }
}

/**
 * Emit a TerrainToken event
 * 
 * @param event - The event to emit
 * @returns Promise resolving to success status
 */
export async function emitTerrainTokenEvent(event: TerrainTokenEvent): Promise<{ local: boolean; canonical: boolean }> {
  const idempotencyKey = generateIdempotencyKey(event.event_type, event.wallet_address);
  
  // Emit to both backends in parallel
  const [localResult, canonicalResult] = await Promise.all([
    emitToLocal(event, idempotencyKey),
    emitToCanonical(event, idempotencyKey),
  ]);
  
  console.log(`[EventEmitter] ${event.event_type}: local=${localResult}, canonical=${canonicalResult}`);
  
  return { local: localResult, canonical: canonicalResult };
}

/**
 * Event payload shapes for documentation
 */
export const EVENT_PAYLOAD_SCHEMAS = {
  'trn.wallet.linked': {
    wallet_address: 'string (required)',
    linked_at: 'ISO timestamp',
    verification_method: 'signature | session',
  },
  'trn.wallet.unlinked': {
    wallet_address: 'string (required)',
    unlinked_at: 'ISO timestamp',
    reason: 'user_request | admin_action | session_expired',
  },
  'trn.report.published': {
    report_month: 'YYYY-MM format',
    published_at: 'ISO timestamp',
    trn_burned: 'number (optional)',
    report_url: 'string (optional)',
  },
  'trn.tier.updated': {
    wallet_address: 'string (required)',
    previous_tier: 'string',
    new_tier: 'string',
    updated_at: 'ISO timestamp',
  },
} as const;
