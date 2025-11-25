import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Verification token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user with this verification token
    const { data: waitlistEntry, error: findError } = await supabase
      .from('terrainscape_waitlist')
      .select('*')
      .eq('metadata->>verification_token', token)
      .eq('status', 'pending_verification')
      .maybeSingle();

    if (findError || !waitlistEntry) {
      console.error('Verification token not found:', findError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to pending
    const { error: updateError } = await supabase
      .from('terrainscape_waitlist')
      .update({ status: 'pending' })
      .eq('id', waitlistEntry.id);

    if (updateError) {
      console.error('Failed to verify email:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email verified successfully for:', waitlistEntry.email);

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${Deno.env.get('SITE_URL') || 'https://terraintoken.com'}/?verified=true`
      }
    });

  } catch (error: any) {
    console.error('Verify email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
