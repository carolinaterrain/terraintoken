import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the hooks
vi.mock('@/hooks/useLiveHolderCount', () => ({
  useLiveHolderCount: vi.fn(() => ({
    data: {
      holderCount: 191,
      totalHolders: 191,
      tiers: { shrimp: 100, crab: 50, fish: 25, dolphin: 10, shark: 4, whale: 1, humpback: 1 },
      top10Percentage: 45,
      holders: [],
      source: 'helius',
      lastUpdated: new Date().toISOString(),
    },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/useTokenStats', () => ({
  useTokenStats: vi.fn(() => ({
    price: 0.00015,
    priceChange24h: 5.2,
    marketCap: 150000,
    volume24h: 25000,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/useTreasuryBalance', () => ({
  useTreasuryBalance: vi.fn(() => ({
    treasuryBalance: { balance: 5000000, source: 'helius', lastUpdated: '', balanceFormatted: '5M', walletAddress: '' },
    loading: false,
    error: null,
    isLive: true,
  })),
}));

vi.mock('@/hooks/useTokenSupply', () => ({
  useTokenSupply: vi.fn(() => ({
    data: { circulatingSupply: 900000000, totalSupply: 1000000000 },
    isLoading: false,
    error: null,
  })),
}));

// Minimal smoke tests - just verify modules can be imported
describe('GoblinMarket Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable without errors', async () => {
    const module = await import('@/pages/GoblinMarket');
    expect(module.default).toBeDefined();
  });
});

describe('Investors Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable without errors', async () => {
    const module = await import('@/pages/Investors');
    expect(module.default).toBeDefined();
  });
});
