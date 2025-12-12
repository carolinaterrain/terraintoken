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
        JSON.stringify({ error: 'Report not found. Call close-monthly-report first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (report.is_finalized) {
      return new Response(
        JSON.stringify({ error: 'Report is already finalized' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const netRevenue = report.net_ai_revenue;
    console.log('Determining band for net revenue:', netRevenue);

    // Get current burn bands
    const { data: bands, error: bandsError } = await supabase
      .from('burn_bands')
      .select('*')
      .lte('effective_from', new Date().toISOString())
      .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString())
      .order('min_revenue', { ascending: true });

    if (bandsError || !bands?.length) {
      console.error('Error fetching burn bands:', bandsError);
      return new Response(
        JSON.stringify({ error: 'No burn bands configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the applicable band
    const applicableBand = bands.find(band => 
      netRevenue >= band.min_revenue && 
      (band.max_revenue === null || netRevenue < band.max_revenue)
    );

    if (!applicableBand) {
      console.error('No applicable band found for revenue:', netRevenue);
      return new Response(
        JSON.stringify({ error: 'No applicable burn band for this revenue level' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if usage bonus applies
    const usageBonusApplied = report.verified_analyses >= applicableBand.usage_bonus_threshold;
    const finalBurnRate = usageBonusApplied 
      ? applicableBand.burn_rate + applicableBand.usage_bonus_rate
      : applicableBand.burn_rate;

    // Get guardrails
    const { data: guardrails } = await supabase
      .from('guardrails')
      .select('guardrail_type, value')
      .lte('effective_from', new Date().toISOString())
      .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString());

    const guardrailMap = new Map(guardrails?.map(g => [g.guardrail_type, g.value]) || []);
    const maxBurnPercent = guardrailMap.get('max_burn_percent') || 0.10;
    const maxBurnUsd = guardrailMap.get('max_burn_usd') || 50000;

    // Apply guardrails
    let cappedBurnRate = Math.min(finalBurnRate, maxBurnPercent);
    let usdForBuyback = netRevenue * cappedBurnRate;
    
    if (usdForBuyback > maxBurnUsd) {
      usdForBuyback = maxBurnUsd;
      cappedBurnRate = maxBurnUsd / netRevenue;
    }

    console.log('Band determined:', {
      band_id: applicableBand.id,
      base_rate: applicableBand.burn_rate,
      usage_bonus: usageBonusApplied,
      final_rate: cappedBurnRate,
      usd_for_buyback: usdForBuyback,
    });

    // Update the report with band info
    const { error: updateError } = await supabase
      .from('monthly_ecosystem_reports')
      .update({
        determined_band_id: applicableBand.id,
        base_burn_rate: applicableBand.burn_rate,
        usage_bonus_applied: usageBonusApplied,
        final_burn_rate: cappedBurnRate,
        usd_for_buyback: usdForBuyback,
      })
      .eq('id', report.id);

    if (updateError) {
      console.error('Error updating report:', updateError);
      throw updateError;
    }

    // Emit BAND_DETERMINED event
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'BAND_DETERMINED',
        source_app: 'trn',
        report_month: report_month,
        payload: {
          report_id: report.id,
          band_id: applicableBand.id,
          net_revenue: netRevenue,
          base_burn_rate: applicableBand.burn_rate,
          usage_bonus_applied: usageBonusApplied,
          final_burn_rate: cappedBurnRate,
          usd_for_buyback: usdForBuyback,
          guardrails_applied: {
            max_burn_percent: maxBurnPercent,
            max_burn_usd: maxBurnUsd,
          },
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        band: {
          id: applicableBand.id,
          min_revenue: applicableBand.min_revenue,
          max_revenue: applicableBand.max_revenue,
          base_rate: applicableBand.burn_rate,
        },
        usage_bonus_applied: usageBonusApplied,
        final_burn_rate: cappedBurnRate,
        usd_for_buyback: usdForBuyback,
        message: 'Band determined. Call execute-buyback-burn to proceed.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in determine-burn-band:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
