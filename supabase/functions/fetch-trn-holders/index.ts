import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function now proxies to fetch-holder-data for unified data
// Kept for backwards compatibility
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check unified cache - this is now the single source of truth
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('holder_count, last_updated, source')
      .eq('id', 'unified')
      .single();

    const cacheAge = cached?.last_updated 
      ? Date.now() - new Date(cached.last_updated).getTime()
      : Infinity;
    
    // Return cached data if less than 5 minutes old
    if (cached && cached.holder_count > 0 && cacheAge < 300000) {
      console.log(`Returning unified cached holder count: ${cached.holder_count}`);
      return new Response(
        JSON.stringify({
          holderCount: cached.holder_count,
          lastUpdated: cached.last_updated,
          source: 'cache',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If cache is stale, call fetch-holder-data to refresh
    console.log('Cache stale, invoking fetch-holder-data...');
    
    const { data, error } = await supabase.functions.invoke('fetch-holder-data');
    
    if (error) {
      console.error('Error invoking fetch-holder-data:', error);
      // Return stale cache if available
      if (cached && cached.holder_count > 0) {
        return new Response(
          JSON.stringify({
            holderCount: cached.holder_count,
            lastUpdated: cached.last_updated,
            source: 'stale-cache',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        holderCount: data.holderCount || data.totalHolders || 0,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        source: data.source || 'helius-das',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-trn-holders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        holderCount: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error',
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
