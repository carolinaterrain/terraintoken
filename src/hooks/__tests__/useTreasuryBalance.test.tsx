import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { useTreasuryBalance } from '../useTreasuryBalance';
import { supabase } from '@/integrations/supabase/client';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTreasuryBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return treasury data on successful fetch', async () => {
    const mockData = {
      balance: 5000000,
      balanceFormatted: '5,000,000 TRN',
      walletAddress: 'H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu',
      lastUpdated: new Date().toISOString(),
      source: 'helius',
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() => useTreasuryBalance(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.treasuryBalance.balance).toBe(5000000);
    expect(result.current.treasuryBalance.source).toBe('helius');
    expect(result.current.isLive).toBe(true);
  });

  it('should handle error state gracefully', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: null,
      error: { message: 'API error' },
    });

    const { result } = renderHook(() => useTreasuryBalance(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should return fallback data on error
    expect(result.current.treasuryBalance.source).toBe('fallback');
    expect(result.current.isLive).toBe(false);
  });

  it('should call fetch-treasury-balance edge function', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: { balance: 0, balanceFormatted: '0', walletAddress: '', lastUpdated: '', source: 'fallback' },
      error: null,
    });

    renderHook(() => useTreasuryBalance(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('fetch-treasury-balance');
    });
  });
});
