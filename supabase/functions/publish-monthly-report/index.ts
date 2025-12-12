import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { report_month } = await req.json();

    if (!report_month) {
      return new Response(
        JSON.stringify({ error: 'report_month is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the monthly report
    const { data: report, error: reportError } = await supabase
      .from('monthly_ecosystem_reports')
      .select('*')
      .eq('report_month', report_month)
      .single();

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (report.is_finalized) {
      return new Response(
        JSON.stringify({ error: 'Report is already finalized' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify all required events have occurred
    const { data: events } = await supabase
      .from('ecosystem_events')
      .select('event_type')
      .eq('report_month', report_month);

    const eventTypes = new Set(events?.map(e => e.event_type) || []);
    const requiredEvents = ['TV_MONTH_CLOSED', 'BAND_DETERMINED'];
    const missingEvents = requiredEvents.filter(e => !eventTypes.has(e));

    // BURN_EXECUTED is optional - only required if there's USD to burn
    if (report.usd_for_buyback > 0 && !eventTypes.has('BURN_EXECUTED')) {
      missingEvents.push('BURN_EXECUTED');
    }

    if (missingEvents.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Cannot finalize report - missing required events',
          missing_events: missingEvents,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Finalize the report
    const { error: updateError } = await supabase
      .from('monthly_ecosystem_reports')
      .update({
        is_finalized: true,
        finalized_at: new Date().toISOString(),
      })
      .eq('id', report.id);

    if (updateError) {
      console.error('Error finalizing report:', updateError);
      throw updateError;
    }

    // Emit REPORT_PUBLISHED event
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'REPORT_PUBLISHED',
        source_app: 'trn',
        report_month: report_month,
        payload: {
          report_id: report.id,
          finalized_at: new Date().toISOString(),
          summary: {
            gross_ai_revenue: report.gross_ai_revenue,
            variable_ai_costs: report.variable_ai_costs,
            net_ai_revenue: report.net_ai_revenue,
            verified_analyses: report.verified_analyses,
            final_burn_rate: report.final_burn_rate,
            usd_for_buyback: report.usd_for_buyback,
            trn_burned: report.trn_burned,
            buyback_tx_hash: report.buyback_tx_hash,
            burn_tx_hash: report.burn_tx_hash,
          },
        },
      });

    console.log('Report published successfully:', report.id);

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        finalized_at: new Date().toISOString(),
        message: 'Report published and locked. Data is now immutable.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in publish-monthly-report:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
