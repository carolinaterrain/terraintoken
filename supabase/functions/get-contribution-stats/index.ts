import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching contribution stats...');

    // Use service role to bypass RLS and get accurate counts
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get total photos count (all photos, regardless of status)
    const { count: photosCount, error: photosError } = await supabase
      .from('project_media')
      .select('*', { count: 'exact', head: true });

    if (photosError) {
      console.error('Error fetching photos count:', photosError);
    }

    // Get total TRN distributed
    const { data: trnData, error: trnError } = await supabase
      .from('trn_rewards')
      .select('trn_amount');

    if (trnError) {
      console.error('Error fetching TRN rewards:', trnError);
    }

    const totalTRN = trnData?.reduce((sum, r) => sum + (Number(r.trn_amount) || 0), 0) || 0;

    // Get active contributors (users with at least one upload)
    const { data: contributorsData, error: contributorsError } = await supabase
      .from('user_stats')
      .select('user_wallet_address')
      .gt('total_uploads', 0);

    if (contributorsError) {
      console.error('Error fetching contributors:', contributorsError);
    }

    const stats = {
      photos: photosCount || 0,
      trn_distributed: totalTRN,
      contributors: contributorsData?.length || 0,
      last_updated: new Date().toISOString(),
    };

    console.log('Contribution stats:', stats);

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // Cache for 60 seconds
        } 
      }
    );
  } catch (error: unknown) {
    console.error('Error in get-contribution-stats:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
