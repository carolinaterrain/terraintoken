import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TRN token constants
const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";
const TRN_DECIMALS = 6;

interface TreasuryBalanceResponse {
  balance: number;
  balanceFormatted: string;
  walletAddress: string;
  lastUpdated: string;
  source: 'helius' | 'fallback';
}

async function fetchTreasuryBalance(heliusApiKey: string): Promise<number> {
  const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
  
  // Use getTokenAccountsByOwner to find TRN token accounts for treasury wallet
  const response = await fetch(heliusUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'treasury-balance',
      method: 'getTokenAccountsByOwner',
      params: [
        TRN_TREASURY_WALLET,
        { mint: TRN_MINT_ADDRESS },
        { encoding: 'jsonParsed' }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Helius RPC error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  // Extract balance from token accounts
  const accounts = data.result?.value || [];
  
  if (accounts.length === 0) {
    console.log('No TRN token accounts found for treasury wallet');
    return 0;
  }

  // Sum up all TRN balances (usually just one account)
  let totalBalance = 0;
  for (const account of accounts) {
    const tokenAmount = account.account?.data?.parsed?.info?.tokenAmount;
    if (tokenAmount) {
      totalBalance += Number(tokenAmount.uiAmount || 0);
    }
  }

  return totalBalance;
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000_000) {
    return `${(balance / 1_000_000_000).toFixed(2)}B`;
  }
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(2)}M`;
  }
  if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(2)}K`;
  }
  return balance.toLocaleString();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const heliusApiKey = Deno.env.get('HELIUS_API_KEY');
    
    if (!heliusApiKey) {
      console.error('HELIUS_API_KEY not configured');
      // Return fallback response
      const fallbackResponse: TreasuryBalanceResponse = {
        balance: 0,
        balanceFormatted: 'Unavailable',
        walletAddress: TRN_TREASURY_WALLET,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    console.log('Fetching treasury balance for wallet:', TRN_TREASURY_WALLET);
    
    const balance = await fetchTreasuryBalance(heliusApiKey);
    
    console.log(`Treasury balance: ${balance.toLocaleString()} TRN`);

    const response: TreasuryBalanceResponse = {
      balance,
      balanceFormatted: formatBalance(balance),
      walletAddress: TRN_TREASURY_WALLET,
      lastUpdated: new Date().toISOString(),
      source: 'helius'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error fetching treasury balance:', error);
    
    // Return fallback on error
    const fallbackResponse: TreasuryBalanceResponse = {
      balance: 0,
      balanceFormatted: 'Error',
      walletAddress: TRN_TREASURY_WALLET,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    };
    
    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});
