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

import { useLiveHolderCount } from '../useLiveHolderCount';
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

describe('useLiveHolderCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return holder data on successful fetch', async () => {
    const mockData = {
      holderCount: 191,
      totalHolders: 191,
      tiers: {
        shrimp: 150,
        crab: 25,
        fish: 10,
        dolphin: 4,
        shark: 1,
        whale: 1,
        humpback: 0,
      },
      top10Percentage: 45.5,
      holders: [{ address: 'abc123', balance: 1000000, percentage: 10 }],
      source: 'helius',
      lastUpdated: new Date().toISOString(),
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() => useLiveHolderCount(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.holderCount).toBe(191);
    expect(result.current.data?.tiers.shrimp).toBe(150);
    expect(result.current.data?.source).toBe('helius');
  });

  it('should return error state on failed fetch', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: null,
      error: { message: 'Network error' },
    });

    const { result } = renderHook(() => useLiveHolderCount(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // On error, we return default values
    expect(result.current.data?.holderCount).toBe(0);
    expect(result.current.data?.source).toBe('error');
  });

  it('should call fetch-holder-data edge function', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: { holderCount: 100, totalHolders: 100, tiers: {}, holders: [], source: 'cache', lastUpdated: '' },
      error: null,
    });

    renderHook(() => useLiveHolderCount(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('fetch-holder-data');
    });
  });
});
