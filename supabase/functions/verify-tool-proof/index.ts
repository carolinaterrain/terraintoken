import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { proof_id, action, reward_amount, notes } = await req.json();

    console.log('Verifying tool proof:', { proof_id, action, reward_amount });

    if (!proof_id || !action) {
      throw new Error('Missing required fields: proof_id and action');
    }

    if (!['approve', 'reject'].includes(action)) {
      throw new Error('Invalid action. Must be "approve" or "reject"');
    }

    // Update proof status
    const updateData: any = {
      status: action === 'approve' ? 'verified' : 'rejected',
      verified_at: new Date().toISOString(),
      notes: notes || null,
    };

    if (action === 'approve' && reward_amount) {
      updateData.trn_reward = reward_amount;
    }

    const { data: proof, error: updateError } = await supabase
      .from('tool_usage_proofs')
      .update(updateData)
      .eq('id', proof_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating proof:', updateError);
      throw updateError;
    }

    // Create TRN reward entry if approved
    if (action === 'approve' && reward_amount > 0) {
      const { error: rewardError } = await supabase
        .from('trn_rewards')
        .insert({
          user_wallet_address: proof.wallet_address,
          reward_type: 'tool_usage_proof',
          trn_amount: reward_amount,
          reward_metadata: {
            proof_id: proof_id,
            tool_name: proof.tool_name,
            proof_type: proof.proof_type,
          },
          transaction_status: 'pending',
        });

      if (rewardError) {
        console.error('Error creating reward:', rewardError);
        // Don't throw - proof is still verified
      }

      // Update proof status to rewarded
      await supabase
        .from('tool_usage_proofs')
        .update({ status: 'rewarded' })
        .eq('id', proof_id);
    }

    console.log('Proof verification complete:', proof);

    return new Response(
      JSON.stringify({ 
        success: true, 
        proof,
        message: action === 'approve' 
          ? `Proof verified! ${reward_amount} TRN reward created.`
          : 'Proof rejected.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in verify-tool-proof:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
