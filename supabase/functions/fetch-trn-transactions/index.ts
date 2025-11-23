import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const TRN_MINT_ADDRESS = '2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump';

    if (!HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY not configured');
    }

    console.log('Fetching recent TRN transactions...');

    // Fetch recent transactions using Helius Enhanced Transactions API
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=20`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error('Helius API error:', response.status);
      throw new Error(`Helius API error: ${response.status}`);
    }

    const transactions = await response.json();
    console.log(`Found ${transactions.length} recent transactions`);

    // Parse and format transactions
    const formattedTxs = transactions.slice(0, 10).map((tx: any) => {
      const timestamp = tx.timestamp * 1000; // Convert to ms
      const type = tx.type?.toLowerCase().includes('swap') 
        ? (tx.nativeBalanceChange > 0 ? 'buy' : 'sell')
        : 'transfer';
      
      // Extract amount from token transfers
      let amount = 0;
      if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
        const trnTransfer = tx.tokenTransfers.find(
          (t: any) => t.mint === TRN_MINT_ADDRESS
        );
        if (trnTransfer) {
          amount = trnTransfer.tokenAmount || 0;
        }
      }

      return {
        signature: tx.signature,
        timestamp,
        type,
        amount,
        fromAddress: tx.feePayer?.substring(0, 8) + '...',
        toAddress: tx.accountData?.[0]?.account?.substring(0, 8) + '...' || 'unknown',
        success: !tx.err,
      };
    });

    return new Response(
      JSON.stringify({
        transactions: formattedTxs,
        lastUpdated: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        transactions: [],
      }),
      {
        status: 200, // Return 200 with empty data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});