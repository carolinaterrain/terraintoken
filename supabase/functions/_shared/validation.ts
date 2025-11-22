import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

/**
 * Waitlist signup validation schema
 */
export const waitlistSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform(str => str.toLowerCase().trim()),
  
  wallet_address: z.string()
    .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address')
    .optional(),
  
  referral_code: z.string()
    .regex(/^TS[A-Z0-9]{6}$/, 'Invalid referral code format')
    .optional(),
  
  beta_application: z.string()
    .max(1000, 'Application must be less than 1000 characters')
    .optional()
    .transform(str => str?.trim()),
  
  utm_source: z.enum(['twitter', 'discord', 'website', 'referral', 'other'])
    .optional(),
  
  utm_campaign: z.string()
    .max(100, 'Campaign name too long')
    .optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

/**
 * Validate and sanitize input
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}
