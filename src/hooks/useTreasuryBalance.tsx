import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TreasuryBalanceData {
  balance: number;
  balanceFormatted: string;
  walletAddress: string;
  lastUpdated: string;
  source: 'helius' | 'fallback' | 'cache';
}

// Phase 1.3: Improved fallback - show dash instead of "Error"
const FALLBACK_DATA: TreasuryBalanceData = {
  balance: 0,
  balanceFormatted: '—',
  walletAddress: 'H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu',
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

async function fetchTreasuryBalance(): Promise<TreasuryBalanceData> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-treasury-balance');
    
    if (error) {
      console.error('Error fetching treasury balance:', error);
      return FALLBACK_DATA;
    }
    
    // Validate response has required fields
    if (!data || typeof data.balance !== 'number') {
      console.warn('Invalid treasury balance response:', data);
      return FALLBACK_DATA;
    }
    
    return data as TreasuryBalanceData;
  } catch (err) {
    console.error('Treasury balance fetch exception:', err);
    return FALLBACK_DATA;
  }
}

export function useTreasuryBalance() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treasury-balance'],
    queryFn: fetchTreasuryBalance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    treasuryBalance: data || FALLBACK_DATA,
    loading: isLoading,
    error,
    refetch,
    isLive: data?.source === 'helius' || data?.source === 'cache'
  };
}