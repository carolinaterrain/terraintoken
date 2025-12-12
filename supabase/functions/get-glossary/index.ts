import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const termKey = url.searchParams.get('term');

    if (termKey) {
      // Get a specific term
      const { data: term, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('term_key', termKey)
        .single();

      if (error || !term) {
        return new Response(
          JSON.stringify({ error: 'Term not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(term),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all terms
    const { data: terms, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('term_name');

    if (error) {
      throw error;
    }

    // Also create a lookup map for convenience
    const termMap: Record<string, any> = {};
    terms?.forEach(term => {
      termMap[term.term_key] = term;
    });

    return new Response(
      JSON.stringify({
        terms: terms || [],
        lookup: termMap,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-glossary:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
