import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CollectorDrop {
  id: string;
  name: string;
  symbol: string;
  description: string;
  total_supply: number;
  price_usd: number;
  shopify_product_id: string | null;
  nft_image_url: string | null;
  treasury_wallet: string | null;
  status: string;
}

export interface Certificate {
  id: string;
  serial_number: number;
  status: string;
  reserved_at: string | null;
  claimed_by_wallet: string | null;
}

export function useCollectorDrop(symbol: string = 'TRNCE0') {
  const [drop, setDrop] = useState<CollectorDrop | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrop = useCallback(async () => {
    try {
      const { data: dropData, error: dropError } = await supabase
        .from('collector_drops')
        .select('*')
        .eq('symbol', symbol)
        .eq('status', 'active')
        .single();

      if (dropError) throw dropError;
      setDrop(dropData);

      // Get remaining count
      const { count, error: countError } = await supabase
        .from('collector_nft_certificates')
        .select('*', { count: 'exact', head: true })
        .eq('drop_id', dropData.id)
        .eq('status', 'available');

      if (countError) throw countError;
      setRemaining(count || 0);
    } catch (err) {
      console.error('Error fetching drop:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch drop');
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchDrop();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('collector-drop-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collector_nft_certificates',
        },
        () => {
          fetchDrop();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDrop]);

  const reserveCertificate = async (sessionId: string): Promise<{ certificateId: string; serialNumber: number } | null> => {
    if (!drop) return null;

    try {
      const { data, error } = await supabase.rpc('reserve_next_certificate', {
        p_drop_id: drop.id,
        p_session_id: sessionId
      });

      if (error) throw error;
      
      if (data && data.length > 0 && data[0].certificate_id) {
        await fetchDrop(); // Refresh remaining count
        return {
          certificateId: data[0].certificate_id,
          serialNumber: data[0].serial_number
        };
      }
      return null;
    } catch (err) {
      console.error('Error reserving certificate:', err);
      return null;
    }
  };

  return {
    drop,
    remaining,
    isLoading,
    error,
    isSoldOut: remaining === 0,
    reserveCertificate,
    refetch: fetchDrop
  };
}
