import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns trackEvent function', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(typeof result.current.trackEvent).toBe('function');
  });

  it('returns trackPageView function', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(typeof result.current.trackPageView).toBe('function');
  });

  it('trackEvent does not throw', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(() => {
      act(() => {
        result.current.trackEvent('test_event', { test: 'data' });
      });
    }).not.toThrow();
  });

  it('trackPageView does not throw', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(() => {
      act(() => {
        result.current.trackPageView('/test-page');
      });
    }).not.toThrow();
  });
});
