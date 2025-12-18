import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TRN_MINT_ADDRESS, getWhaleTier, WHALE_TIERS } from "../_shared/constants.ts";
import { fetchWithRetry, isCircuitOpen, getCircuitStatus, CONFIG } from "../_shared/heliusGateway.ts";
import { logError } from "../_shared/errorHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration: 10 minutes (was ~2 minutes via cron)
const CACHE_DURATION_MS = 600000;
const CACHE_KEY = 'monitor-trn-transactions-last-run';

interface Transaction {
  signature: string;
  timestamp: number;
  type: 'buy' | 'sell' | 'transfer';
  tokenTransfers?: Array<{
    mint: string;
    tokenAmount: number;
    fromUserAccount?: string;
    toUserAccount?: string;
  }>;
  nativeBalanceChange?: number;
  feePayer?: string;
  accountData?: Array<{
    account: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const functionName = 'monitor-trn-transactions';

  const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!HELIUS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing required environment variables' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Check circuit breaker first (now async and requires supabase)
    if (await isCircuitOpen(supabase)) {
      const status = await getCircuitStatus(supabase);
      console.log('[monitor-trn-transactions] Circuit breaker is OPEN, skipping API call');
      return new Response(
        JSON.stringify({
          success: false,
          skipped: true,
          reason: 'circuit_breaker_open',
          nextRetryTime: new Date(status.nextRetryTime).toISOString(),
          processed: 0,
          whaleAlerts: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache to avoid redundant API calls
    const { data: cacheData } = await supabase
      .from('holder_count_cache')
      .select('last_updated')
      .eq('id', CACHE_KEY)
      .single();

    if (cacheData?.last_updated) {
      const cacheAge = Date.now() - new Date(cacheData.last_updated).getTime();
      if (cacheAge < CACHE_DURATION_MS) {
        console.log(`[monitor-trn-transactions] Cache still valid (${Math.floor(cacheAge / 1000)}s old), skipping`);
        return new Response(
          JSON.stringify({
            success: true,
            skipped: true,
            reason: 'cache_valid',
            cacheAge: Math.floor(cacheAge / 1000),
            processed: 0,
            whaleAlerts: 0,
            lastChecked: cacheData.last_updated,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('[monitor-trn-transactions] Fetching TRN transactions with circuit breaker protection...');

    // Fetch recent transactions from Helius with retry and circuit breaker
    const response = await fetchWithRetry(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=50`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      supabase
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Helius API error: ${response.status} - ${errorText}`);
    }

    const transactions: Transaction[] = await response.json();
    console.log(`[monitor-trn-transactions] Fetched ${transactions.length} transactions`);

    let processedCount = 0;
    let whaleAlertsCreated = 0;

    for (const tx of transactions) {
      // Check if transaction already processed
      const { data: existingTx } = await supabase
        .from('trn_purchases')
        .select('id')
        .eq('transaction_signature', tx.signature)
        .maybeSingle();

      if (existingTx) continue;

      // Find TRN transfer in token transfers
      const trnTransfer = tx.tokenTransfers?.find(
        (transfer) => transfer.mint === TRN_MINT_ADDRESS
      );

      if (!trnTransfer || !trnTransfer.tokenAmount) continue;

      const amount = trnTransfer.tokenAmount;
      const walletAddress = trnTransfer.toUserAccount || tx.feePayer || 'unknown';

      // Determine if this is a buy (native balance decreased = user spent SOL)
      const isBuy = (tx.nativeBalanceChange || 0) < 0;
      if (!isBuy) continue;

      // Determine purchase tier
      let purchaseTier = 'shrimp';
      if (amount >= 10_000_000) purchaseTier = 'whale';
      else if (amount >= 5_000_000) purchaseTier = 'shark';
      else if (amount >= 1_000_000) purchaseTier = 'dolphin';
      else if (amount >= 500_000) purchaseTier = 'crab';

      // Insert purchase record
      const { error: purchaseError } = await supabase
        .from('trn_purchases')
        .insert({
          wallet_address: walletAddress,
          amount_trn: amount,
          amount_sol: Math.abs(tx.nativeBalanceChange || 0) / 1e9,
          purchase_tier: purchaseTier,
          transaction_signature: tx.signature,
          metadata: {
            timestamp: new Date(tx.timestamp * 1000).toISOString(),
            type: 'monitored_transaction',
          },
        });

      if (purchaseError) {
        console.error('[monitor-trn-transactions] Error inserting purchase:', purchaseError);
        continue;
      }

      processedCount++;

      // Check for whale alert (5M+ TRN)
      const whaleTier = getWhaleTier(amount);
      if (whaleTier) {
        const tierInfo = WHALE_TIERS[whaleTier];
        
        const { data: existingAlert } = await supabase
          .from('whale_alerts')
          .select('id')
          .eq('transaction_signature', tx.signature)
          .maybeSingle();

        if (!existingAlert) {
          const { error: alertError } = await supabase
            .from('whale_alerts')
            .insert({
              wallet_address: walletAddress,
              amount_trn: amount,
              alert_type: 'large_purchase',
              metadata: {
                transaction_signature: tx.signature,
                tier: whaleTier,
                tier_name: tierInfo.name,
                emoji: tierInfo.emoji,
                timestamp: new Date(tx.timestamp * 1000).toISOString(),
              },
            });

          if (!alertError) {
            whaleAlertsCreated++;
            console.log(`[monitor-trn-transactions] 🐋 Whale alert: ${tierInfo.emoji} ${tierInfo.name} - ${amount.toLocaleString()} TRN`);
          }
        }
      }
    }

    // Update cache timestamp
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: CACHE_KEY,
        holder_count: processedCount,
        last_updated: new Date().toISOString(),
        source: 'monitor-trn-transactions',
      });

    const circuitStatus = await getCircuitStatus(supabase);
    console.log(`[monitor-trn-transactions] Processed ${processedCount} new purchases, created ${whaleAlertsCreated} whale alerts`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        whaleAlerts: whaleAlertsCreated,
        lastChecked: new Date().toISOString(),
        circuitStatus,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[monitor-trn-transactions] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error to database
    await logError(
      { functionName, action: 'monitor_transactions' },
      error instanceof Error ? error : new Error(errorMessage),
      'error'
    );

    const circuitStatus = await getCircuitStatus(supabase);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        processed: 0,
        whaleAlerts: 0,
        circuitStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
