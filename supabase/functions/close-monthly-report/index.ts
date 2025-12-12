import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tv-signature',
};

interface MonthClosePayload {
  report_month: string; // YYYY-MM-DD (first of month)
  gross_ai_revenue: number;
  variable_ai_costs: number;
  verified_analyses: number;
  active_users: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const syncSecret = Deno.env.get('TRN_SYNC_SECRET');

    // Verify signature from TerrainVision
    const signature = req.headers.get('x-tv-signature');
    if (!signature || signature !== syncSecret) {
      console.error('Invalid or missing signature');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: MonthClosePayload = await req.json();
    console.log('Received month close payload:', payload);

    // Validate payload
    if (!payload.report_month || payload.gross_ai_revenue === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if report already exists and is finalized
    const { data: existingReport } = await supabase
      .from('monthly_ecosystem_reports')
      .select('id, is_finalized')
      .eq('report_month', payload.report_month)
      .single();

    if (existingReport?.is_finalized) {
      return new Response(
        JSON.stringify({ error: 'Report for this month is already finalized' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or update the monthly report
    const reportData = {
      report_month: payload.report_month,
      gross_ai_revenue: payload.gross_ai_revenue,
      variable_ai_costs: payload.variable_ai_costs,
      verified_analyses: payload.verified_analyses,
      active_users: payload.active_users,
      data_source: 'terrainvision',
    };

    const { data: report, error: reportError } = await supabase
      .from('monthly_ecosystem_reports')
      .upsert(reportData, { onConflict: 'report_month' })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating report:', reportError);
      throw reportError;
    }

    // Emit TV_MONTH_CLOSED event
    const { error: eventError } = await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'TV_MONTH_CLOSED',
        source_app: 'terrainvision',
        report_month: payload.report_month,
        payload: {
          report_id: report.id,
          gross_ai_revenue: payload.gross_ai_revenue,
          variable_ai_costs: payload.variable_ai_costs,
          net_ai_revenue: payload.gross_ai_revenue - payload.variable_ai_costs,
          verified_analyses: payload.verified_analyses,
          active_users: payload.active_users,
        },
      });

    if (eventError) {
      console.error('Error creating event:', eventError);
    }

    console.log('Month closed successfully:', report.id);

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        net_ai_revenue: payload.gross_ai_revenue - payload.variable_ai_costs,
        message: 'Month closed. Call determine-burn-band to calculate burn rate.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in close-monthly-report:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
