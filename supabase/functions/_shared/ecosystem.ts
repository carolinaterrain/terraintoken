/**
 * Shared Ecosystem Utilities for Cross-App Integration
 * Used by: ecosystem-events, execute-buyback-burn, wallet-challenge, wallet-verify
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tv-signature, x-idempotency-key, x-correlation-id, x-session-id',
};

// Event type alias map for migration (old names -> canonical names)
export const EVENT_ALIAS_MAP: Record<string, string> = {
  'TV_MONTH_CLOSED': 'tv.month.closed',
  'BAND_DETERMINED': 'trn.band.determined',
  'BURN_EXECUTED': 'trn.burn.executed',
  'REPORT_PUBLISHED': 'trn.report.published',
  'TV_ANALYSIS_CREATED': 'tv.analysis.created',
  'TV_ANALYSIS_COMPLETED': 'tv.analysis.completed',
  'TV_PAYMENT_SUCCEEDED': 'tv.payment.succeeded',
  'TV_PAYMENT_FAILED': 'tv.payment.failed',
  'TRN_WALLET_LINKED': 'trn.wallet.linked',
  'TRN_WALLET_UNLINKED': 'trn.wallet.unlinked',
  'TRN_TIER_UPDATED': 'trn.tier.updated',
};

// Canonical event types
export type EcosystemEventType = 
  | 'tv.month.closed'
  | 'tv.analysis.created'
  | 'tv.analysis.completed'
  | 'tv.payment.succeeded'
  | 'tv.payment.failed'
  | 'trn.band.determined'
  | 'trn.buyback.executed'
  | 'trn.burn.executed'
  | 'trn.report.published'
  | 'trn.wallet.linked'
  | 'trn.wallet.unlinked'
  | 'trn.tier.updated';

// Canonical event schema
export interface EcosystemEvent {
  event_type: string;
  idempotency_key: string;
  correlation_id?: string;
  producer: 'terrainvision' | 'trn';
  user_id?: string;
  session_id?: string;
  wallet_address?: string;
  report_month?: string;
  payload: Record<string, unknown>;
}

/**
 * Normalize event type to canonical dot-case format
 */
export function normalizeEventType(eventType: string): string {
  return EVENT_ALIAS_MAP[eventType] || eventType.toLowerCase().replace(/_/g, '.');
}

/**
 * Create HMAC-SHA256 signature for webhook verification
 */
export async function createSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify HMAC-SHA256 signature from incoming webhook
 */
export async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await createSignature(payload, secret);
  return signature === expectedSignature;
}

/**
 * Verify signed webhook or throw error
 * Supports both simple signature match and HMAC verification
 */
export async function verifySignedWebhookOrThrow(
  req: Request,
  rawBody: string
): Promise<void> {
  const syncSecret = Deno.env.get('TRN_SYNC_SECRET');
  if (!syncSecret) {
    throw new Error('TRN_SYNC_SECRET not configured');
  }

  const signature = req.headers.get('x-tv-signature');
  if (!signature) {
    throw new Error('Missing x-tv-signature header');
  }

  // First try simple signature match (legacy)
  if (signature === syncSecret) {
    return;
  }

  // Then try HMAC verification
  const isValid = await verifySignature(rawBody, signature, syncSecret);
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Get service role Supabase client
 */
export function getServiceSupabase() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Claim a webhook for processing (ensures only one worker processes it)
 */
export async function claimWebhook(
  supabase: ReturnType<typeof getServiceSupabase>,
  idempotencyKey: string,
  workerId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('webhook_inbox')
    .update({ 
      claimed_at: new Date().toISOString(),
      claimed_by: workerId 
    })
    .eq('idempotency_key', idempotencyKey)
    .is('claimed_at', null)
    .is('processed_at', null)
    .select()
    .single();

  return !error && data !== null;
}

/**
 * Mark webhook as processed
 */
export async function markWebhookProcessed(
  supabase: ReturnType<typeof getServiceSupabase>,
  idempotencyKey: string,
  error?: string
): Promise<void> {
  await supabase
    .from('webhook_inbox')
    .update({
      processed_at: new Date().toISOString(),
      error_message: error || null,
    })
    .eq('idempotency_key', idempotencyKey);
}

/**
 * Schedule webhook for retry
 */
export async function scheduleWebhookRetry(
  supabase: ReturnType<typeof getServiceSupabase>,
  idempotencyKey: string,
  error: string
): Promise<void> {
  // Exponential backoff: 1min, 5min, 15min, 1hr, 4hr
  const { data: webhook } = await supabase
    .from('webhook_inbox')
    .select('retry_count')
    .eq('idempotency_key', idempotencyKey)
    .single();

  const retryCount = (webhook?.retry_count || 0) + 1;
  const backoffMinutes = [1, 5, 15, 60, 240][Math.min(retryCount - 1, 4)];
  const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);

  await supabase
    .from('webhook_inbox')
    .update({
      claimed_at: null,
      claimed_by: null,
      retry_count: retryCount,
      next_retry_at: nextRetry.toISOString(),
      error_message: error,
    })
    .eq('idempotency_key', idempotencyKey);
}

/**
 * Generate a random nonce for wallet verification
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create wallet verification message
 */
export function createWalletVerificationMessage(nonce: string, walletAddress: string): string {
  return `Terrain Token Ecosystem\n\nSign this message to verify wallet ownership.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\n\nThis signature does not authorize any transactions.`;
}

// TRN Token constants
export const TRN_MINT_ADDRESS = 'tRNAb8DwLLNDJPhPrFhWqhQzPPBvGvZqApGB1yc6s7H';
export const TRN_DECIMALS = 9;
export const TRN_TREASURY_WALLET = Deno.env.get('TREASURY_WALLET_ADDRESS') || '';
