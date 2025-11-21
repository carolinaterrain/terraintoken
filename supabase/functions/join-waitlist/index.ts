import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WaitlistRequest {
  email: string;
  wallet_address?: string;
  referral_code?: string;
  beta_application?: string;
  utm_source?: string;
  utm_campaign?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { email, wallet_address, referral_code, beta_application, utm_source, utm_campaign }: WaitlistRequest = await req.json();

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique referral code
    const generateReferralCode = () => {
      return `TS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    };

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

    // Check if TRN holder (if wallet provided)
    let isTrnHolder = false;
    let trnBalance = 0;
    
    if (wallet_address) {
      // Assume TRN holder if wallet provided (can add Solana RPC check later)
      isTrnHolder = true;
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
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Insert into waitlist
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
          ip: req.headers.get('x-forwarded-for')
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to join waitlist', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current position in waitlist (count of entries with higher or equal priority)
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
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
