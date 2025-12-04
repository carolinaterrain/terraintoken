import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Import the hook
import { useTokenStats } from '@/hooks/useTokenStats';

// Create wrapper for React Query
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

describe('useTokenStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useTokenStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns useQuery result object', () => {
    const { result } = renderHook(() => useTokenStats(), {
      wrapper: createWrapper(),
    });

    // Check that it returns a useQuery result with expected properties
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
  });
});
