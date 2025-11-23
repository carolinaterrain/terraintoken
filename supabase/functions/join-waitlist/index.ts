import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { waitlistSchema, validateInput } from '../_shared/validation.ts';
import { securityHeaders } from '../_shared/secrets.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 3; // 3 signups per hour per IP

/**
 * Check rate limit for IP address
 */
async function checkRateLimit(ip: string, supabase: any): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();
  
  const { count, error } = await supabase
    .from('terrainscape_waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('metadata->>ip', ip)
    .gte('created_at', windowStart);

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Fail open on error
  }

  return (count || 0) < RATE_LIMIT_MAX;
}

/**
 * Generate unique referral code
 */
function generateReferralCode(): string {
  return `TS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/**
 * Find unique referral code
 */
async function findUniqueReferralCode(supabase: any): Promise<string> {
  let newReferralCode = generateReferralCode();
  let attempts = 0;
  
  while (attempts < 5) {
    const { data: codeExists } = await supabase
      .from('terrainscape_waitlist')
      .select('referral_code')
      .eq('referral_code', newReferralCode)
      .single();
    
    if (!codeExists) break;
    newReferralCode = generateReferralCode();
    attempts++;
  }
  
  return newReferralCode;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { ...corsHeaders, ...securityHeaders } 
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user IP for rate limiting
    const userIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';

    // Check rate limit
    if (userIP !== 'unknown') {
      const rateLimitOk = await checkRateLimit(userIP, supabase);
      if (!rateLimitOk) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in 1 hour.',
            retryAfter: 3600 
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders,
              ...securityHeaders,
              'Content-Type': 'application/json',
              'Retry-After': '3600'
            } 
          }
        );
      }
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('JSON parse error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: 'Request body must be valid JSON'
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('Received waitlist request:', { 
      email: body.email, 
      hasWallet: !!body.wallet_address,
      hasReferral: !!body.referral_code 
    });

    const validation = validateInput(waitlistSchema, body);

    if (!validation.success) {
      console.error('Validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: validation.errors.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const { email, wallet_address, referral_code, beta_application, utm_source, utm_campaign } = validation.data;

    console.log('Validated input:', { 
      email, 
      hasWallet: !!wallet_address,
      referredBy: referral_code || 'none',
      utm_source: utm_source || 'none'
    });

    // Check if already registered
    const { data: existing } = await supabase
      .from('terrainscape_waitlist')
      .select('id, referral_code')
      .eq('email', email)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ 
          error: 'Email already registered', 
          existing: true,
          referral_code: existing.referral_code
        }),
        { 
          status: 409, 
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Generate unique referral code
    const newReferralCode = await findUniqueReferralCode(supabase);

    // Check if TRN holder (if wallet provided)
    let isTrnHolder = false;
    let trnBalance = 0;
    
    if (wallet_address) {
      isTrnHolder = true; // Placeholder - add Solana RPC check later
    }

    // Calculate priority score
    let priorityScore = 0;
    if (isTrnHolder) priorityScore += 100;
    if (referral_code) priorityScore += 50;
    if (beta_application && beta_application.length > 50) priorityScore += 25;
    if (utm_source === 'twitter' || utm_source === 'discord') priorityScore += 10;

    // Validate referral code exists if provided
    if (referral_code) {
      const { data: referrer } = await supabase
        .from('terrainscape_waitlist')
        .select('referral_code')
        .eq('referral_code', referral_code)
        .single();
      
      if (!referrer) {
        return new Response(
          JSON.stringify({ error: 'Invalid referral code' }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders, 
              ...securityHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
    }

    // Insert into waitlist with metadata
    const { data: newEntry, error } = await supabase
      .from('terrainscape_waitlist')
      .insert({
        email,
        wallet_address,
        referral_code: newReferralCode,
        referred_by: referral_code || null,
        priority_score: priorityScore,
        is_trn_holder: isTrnHolder,
        trn_balance: trnBalance,
        beta_application,
        signup_source: utm_source || 'website',
        utm_source,
        utm_campaign,
        metadata: {
          user_agent: req.headers.get('user-agent'),
          ip: userIP,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to join waitlist', details: error.message }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Get current position in waitlist
    const { count } = await supabase
      .from('terrainscape_waitlist')
      .select('id', { count: 'exact', head: true })
      .gte('priority_score', priorityScore);

    console.log('New waitlist signup:', email, 'Position:', count, 'Priority:', priorityScore);

    return new Response(
      JSON.stringify({
        success: true,
        position: count || 1,
        referral_code: newReferralCode,
        priority_score: priorityScore,
        message: isTrnHolder 
          ? '🎉 Priority access granted! TRN holders get early access.'
          : '✅ You\'re on the list! Share your referral code to move up.'
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
