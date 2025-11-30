import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow GET
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch latest stats and burn totals in parallel
    const [statsResult, burnResult] = await Promise.all([
      supabase
        .from('trn_live_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('token_burns')
        .select('burn_amount')
    ]);

    if (statsResult.error) {
      console.error('Error fetching live stats:', statsResult.error);
      
      // Return fallback data if no stats found
      if (statsResult.error.code === 'PGRST116') {
        // Calculate burn total even in fallback mode
        const totalBurned = burnResult.data?.reduce((sum, b) => sum + (Number(b.burn_amount) || 0), 0) || 0;
        
        return new Response(
          JSON.stringify({
            current_supply: 550000000,
            total_issued: 1006699550,
            max_supply: 1000000000,
            active_users: 0,
            price_usd: 0.0000001,
            price_sol: 0.000000001,
            price_change_24h: 0,
            market_cap_usd: 55,
            volume_24h_usd: 0,
            liquidity_usd: 0,
            total_burned: totalBurned,
            created_at: new Date().toISOString(),
            is_fallback: true,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch stats', details: statsResult.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate live total burned from token_burns table
    const totalBurned = burnResult.data?.reduce((sum, b) => sum + (Number(b.burn_amount) || 0), 0) || 0;

    // Log for debugging
    console.log('Stats fetched successfully:', {
      hasStats: !!statsResult.data,
      totalBurned,
      burnRecordCount: burnResult.data?.length || 0
    });

    // Add cache headers for performance
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
    };

    return new Response(
      JSON.stringify({
        ...statsResult.data,
        total_burned: totalBurned, // Always use live burn total from token_burns
        is_fallback: false,
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Get live stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
