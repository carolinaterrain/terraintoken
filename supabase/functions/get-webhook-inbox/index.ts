/**
 * Get Webhook Inbox
 * Returns recent webhook entries for admin monitoring
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase } from "../_shared/ecosystem.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 20 } = await req.json().catch(() => ({}));
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('webhook_inbox')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data || []),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-webhook-inbox:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
