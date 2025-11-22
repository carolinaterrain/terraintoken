import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface RateLimitConfig {
  endpoint: string;
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

/**
 * Check if request exceeds rate limit
 */
export async function checkRateLimit(
  ip: string,
  config: RateLimitConfig,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const windowStart = new Date(Date.now() - config.windowMs);
  
  // Count recent requests from this IP for this endpoint
  const { data, error } = await supabase
    .from('rate_limit_tracker')
    .select('created_at', { count: 'exact' })
    .eq('ip_address', ip)
    .eq('endpoint', config.endpoint)
    .gte('created_at', windowStart.toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limit check fails
    return { allowed: true };
  }

  const requestCount = data?.length || 0;

  if (requestCount >= config.maxRequests) {
    // Find oldest request to calculate retry after
    if (data && data.length > 0) {
      const oldestRequest = new Date(data[0].created_at);
      const retryAfter = Math.ceil(
        (oldestRequest.getTime() + config.windowMs - Date.now()) / 1000
      );
      return { allowed: false, retryAfter };
    }
    return { allowed: false, retryAfter: Math.ceil(config.windowMs / 1000) };
  }

  // Log this request
  await supabase.from('rate_limit_tracker').insert({
    ip_address: ip,
    endpoint: config.endpoint
  });

  return { allowed: true };
}

/**
 * Extract IP address from request
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
