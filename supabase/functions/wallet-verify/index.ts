/**
 * Wallet Verification
 * Verifies wallet ownership via signed message
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase } from "../_shared/ecosystem.ts";
import * as nacl from "https://esm.sh/tweetnacl@1.0.3";
import * as bs58 from "https://esm.sh/bs58@5.0.0";

interface VerifyRequest {
  challenge_id: string;
  wallet_address: string;
  signature: string; // Base58 encoded signature
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challenge_id, wallet_address, signature }: VerifyRequest = await req.json();

    if (!challenge_id || !wallet_address || !signature) {
      return new Response(
        JSON.stringify({ error: 'challenge_id, wallet_address, and signature are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceSupabase();

    // Get the challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('wallet_link_challenges')
      .select('*')
      .eq('id', challenge_id)
      .eq('wallet_address', wallet_address)
      .is('verified_at', null)
      .single();

    if (challengeError || !challenge) {
      return new Response(
        JSON.stringify({ error: 'Challenge not found or already verified' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if challenge expired
    if (new Date(challenge.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Challenge expired. Request a new one.' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the signature
    try {
      const messageBytes = new TextEncoder().encode(challenge.message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = bs58.decode(wallet_address);

      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!isValid) {
        console.error('Signature verification failed for wallet:', wallet_address);
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (verifyError) {
      console.error('Signature verification error:', verifyError);
      return new Response(
        JSON.stringify({ error: 'Signature verification failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark challenge as verified
    const { error: updateError } = await supabase
      .from('wallet_link_challenges')
      .update({
        verified_at: new Date().toISOString(),
        verification_signature: signature,
      })
      .eq('id', challenge_id);

    if (updateError) {
      console.error('Error updating challenge:', updateError);
      throw updateError;
    }

    // Upsert wallet connection
    await supabase
      .from('wallet_connections')
      .upsert({
        wallet_address,
        last_seen_at: new Date().toISOString(),
      }, { 
        onConflict: 'wallet_address',
      });

    // Emit wallet linked event
    const correlationId = crypto.randomUUID();
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'trn.wallet.linked',
        source_app: 'trn',
        producer: 'trn',
        wallet_address,
        session_id: challenge.session_id,
        correlation_id: correlationId,
        idempotency_key: `wallet-link-${wallet_address}-${challenge_id}`,
        payload: {
          challenge_id,
          verified_at: new Date().toISOString(),
        },
      });

    console.log(`Wallet verified: ${wallet_address.slice(0, 8)}...`);

    return new Response(
      JSON.stringify({
        success: true,
        wallet_address,
        verified_at: new Date().toISOString(),
        message: 'Wallet successfully verified and linked',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in wallet-verify:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
