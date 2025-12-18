/**
 * Helius API Gateway - Centralized rate limiting, caching, and circuit breaker
 * Uses database-backed circuit breaker state for persistence across function invocations
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Circuit breaker configuration
const CONFIG = {
  maxFailures: 3,
  resetTimeout: 60000, // 1 minute
  cacheDuration: {
    transactions: 600000,  // 10 minutes
    holders: 900000,       // 15 minutes
    unified: 900000,       // 15 minutes
  },
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  },
};

// Circuit breaker state interface (stored in database)
interface CircuitState {
  isOpen: boolean;
  failureCount: number;
  lastFailure: number;
  nextRetryTime: number;
}

const CIRCUIT_BREAKER_KEY = 'helius-circuit-breaker';

/**
 * Sleep helper with optional jitter
 */
export const sleep = (ms: number, addJitter = true): Promise<void> => {
  const jitter = addJitter ? Math.random() * 500 : 0;
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
};

/**
 * Calculate exponential backoff delay
 */
export const getBackoffDelay = (attempt: number, baseDelay = 1000, maxDelay = 30000): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, maxDelay);
};

/**
 * Get circuit breaker state from database
 */
export async function getCircuitState(supabase: SupabaseClient): Promise<CircuitState> {
  try {
    const { data, error } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', CIRCUIT_BREAKER_KEY)
      .single();

    if (error || !data) {
      // Return default closed state if not found
      return {
        isOpen: false,
        failureCount: 0,
        lastFailure: 0,
        nextRetryTime: 0,
      };
    }

    // Parse state from the source field (JSON string)
    const state = JSON.parse(data.source || '{}');
    return {
      isOpen: state.isOpen || false,
      failureCount: state.failureCount || 0,
      lastFailure: state.lastFailure || 0,
      nextRetryTime: state.nextRetryTime || 0,
    };
  } catch (e) {
    console.error('[HeliusGateway] Error reading circuit state:', e);
    return {
      isOpen: false,
      failureCount: 0,
      lastFailure: 0,
      nextRetryTime: 0,
    };
  }
}

/**
 * Save circuit breaker state to database
 */
async function saveCircuitState(supabase: SupabaseClient, state: CircuitState): Promise<void> {
  try {
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: CIRCUIT_BREAKER_KEY,
        holder_count: state.failureCount, // Store failure count in holder_count field
        last_updated: new Date().toISOString(),
        source: JSON.stringify(state), // Store full state as JSON
      });
  } catch (e) {
    console.error('[HeliusGateway] Error saving circuit state:', e);
  }
}

/**
 * Check if circuit breaker should allow request
 */
export async function isCircuitOpen(supabase: SupabaseClient): Promise<boolean> {
  const state = await getCircuitState(supabase);
  
  if (!state.isOpen) return false;
  
  // Check if we should try again (half-open state)
  if (Date.now() >= state.nextRetryTime) {
    console.log('[HeliusGateway] Circuit breaker half-open, allowing test request');
    return false;
  }
  
  console.log(`[HeliusGateway] Circuit breaker OPEN until ${new Date(state.nextRetryTime).toISOString()}`);
  return true;
}

/**
 * Record a successful request - reset circuit breaker
 */
export async function recordSuccess(supabase: SupabaseClient): Promise<void> {
  const newState: CircuitState = {
    isOpen: false,
    failureCount: 0,
    lastFailure: 0,
    nextRetryTime: 0,
  };
  await saveCircuitState(supabase, newState);
  console.log('[HeliusGateway] Request successful, circuit breaker reset');
}

/**
 * Record a failed request - increment failure count or open circuit
 */
export async function recordFailure(supabase: SupabaseClient): Promise<void> {
  const state = await getCircuitState(supabase);
  
  state.failureCount++;
  state.lastFailure = Date.now();
  
  if (state.failureCount >= CONFIG.maxFailures) {
    state.isOpen = true;
    state.nextRetryTime = Date.now() + CONFIG.resetTimeout;
    console.log(`[HeliusGateway] Circuit breaker OPEN after ${state.failureCount} failures. Next retry at ${new Date(state.nextRetryTime).toISOString()}`);
  } else {
    console.log(`[HeliusGateway] Failure ${state.failureCount}/${CONFIG.maxFailures}`);
  }
  
  await saveCircuitState(supabase, state);
}

/**
 * Get current circuit breaker status (for diagnostics)
 */
export async function getCircuitStatus(supabase: SupabaseClient): Promise<{ isOpen: boolean; failureCount: number; nextRetryTime: number }> {
  const state = await getCircuitState(supabase);
  return {
    isOpen: state.isOpen,
    failureCount: state.failureCount,
    nextRetryTime: state.nextRetryTime,
  };
}

/**
 * Fetch with retry and exponential backoff - uses database-backed circuit breaker
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  supabase: SupabaseClient,
  maxRetries = CONFIG.retryConfig.maxRetries
): Promise<Response> {
  // Check circuit breaker
  if (await isCircuitOpen(supabase)) {
    throw new Error('Circuit breaker is open - too many recent failures');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting with exponential backoff
      if (response.status === 429) {
        const waitTime = getBackoffDelay(attempt, CONFIG.retryConfig.baseDelay, CONFIG.retryConfig.maxDelay);
        console.log(`[HeliusGateway] Rate limited (429), waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await recordFailure(supabase);
        await sleep(waitTime);
        continue;
      }
      
      // Handle server errors
      if (response.status >= 500) {
        const waitTime = getBackoffDelay(attempt);
        console.log(`[HeliusGateway] Server error (${response.status}), waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await recordFailure(supabase);
        await sleep(waitTime);
        continue;
      }
      
      // Success
      await recordSuccess(supabase);
      return response;
    } catch (error) {
      lastError = error as Error;
      await recordFailure(supabase);
      
      const waitTime = getBackoffDelay(attempt);
      console.log(`[HeliusGateway] Request failed: ${lastError.message}, waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
      await sleep(waitTime);
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Check if cache is valid
 */
export const isCacheValid = (lastUpdated: string | null, duration: number): boolean => {
  if (!lastUpdated) return false;
  const age = Date.now() - new Date(lastUpdated).getTime();
  return age < duration;
};

/**
 * Get cache age in seconds
 */
export const getCacheAgeSeconds = (lastUpdated: string | null): number => {
  if (!lastUpdated) return Infinity;
  return Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
};

export { CONFIG };
