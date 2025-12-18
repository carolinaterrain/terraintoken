/**
 * Helius API Gateway - Centralized rate limiting, caching, and circuit breaker
 * This module handles all Helius API calls with proper error handling
 */

// Circuit breaker state
interface CircuitState {
  isOpen: boolean;
  failureCount: number;
  lastFailure: number;
  nextRetryTime: number;
}

const circuitBreaker: CircuitState = {
  isOpen: false,
  failureCount: 0,
  lastFailure: 0,
  nextRetryTime: 0,
};

// Configuration
const CONFIG = {
  maxFailures: 3,
  resetTimeout: 60000, // 1 minute
  cacheDuration: {
    transactions: 600000,  // 10 minutes
    holders: 600000,       // 10 minutes
    unified: 900000,       // 15 minutes
  },
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  },
};

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
 * Check if circuit breaker should allow request
 */
export const isCircuitOpen = (): boolean => {
  if (!circuitBreaker.isOpen) return false;
  
  // Check if we should try again
  if (Date.now() >= circuitBreaker.nextRetryTime) {
    console.log('[HeliusGateway] Circuit breaker half-open, allowing test request');
    return false;
  }
  
  return true;
};

/**
 * Record a successful request
 */
export const recordSuccess = (): void => {
  circuitBreaker.failureCount = 0;
  circuitBreaker.isOpen = false;
  console.log('[HeliusGateway] Request successful, circuit breaker reset');
};

/**
 * Record a failed request
 */
export const recordFailure = (): void => {
  circuitBreaker.failureCount++;
  circuitBreaker.lastFailure = Date.now();
  
  if (circuitBreaker.failureCount >= CONFIG.maxFailures) {
    circuitBreaker.isOpen = true;
    circuitBreaker.nextRetryTime = Date.now() + CONFIG.resetTimeout;
    console.log(`[HeliusGateway] Circuit breaker OPEN after ${circuitBreaker.failureCount} failures. Next retry at ${new Date(circuitBreaker.nextRetryTime).toISOString()}`);
  }
};

/**
 * Get current circuit breaker status
 */
export const getCircuitStatus = (): { isOpen: boolean; failureCount: number; nextRetryTime: number } => ({
  isOpen: circuitBreaker.isOpen,
  failureCount: circuitBreaker.failureCount,
  nextRetryTime: circuitBreaker.nextRetryTime,
});

/**
 * Fetch with retry and exponential backoff
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = CONFIG.retryConfig.maxRetries
): Promise<Response> {
  // Check circuit breaker
  if (isCircuitOpen()) {
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
        recordFailure();
        await sleep(waitTime);
        continue;
      }
      
      // Handle server errors
      if (response.status >= 500) {
        const waitTime = getBackoffDelay(attempt);
        console.log(`[HeliusGateway] Server error (${response.status}), waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        recordFailure();
        await sleep(waitTime);
        continue;
      }
      
      // Success
      recordSuccess();
      return response;
    } catch (error) {
      lastError = error as Error;
      recordFailure();
      
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
