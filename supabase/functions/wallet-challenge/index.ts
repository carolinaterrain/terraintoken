/**
 * Wallet Challenge Generator
 * Creates a cryptographic challenge for wallet verification
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  corsHeaders, 
  getServiceSupabase, 
  generateNonce, 
  createWalletVerificationMessage 
} from "../_shared/ecosystem.ts";

interface ChallengeRequest {
  wallet_address: string;
  session_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wallet_address, session_id }: ChallengeRequest = await req.json();

    if (!wallet_address) {
      return new Response(
        JSON.stringify({ error: 'wallet_address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate wallet address format (Solana base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet_address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceSupabase();

    // Generate nonce and message
    const nonce = generateNonce();
    const message = createWalletVerificationMessage(nonce, wallet_address);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Expire any existing pending challenges for this wallet
    await supabase
      .from('wallet_link_challenges')
      .update({ expires_at: new Date().toISOString() })
      .eq('wallet_address', wallet_address)
      .is('verified_at', null);

    // Create new challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('wallet_link_challenges')
      .insert({
        wallet_address,
        session_id,
        nonce,
        message,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (challengeError) {
      console.error('Error creating challenge:', challengeError);
      throw challengeError;
    }

    console.log(`Challenge created for wallet: ${wallet_address.slice(0, 8)}...`);

    return new Response(
      JSON.stringify({
        success: true,
        challenge_id: challenge.id,
        message,
        nonce,
        expires_at: expiresAt.toISOString(),
        wallet_address,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in wallet-challenge:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
