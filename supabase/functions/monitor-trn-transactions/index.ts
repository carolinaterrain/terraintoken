import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { TRN_MINT_ADDRESS, getWhaleTier, WHALE_TIERS } from "../_shared/constants.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!HELIUS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Monitoring TRN transactions...');

    // Fetch recent transactions from Helius
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=50`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const transactions: Transaction[] = await response.json();
    console.log(`Fetched ${transactions.length} transactions`);

    let processedCount = 0;
    let whaleAlertsCreated = 0;

    for (const tx of transactions) {
      // Check if transaction already processed
      const { data: existingTx } = await supabase
        .from('trn_purchases')
        .select('id')
        .eq('transaction_signature', tx.signature)
        .maybeSingle();

      if (existingTx) continue; // Skip already processed

      // Find TRN transfer in token transfers
      const trnTransfer = tx.tokenTransfers?.find(
        (transfer) => transfer.mint === TRN_MINT_ADDRESS
      );

      if (!trnTransfer || !trnTransfer.tokenAmount) continue;

      const amount = trnTransfer.tokenAmount;
      const walletAddress = trnTransfer.toUserAccount || tx.feePayer || 'unknown';

      // Determine if this is a buy (native balance decreased = user spent SOL)
      const isBuy = (tx.nativeBalanceChange || 0) < 0;
      if (!isBuy) continue; // Only track purchases

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
          amount_sol: Math.abs(tx.nativeBalanceChange || 0) / 1e9, // Convert lamports to SOL
          purchase_tier: purchaseTier,
          transaction_signature: tx.signature,
          metadata: {
            timestamp: new Date(tx.timestamp * 1000).toISOString(),
            type: 'monitored_transaction',
          },
        });

      if (purchaseError) {
        console.error('Error inserting purchase:', purchaseError);
        continue;
      }

      processedCount++;

      // Check for whale alert (5M+ TRN)
      const whaleTier = getWhaleTier(amount);
      if (whaleTier) {
        const tierInfo = WHALE_TIERS[whaleTier];
        
        // Check if alert already exists
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
            console.log(`🐋 Whale alert: ${tierInfo.emoji} ${tierInfo.name} - ${amount.toLocaleString()} TRN`);
          }
        }
      }
    }

    console.log(`Processed ${processedCount} new purchases, created ${whaleAlertsCreated} whale alerts`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        whaleAlerts: whaleAlertsCreated,
        lastChecked: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error monitoring transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        processed: 0,
        whaleAlerts: 0,
      }),
      {
        status: 200, // Return 200 with error details for monitoring
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
