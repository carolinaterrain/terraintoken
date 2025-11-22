/**
 * Validate required secrets are configured
 */
export function validateSecrets(required: string[]): void {
  const missing = required.filter(key => !Deno.env.get(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required secrets: ${missing.join(', ')}`);
  }
}

/**
 * Validate email service secrets
 */
export function validateEmailSecrets(): void {
  validateSecrets(['RESEND_API_KEY', 'RESEND_FROM_EMAIL']);

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey?.startsWith('re_')) {
    throw new Error('Invalid RESEND_API_KEY format (should start with re_)');
  }

  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(fromEmail || '')) {
    throw new Error('Invalid RESEND_FROM_EMAIL format');
  }
}

/**
 * Security headers for edge functions
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.dexscreener.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.dexscreener.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
