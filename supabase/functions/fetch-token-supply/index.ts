import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

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
    
    if (!HELIUS_API_KEY) {
      console.error('HELIUS_API_KEY not configured');
      throw new Error('API key not configured');
    }

    console.log('Fetching token supply for TRN...');

    // Parallelize API calls for better performance
    const [supplyResponse, holdersResponse] = await Promise.all([
      fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: [TRN_MINT_ADDRESS]
        })
      }),
      fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenLargestAccounts',
          params: [TRN_MINT_ADDRESS]
        })
      })
    ]);

    if (!supplyResponse.ok) {
      throw new Error(`RPC error: ${supplyResponse.statusText}`);
    }

    const data = await supplyResponse.json();
    
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    const supply = data.result?.value;
    
    if (!supply) {
      throw new Error('No supply data returned');
    }

    const holdersData = await holdersResponse.json();
    const accounts = holdersData.result?.value || [];
    
    // Calculate circulating supply (total - largest holder if it's bonding curve)
    const totalSupply = parseInt(supply.amount);
    const decimals = supply.decimals;
    
    // Estimate circulating supply (total supply minus bonding curve if applicable)
    let circulatingSupply = totalSupply;
    if (accounts.length > 0) {
      const largestAccount = accounts[0];
      // If largest holder has >40%, assume it's bonding curve/liquidity
      const largestHolderAmount = parseInt(largestAccount.amount);
      const largestPercentage = (largestHolderAmount / totalSupply) * 100;
      
      if (largestPercentage > 40) {
        circulatingSupply = totalSupply - largestHolderAmount;
      }
    }

    console.log(`Token supply fetched: ${totalSupply / Math.pow(10, decimals)} TRN`);

    return new Response(
      JSON.stringify({
        totalSupply,
        circulatingSupply,
        decimals,
        lastUpdated: new Date().toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching token supply:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return fallback data with error flag
    return new Response(
      JSON.stringify({
        totalSupply: 1006699550, // Last known supply from blockchain
        circulatingSupply: 550000000, // Estimated circulating
        decimals: 2,
        lastUpdated: new Date().toISOString(),
        error: errorMessage,
        isStale: true,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 with error flag so UI can show fallback
      }
    );
  }
});
