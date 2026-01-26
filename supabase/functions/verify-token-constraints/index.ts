/**
 * Verify Token Constraints
 * Fetches on-chain data from Solana RPC to verify:
 * 1. Mint authority status (revoked or not)
 * 2. Freeze authority status
 * 3. Current supply
 * 4. LP lock status (where possible)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RPC endpoints - use Helius if available, fallback to public
const HELIUS_RPC = Deno.env.get('HELIUS_API_KEY') 
  ? `https://mainnet.helius-rpc.com/?api-key=${Deno.env.get('HELIUS_API_KEY')}`
  : null;
const PUBLIC_RPC = 'https://api.mainnet-beta.solana.com';

// Token-2022 with Interest-Bearing Extension
const TRN_MINT_ADDRESS = "Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m";
const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";

interface TokenAccountInfo {
  mintAuthority: string | null;
  freezeAuthority: string | null;
  supply: string;
  decimals: number;
}

async function fetchTokenInfo(mintAddress: string): Promise<TokenAccountInfo | null> {
  const rpcUrl = HELIUS_RPC || PUBLIC_RPC;
  
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          mintAddress,
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('RPC error:', data.error);
      return null;
    }

    if (!data.result?.value) {
      console.error('Account not found');
      return null;
    }

    const parsed = data.result.value.data?.parsed;
    if (parsed?.type === 'mint' && parsed.info) {
      return {
        mintAuthority: parsed.info.mintAuthority,
        freezeAuthority: parsed.info.freezeAuthority,
        supply: parsed.info.supply,
        decimals: parsed.info.decimals
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenMint } = await req.json().catch(() => ({ tokenMint: TRN_MINT_ADDRESS }));
    const mintAddress = tokenMint || TRN_MINT_ADDRESS;

    console.log(`Verifying constraints for token: ${mintAddress}`);

    // Fetch on-chain token info
    const tokenInfo = await fetchTokenInfo(mintAddress);
    const now = new Date();

    if (!tokenInfo) {
      return new Response(
        JSON.stringify({
          mintAuthority: {
            status: 'unknown',
            verifiedAt: null,
            proofUrl: `https://solscan.io/token/${mintAddress}#metadata`
          },
          freezeAuthority: {
            status: 'unknown',
            verifiedAt: null
          },
          supply: {
            current: 0,
            decimals: 6
          },
          lpLock: {
            isLocked: false,
            lockedUntil: null,
            platform: 'Unknown',
            verificationStatus: 'unverified'
          },
          treasuryRules: {
            monthlySpendCapPercent: 5,
            multisigRequired: false,
            verificationStatus: 'unverified'
          },
          error: 'Failed to fetch on-chain data'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine mint authority status
    const mintAuthorityRevoked = tokenInfo.mintAuthority === null;
    const freezeAuthorityRevoked = tokenInfo.freezeAuthority === null;

    // Calculate supply in token units
    const supplyRaw = BigInt(tokenInfo.supply);
    const supplyTokens = Number(supplyRaw) / Math.pow(10, tokenInfo.decimals);

    console.log(`Token info - Mint auth: ${tokenInfo.mintAuthority}, Freeze auth: ${tokenInfo.freezeAuthority}, Supply: ${supplyTokens}`);

    const result = {
      mintAuthority: {
        status: mintAuthorityRevoked ? 'revoked' : 'active',
        authority: tokenInfo.mintAuthority,
        verifiedAt: now.toISOString(),
        proofUrl: `https://solscan.io/token/${mintAddress}#metadata`
      },
      freezeAuthority: {
        status: freezeAuthorityRevoked ? 'revoked' : 'active',
        authority: tokenInfo.freezeAuthority,
        verifiedAt: now.toISOString()
      },
      supply: {
        current: supplyTokens,
        raw: tokenInfo.supply,
        decimals: tokenInfo.decimals
      },
      // LP lock requires external service verification - mark as unverified
      // In production, you'd integrate with LP locker services like Raydium, Jupiter, etc.
      lpLock: {
        isLocked: false, // Cannot verify without LP locker integration
        lockedUntil: null,
        platform: 'Raydium', // Assumed based on pump.fun migration
        verificationStatus: 'unverified' as const,
        note: 'LP lock verification requires integration with LP locker contract'
      },
      // Treasury rules are database-enforced, not on-chain
      treasuryRules: {
        monthlySpendCapPercent: 5,
        multisigRequired: false,
        verificationStatus: 'unverified' as const,
        note: 'Treasury rules are database-enforced, not smart-contract enforced'
      },
      verifiedAt: now.toISOString(),
      rpcUsed: HELIUS_RPC ? 'helius' : 'public'
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-token-constraints:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
