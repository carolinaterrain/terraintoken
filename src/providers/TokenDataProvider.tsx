import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTRNStats } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { useSmartPolling } from '@/hooks/useSmartPolling';

interface TokenData {
  stats: any;
  supply: any;
  holderCount: any;
  isLoading: boolean;
  dataSource: {
    stats: 'live' | 'fallback';
    supply: 'live' | 'fallback';
    holders: 'live' | 'fallback';
  };
}

const TokenDataContext = createContext<TokenData | null>(null);

export const useTokenData = () => {
  const context = useContext(TokenDataContext);
  if (!context) {
    throw new Error('useTokenData must be used within TokenDataProvider');
  }
  return context;
};

export const TokenDataProvider = ({ children }: { children: ReactNode }) => {
  const statsPolling = useSmartPolling(60000);
  const supplyPolling = useSmartPolling(300000);
  const holderPolling = useSmartPolling(120000);

  // Fetch token stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['token-stats'],
    queryFn: fetchTRNStats,
    refetchInterval: statsPolling,
    staleTime: 55000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });

  // Fetch token supply
  const { data: supply, isLoading: supplyLoading } = useQuery({
    queryKey: ['token-supply'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-token-supply');
      if (error) {
        console.error('Error fetching token supply:', error);
        return {
          totalSupply: 1006699550,
          circulatingSupply: 550000000,
          decimals: 2,
          lastUpdated: new Date().toISOString(),
          isStale: true,
        };
      }
      return data;
    },
    refetchInterval: supplyPolling,
    staleTime: 240000,
  });

  // Fetch holder count
  const { data: holderCount, isLoading: holderLoading } = useQuery({
    queryKey: ['live-holder-count'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-trn-holders');
      if (error) {
        console.error('Error fetching holder count:', error);
        return { holderCount: 0, lastUpdated: new Date().toISOString(), source: 'error' };
      }
      return data;
    },
    refetchInterval: holderPolling,
    staleTime: 100000,
  });

  const value: TokenData = {
    stats,
    supply,
    holderCount,
    isLoading: statsLoading || supplyLoading || holderLoading,
    dataSource: {
      stats: stats?.marketCap !== "$--" ? 'live' : 'fallback',
      supply: supply?.isStale ? 'fallback' : 'live',
      holders: holderCount?.source === 'helius' ? 'live' : 'fallback',
    },
  };

  return (
    <TokenDataContext.Provider value={value}>
      {children}
    </TokenDataContext.Provider>
  );
};
