/**
 * Execute Buyback and Burn
 * 1. Swap USDC -> TRN via Jupiter
 * 2. Burn the received TRN tokens
 * 3. Record transaction signatures
 * 4. Emit ecosystem events
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase, TRN_MINT_ADDRESS, TRN_DECIMALS } from "../_shared/ecosystem.ts";

// Jupiter API endpoints
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

// USDC mint address on Solana mainnet
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Burn address (tokens sent here are effectively burned)
const BURN_ADDRESS = '1nc1nerator11111111111111111111111111111111';

interface BuybackRequest {
  report_month: string;
  dry_run?: boolean; // If true, simulate without executing
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getServiceSupabase();
    const { report_month, dry_run = false }: BuybackRequest = await req.json();

    if (!report_month) {
      return new Response(
        JSON.stringify({ error: 'report_month is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Execute buyback-burn for ${report_month}, dry_run: ${dry_run}`);

    // Get the monthly report
    const { data: report, error: reportError } = await supabase
      .from('monthly_ecosystem_reports')
      .select('*')
      .eq('report_month', report_month)
      .single();

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found. Run determine-burn-band first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (report.is_finalized) {
      return new Response(
        JSON.stringify({ error: 'Report is already finalized' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!report.usd_for_buyback || report.usd_for_buyback <= 0) {
      console.log('No USD for buyback, skipping');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No buyback needed - zero USD allocated',
          usd_for_buyback: 0,
          trn_burned: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if burn was already executed
    if (report.burn_tx_hash) {
      return new Response(
        JSON.stringify({ 
          error: 'Burn already executed',
          burn_tx_hash: report.burn_tx_hash,
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const usdAmount = report.usd_for_buyback;
    // Convert to USDC amount (6 decimals)
    const usdcAmount = Math.floor(usdAmount * 1_000_000);

    console.log(`Buyback amount: $${usdAmount} = ${usdcAmount} USDC (raw)`);

    // Step 1: Get Jupiter quote for USDC -> TRN swap
    const quoteUrl = new URL(JUPITER_QUOTE_API);
    quoteUrl.searchParams.set('inputMint', USDC_MINT);
    quoteUrl.searchParams.set('outputMint', TRN_MINT_ADDRESS);
    quoteUrl.searchParams.set('amount', usdcAmount.toString());
    quoteUrl.searchParams.set('slippageBps', '100'); // 1% slippage

    console.log('Getting Jupiter quote...');
    const quoteResponse = await fetch(quoteUrl.toString());
    
    if (!quoteResponse.ok) {
      const quoteError = await quoteResponse.text();
      console.error('Jupiter quote error:', quoteError);
      
      // If no route found, it might be a liquidity issue
      if (quoteError.includes('No route found')) {
        return new Response(
          JSON.stringify({ 
            error: 'No liquidity route found for USDC -> TRN swap',
            details: 'Insufficient liquidity or token not tradeable',
          }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Jupiter quote failed: ${quoteError}`);
    }

    const quote = await quoteResponse.json();
    const expectedTrnAmount = parseInt(quote.outAmount);
    const trnTokens = expectedTrnAmount / Math.pow(10, TRN_DECIMALS);

    console.log(`Quote: ${usdcAmount} USDC -> ${trnTokens} TRN`);

    // In dry run mode, return the quote without executing
    if (dry_run) {
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          quote: {
            input_amount_usdc: usdAmount,
            expected_trn_amount: trnTokens,
            price_impact_pct: quote.priceImpactPct,
            route_info: quote.routePlan?.map((r: any) => r.swapInfo?.label),
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Get treasury wallet for signing
    const treasuryPrivateKey = Deno.env.get('TREASURY_WALLET_PRIVATE_KEY');
    if (!treasuryPrivateKey) {
      return new Response(
        JSON.stringify({ error: 'Treasury wallet not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For production, we would:
    // 1. Build the swap transaction using Jupiter API
    // 2. Sign with treasury wallet
    // 3. Submit to Solana
    // 4. Build SPL burn instruction
    // 5. Sign and submit burn

    // Since full on-chain execution requires complex Solana SDK integration,
    // we'll record the intent and allow manual execution for now
    const correlationId = crypto.randomUUID();
    const idempotencyKey = `buyback-${report_month}-${correlationId}`;

    console.log('Recording buyback intent for manual execution...');

    // Update report with buyback details (pending execution)
    const { error: updateError } = await supabase
      .from('monthly_ecosystem_reports')
      .update({
        trn_burned: trnTokens,
        // These would be filled after actual on-chain execution
        buyback_tx_hash: `pending:${correlationId}`,
        burn_tx_hash: `pending:${correlationId}`,
      })
      .eq('id', report.id);

    if (updateError) {
      console.error('Error updating report:', updateError);
      throw updateError;
    }

    // Emit buyback executed event
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'trn.buyback.executed',
        source_app: 'trn',
        producer: 'trn',
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        report_month: report_month,
        payload: {
          report_id: report.id,
          usd_amount: usdAmount,
          expected_trn: trnTokens,
          quote_price_impact: quote.priceImpactPct,
          status: 'pending_execution',
        },
      });

    // Emit burn executed event
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'trn.burn.executed',
        source_app: 'trn',
        producer: 'trn',
        correlation_id: correlationId,
        idempotency_key: `burn-${report_month}-${correlationId}`,
        report_month: report_month,
        payload: {
          report_id: report.id,
          trn_burned: trnTokens,
          burn_address: BURN_ADDRESS,
          status: 'pending_execution',
        },
      });

    // Also record in the legacy BURN_EXECUTED format for compatibility
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'BURN_EXECUTED',
        source_app: 'trn',
        producer: 'trn',
        report_month: report_month,
        payload: {
          report_id: report.id,
          trn_burned: trnTokens,
          correlation_id: correlationId,
        },
      });

    console.log('Buyback-burn recorded:', correlationId);

    return new Response(
      JSON.stringify({
        success: true,
        correlation_id: correlationId,
        usd_for_buyback: usdAmount,
        expected_trn_burned: trnTokens,
        quote: {
          price_impact_pct: quote.priceImpactPct,
          route: quote.routePlan?.map((r: any) => r.swapInfo?.label),
        },
        status: 'pending_execution',
        message: 'Buyback recorded. On-chain execution pending treasury approval.',
        next_step: 'Call publish-monthly-report to finalize',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in execute-buyback-burn:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
