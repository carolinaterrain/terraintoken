/**
 * Hooks for reading from the Canonical Terrain Ecosystem
 * 
 * These are READ-ONLY queries against the shared Supabase project.
 * TerrainToken does NOT own this data - it only observes.
 */
import { useQuery } from '@tanstack/react-query';
import { 
  ecosystemClient, 
  EcosystemEvent, 
  CanonicalProperty,
  CanonicalWorkOrder,
  CanonicalComplianceSchedule
} from '@/lib/ecosystemClient';

/**
 * Read ecosystem events from canonical backend
 * Used for: Activity feed, cross-app observability
 */
export function useCanonicalEvents(limit = 50) {
  return useQuery({
    queryKey: ['canonical-ecosystem-events', limit],
    queryFn: async (): Promise<EcosystemEvent[]> => {
      const { data, error } = await ecosystemClient
        .from('ecosystem_events')
        .select('id, event_type, source_app, producer, property_id, correlation_id, idempotency_key, payload, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('[Canonical] Error fetching ecosystem events:', error);
        return [];
      }
      
      return (data || []) as EcosystemEvent[];
    },
    refetchInterval: 30000, // 30s polling
    staleTime: 25000,
  });
}

/**
 * Read property count from canonical backend
 * Used for: Aggregate stats dashboard
 */
export function useCanonicalPropertyStats() {
  return useQuery({
    queryKey: ['canonical-property-stats'],
    queryFn: async () => {
      const { count, error } = await ecosystemClient
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('[Canonical] Error fetching property stats:', error);
        return { totalProperties: 0, error: error.message };
      }
      
      return { totalProperties: count || 0 };
    },
    refetchInterval: 60000,
    staleTime: 55000,
  });
}

/**
 * Read work order stats from canonical backend
 * Used for: Aggregate stats dashboard
 */
export function useCanonicalWorkOrderStats() {
  return useQuery({
    queryKey: ['canonical-workorder-stats'],
    queryFn: async () => {
      // Get total count
      const { count: totalCount, error: totalError } = await ecosystemClient
        .from('work_orders')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) {
        console.error('[Canonical] Error fetching work order stats:', totalError);
        return { total: 0, pending: 0, completed: 0, error: totalError.message };
      }

      // Get pending count
      const { count: pendingCount } = await ecosystemClient
        .from('work_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'scheduled', 'in_progress']);

      // Get completed count
      const { count: completedCount } = await ecosystemClient
        .from('work_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      return { 
        total: totalCount || 0, 
        pending: pendingCount || 0, 
        completed: completedCount || 0 
      };
    },
    refetchInterval: 60000,
    staleTime: 55000,
  });
}

/**
 * Read compliance schedule stats from canonical backend
 * Used for: Aggregate due counts, compliance overview
 */
export function useCanonicalComplianceStats() {
  return useQuery({
    queryKey: ['canonical-compliance-stats'],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      // Get total schedules
      const { count: totalCount, error: totalError } = await ecosystemClient
        .from('compliance_schedules')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) {
        console.error('[Canonical] Error fetching compliance stats:', totalError);
        return { total: 0, overdue: 0, upcoming: 0, error: totalError.message };
      }

      // Get overdue count
      const { count: overdueCount } = await ecosystemClient
        .from('compliance_schedules')
        .select('*', { count: 'exact', head: true })
        .lt('next_due_date', now)
        .neq('status', 'completed');

      // Get upcoming (next 30 days)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count: upcomingCount } = await ecosystemClient
        .from('compliance_schedules')
        .select('*', { count: 'exact', head: true })
        .gte('next_due_date', now)
        .lte('next_due_date', thirtyDaysFromNow)
        .neq('status', 'completed');
      
      return { 
        total: totalCount || 0, 
        overdue: overdueCount || 0, 
        upcoming: upcomingCount || 0 
      };
    },
    refetchInterval: 60000,
    staleTime: 55000,
  });
}

/**
 * Get event counts by producer from canonical backend
 * Used for: Health dashboard, producer activity
 */
export function useCanonicalEventsByProducer() {
  return useQuery({
    queryKey: ['canonical-events-by-producer'],
    queryFn: async () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get events from last 7 days grouped by producer
      const { data, error } = await ecosystemClient
        .from('ecosystem_events')
        .select('producer, created_at')
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[Canonical] Error fetching events by producer:', error);
        return { producers: [], error: error.message };
      }

      // Aggregate by producer
      const producerMap = new Map<string, { events24h: number; events7d: number; lastEvent: string }>();
      
      for (const event of data || []) {
        const producer = event.producer || 'unknown';
        const existing = producerMap.get(producer) || { events24h: 0, events7d: 0, lastEvent: '' };
        
        existing.events7d++;
        if (event.created_at > oneDayAgo) {
          existing.events24h++;
        }
        if (!existing.lastEvent || event.created_at > existing.lastEvent) {
          existing.lastEvent = event.created_at;
        }
        
        producerMap.set(producer, existing);
      }

      const producers = Array.from(producerMap.entries()).map(([name, stats]) => ({
        name,
        ...stats,
        isStale: new Date(stats.lastEvent).getTime() < Date.now() - 24 * 60 * 60 * 1000
      }));

      return { producers };
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
}
