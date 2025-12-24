/**
 * Canonical Ecosystem Supabase Client (READ-ONLY)
 * 
 * This client connects to the shared Terrain Lifecycle v1 backend
 * for cross-app observability. TerrainToken uses this for:
 * - Reading ecosystem_events (activity feed)
 * - Reading properties/work_orders (aggregate stats)
 * - Reading compliance_schedules (due counts)
 * 
 * WRITE operations go through edge functions with proper auth.
 */
import { createClient } from '@supabase/supabase-js';

// Canonical Terrain Ecosystem Supabase
const ECOSYSTEM_URL = 'https://izxzkqprhekrgiwakepm.supabase.co';
const ECOSYSTEM_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eHprcXByaGVrcmdpd2FrZXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTg4NzIsImV4cCI6MjA2NDAzNDg3Mn0.51xRHqezxIx6LMz76d3VEsGjXcyYgJnuscPL4TbqFSA';

// Read-only client for ecosystem data
export const ecosystemClient = createClient(ECOSYSTEM_URL, ECOSYSTEM_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Type definitions for canonical tables (read-only views)
export interface EcosystemEvent {
  id: string;
  event_type: string;
  source_app: string;
  producer: string | null;
  property_id: string | null;
  correlation_id: string | null;
  idempotency_key: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface CanonicalProperty {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  owner_name: string | null;
  property_type: string | null;
  created_at: string;
}

export interface CanonicalWorkOrder {
  id: string;
  property_id: string;
  title: string;
  status: string | null;
  source_type: string | null;
  scheduled_date: string | null;
  created_at: string;
}

export interface CanonicalComplianceSchedule {
  id: string;
  property_id: string;
  schedule_type: string;
  next_due_date: string;
  status: string | null;
  created_at: string;
}

// Ecosystem API endpoint for event emission
export const ECOSYSTEM_EVENTS_ENDPOINT = `${ECOSYSTEM_URL}/functions/v1/ecosystem-events`;
