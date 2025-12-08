import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import type { DataSource } from '@/components/ui/data-freshness-badge';

// Mock the TokenDataProvider
const mockTokenData: {
  data: any;
  holderCount: any;
  isLoading: boolean;
  dataSource: DataSource;
  lastUpdated: string | null;
  refetch: () => void;
} = {
  data: null,
  holderCount: null,
  isLoading: true,
  dataSource: 'fallback',
  lastUpdated: null,
  refetch: vi.fn(),
};

vi.mock('@/providers/TokenDataProvider', () => ({
  useTokenData: () => mockTokenData,
}));

import { useLiveHolderCount } from '../useLiveHolderCount';

describe('useLiveHolderCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock data
    mockTokenData.data = null;
    mockTokenData.holderCount = null;
    mockTokenData.isLoading = true;
    mockTokenData.dataSource = 'fallback';
    mockTokenData.lastUpdated = null;
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useLiveHolderCount());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should return holder data when loaded', () => {
    const mockData = {
      holderCount: 191,
      holderTiers: {
        shrimp: 150,
        crab: 25,
        fish: 10,
        dolphin: 4,
        shark: 1,
        whale: 1,
        humpback: 0,
      },
      top10Percentage: 45.5,
      source: 'live' as DataSource,
      lastUpdated: new Date().toISOString(),
    };

    mockTokenData.data = mockData;
    mockTokenData.isLoading = false;
    mockTokenData.dataSource = 'live';
    mockTokenData.lastUpdated = mockData.lastUpdated;

    const { result } = renderHook(() => useLiveHolderCount());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.holderCount).toBe(191);
    expect(result.current.data?.tiers.shrimp).toBe(150);
    expect(result.current.dataSource).toBe('live');
  });

  it('should transform data to UnifiedHolderData format', () => {
    const mockData = {
      holderCount: 100,
      holderTiers: {
        shrimp: 80,
        crab: 15,
        fish: 5,
        dolphin: 0,
        shark: 0,
        whale: 0,
        humpback: 0,
      },
      top10Percentage: 30,
      source: 'cache' as DataSource,
      lastUpdated: '2025-01-01T00:00:00Z',
    };

    mockTokenData.data = mockData;
    mockTokenData.isLoading = false;
    mockTokenData.dataSource = 'cache';
    mockTokenData.lastUpdated = mockData.lastUpdated;

    const { result } = renderHook(() => useLiveHolderCount());

    expect(result.current.data).toMatchObject({
      holderCount: 100,
      totalHolders: 100,
      tiers: mockData.holderTiers,
      top10Percentage: 30,
      holders: [],
      source: 'cache',
    });
  });
});
