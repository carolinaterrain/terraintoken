import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferralRequest {
  referrer_code: string;
  referred_email: string;
  action: 'signup' | 'conversion';
  conversion_value?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { referrer_code, referred_email, action, conversion_value }: ReferralRequest = await req.json();

    if (action === 'signup') {
      // Track new referral
      const { data, error } = await supabaseClient
        .from('referral_tracking')
        .insert({
          referrer_code,
          referred_email,
          metadata: { source: 'web' }
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return new Response(
            JSON.stringify({ message: 'Referral already tracked' }),
            { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        throw error;
      }

      // Create activity notification
      await supabaseClient.from('activity_notifications').insert({
        activity_type: 'referral_signup',
        user_identifier: referred_email.split('@')[0],
        message: `${referred_email.split('@')[0]} just joined via referral!`,
        metadata: { referrer_code }
      });

      console.log(`Referral tracked: ${referrer_code} -> ${referred_email}`);

      return new Response(
        JSON.stringify({ success: true, referral: data }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } else if (action === 'conversion') {
      // Update referral conversion
      const { data, error } = await supabaseClient
        .from('referral_tracking')
        .update({
          converted: true,
          conversion_value: conversion_value || 0
        })
        .eq('referrer_code', referrer_code)
        .eq('referred_email', referred_email)
        .select()
        .single();

      if (error) throw error;

      console.log(`Referral converted: ${referrer_code} -> ${referred_email}`);

      return new Response(
        JSON.stringify({ success: true, referral: data }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error tracking referral:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);
