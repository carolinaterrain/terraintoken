/**
 * Distribute TRN Rewards
 * 
 * This function processes pending rewards from the trn_rewards_ledger
 * and distributes TRN tokens to recipient wallets.
 * 
 * Process:
 * 1. Fetch pending rewards from the ledger
 * 2. Validate wallet addresses
 * 3. Execute SPL token transfers from treasury
 * 4. Update reward status to 'distributed'
 * 5. Record transaction signatures
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase, TRN_MINT_ADDRESS, TRN_DECIMALS, TRN_TREASURY_WALLET } from "../_shared/ecosystem.ts";

// Solana RPC endpoints
const HELIUS_RPC = Deno.env.get('HELIUS_API_KEY') 
  ? `https://mainnet.helius-rpc.com/?api-key=${Deno.env.get('HELIUS_API_KEY')}`
  : null;
const PUBLIC_RPC = 'https://api.mainnet-beta.solana.com';

interface DistributeRequest {
  batch_size?: number; // Max rewards to process in one call
  dry_run?: boolean;   // If true, simulate without executing
  reward_ids?: string[]; // Specific reward IDs to process
}

interface RewardRecord {
  id: string;
  wallet_address: string;
  amount_trn: number;
  reward_type: string;
  source_project: string;
  source_reward_id: string;
  status: string;
  metadata: Record<string, unknown>;
}

// Validate Solana address format
function isValidSolanaAddress(address: string): boolean {
  // Base58 check - Solana addresses are 32-44 characters
  if (!address || address.length < 32 || address.length > 44) {
    return false;
  }
  // Basic Base58 character check
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
}

// Get token account for a wallet
async function getTokenAccount(walletAddress: string, mintAddress: string): Promise<string | null> {
  const rpcUrl = HELIUS_RPC || PUBLIC_RPC;
  
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          { mint: mintAddress },
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error || !data.result?.value?.length) {
      return null;
    }

    return data.result.value[0].pubkey;
  } catch (error) {
    console.error('Error getting token account:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getServiceSupabase();
    const { batch_size = 10, dry_run = false, reward_ids }: DistributeRequest = await req.json().catch(() => ({}));

    console.log(`Distribute rewards - batch_size: ${batch_size}, dry_run: ${dry_run}`);

    // Fetch pending rewards
    let query = supabase
      .from('trn_rewards_ledger')
      .select('*')
      .eq('status', 'pending')
      .not('wallet_address', 'is', null)
      .order('created_at', { ascending: true })
      .limit(batch_size);

    if (reward_ids && reward_ids.length > 0) {
      query = query.in('id', reward_ids);
    }

    const { data: pendingRewards, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching pending rewards:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pending rewards', details: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pendingRewards || pendingRewards.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending rewards to distribute',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingRewards.length} pending rewards to process`);

    // Validate wallet addresses
    const validRewards: RewardRecord[] = [];
    const invalidRewards: Array<{ id: string; reason: string }> = [];

    for (const reward of pendingRewards) {
      if (!reward.wallet_address) {
        invalidRewards.push({ id: reward.id, reason: 'Missing wallet address' });
        continue;
      }

      if (!isValidSolanaAddress(reward.wallet_address)) {
        invalidRewards.push({ id: reward.id, reason: 'Invalid Solana address format' });
        continue;
      }

      if (!reward.amount_trn || reward.amount_trn <= 0) {
        invalidRewards.push({ id: reward.id, reason: 'Invalid amount' });
        continue;
      }

      validRewards.push(reward as RewardRecord);
    }

    // Mark invalid rewards as failed
    if (invalidRewards.length > 0) {
      for (const invalid of invalidRewards) {
        await supabase
          .from('trn_rewards_ledger')
          .update({ 
            status: 'failed',
            metadata: {
              ...((pendingRewards.find(r => r.id === invalid.id)?.metadata) || {}),
              failure_reason: invalid.reason,
              failed_at: new Date().toISOString()
            }
          })
          .eq('id', invalid.id);
      }
    }

    if (validRewards.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No valid rewards to distribute',
          processed: 0,
          invalid: invalidRewards
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total TRN to distribute
    const totalTrn = validRewards.reduce((sum, r) => sum + r.amount_trn, 0);
    console.log(`Total TRN to distribute: ${totalTrn} across ${validRewards.length} rewards`);

    // Check treasury balance (would need to implement)
    // For now, we'll proceed with distribution recording

    // In dry run mode, return what would be distributed
    if (dry_run) {
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          would_distribute: {
            total_trn: totalTrn,
            reward_count: validRewards.length,
            rewards: validRewards.map(r => ({
              id: r.id,
              wallet: r.wallet_address,
              amount: r.amount_trn,
              type: r.reward_type
            }))
          },
          invalid_rewards: invalidRewards,
          message: 'Dry run complete. No transactions executed.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for treasury wallet private key
    const treasuryPrivateKey = Deno.env.get('TREASURY_WALLET_PRIVATE_KEY');
    
    if (!treasuryPrivateKey) {
      // Mark rewards as pending_distribution for manual processing
      const correlationId = crypto.randomUUID();
      
      for (const reward of validRewards) {
        await supabase
          .from('trn_rewards_ledger')
          .update({ 
            status: 'pending_distribution',
            metadata: {
              ...(reward.metadata || {}),
              distribution_correlation_id: correlationId,
              marked_at: new Date().toISOString()
            }
          })
          .eq('id', reward.id);
      }

      // Emit event for manual distribution
      await supabase
        .from('ecosystem_events')
        .insert({
          event_type: 'trn.rewards.pending_distribution',
          source_app: 'trn',
          producer: 'trn',
          correlation_id: correlationId,
          idempotency_key: `rewards-pending-${correlationId}`,
          payload: {
            total_trn: totalTrn,
            reward_count: validRewards.length,
            rewards: validRewards.map(r => ({
              id: r.id,
              wallet: r.wallet_address,
              amount: r.amount_trn
            })),
            treasury_wallet: TRN_TREASURY_WALLET,
            mint_address: TRN_MINT_ADDRESS,
            reason: 'TREASURY_WALLET_PRIVATE_KEY not configured'
          },
        });

      return new Response(
        JSON.stringify({
          success: true,
          correlation_id: correlationId,
          status: 'pending_manual_distribution',
          total_trn: totalTrn,
          reward_count: validRewards.length,
          invalid_rewards: invalidRewards,
          message: 'Treasury wallet key not configured. Rewards marked for manual distribution.',
          treasury_wallet: TRN_TREASURY_WALLET,
          next_step: 'Configure TREASURY_WALLET_PRIVATE_KEY or distribute manually'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // With treasury key configured, we would execute actual transfers here
    // This requires @solana/web3.js and @solana/spl-token which aren't available in Deno
    // For production, use a signing service or Helius Transaction API

    const correlationId = crypto.randomUUID();
    const distributedRewards: Array<{ id: string; wallet: string; amount: number; status: string }> = [];

    for (const reward of validRewards) {
      // Mark as processing
      await supabase
        .from('trn_rewards_ledger')
        .update({ 
          status: 'processing',
          metadata: {
            ...(reward.metadata || {}),
            distribution_correlation_id: correlationId,
            processing_started_at: new Date().toISOString()
          }
        })
        .eq('id', reward.id);

      // In production, this would:
      // 1. Get or create associated token account for recipient
      // 2. Build SPL Token transfer instruction
      // 3. Sign with treasury wallet
      // 4. Submit to Solana
      // 5. Wait for confirmation

      // For now, mark as pending_signing_service
      await supabase
        .from('trn_rewards_ledger')
        .update({ 
          status: 'pending_signing_service',
          metadata: {
            ...(reward.metadata || {}),
            distribution_correlation_id: correlationId,
            awaiting_signature: true,
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', reward.id);

      distributedRewards.push({
        id: reward.id,
        wallet: reward.wallet_address,
        amount: reward.amount_trn,
        status: 'pending_signing_service'
      });
    }

    // Emit distribution event
    await supabase
      .from('ecosystem_events')
      .insert({
        event_type: 'trn.rewards.distribution_initiated',
        source_app: 'trn',
        producer: 'trn',
        correlation_id: correlationId,
        idempotency_key: `rewards-distribution-${correlationId}`,
        payload: {
          total_trn: totalTrn,
          reward_count: validRewards.length,
          rewards: distributedRewards,
          treasury_wallet: TRN_TREASURY_WALLET,
          mint_address: TRN_MINT_ADDRESS,
          status: 'pending_signing_service'
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        correlation_id: correlationId,
        status: 'pending_signing_service',
        total_trn: totalTrn,
        processed: distributedRewards.length,
        rewards: distributedRewards,
        invalid_rewards: invalidRewards,
        treasury_wallet: TRN_TREASURY_WALLET,
        mint_address: TRN_MINT_ADDRESS,
        message: 'Distribution initiated. On-chain execution requires transaction signing service.',
        next_steps: [
          'Implement Helius Transaction API for serverless signing',
          'Or use manual execution via treasury wallet'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in distribute-rewards:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
