import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-source-project',
};

// Whitelist of allowed source projects
const ALLOWED_PROJECTS = [
  'terrainvision',
  'izxzkqprhekrgiwakepm', // TerrainVision project ID
];

interface RewardPayload {
  source_reward_id: string;
  wallet_address?: string;
  user_email?: string;
  session_id?: string;
  reward_type: string;
  amount_trn: number;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

interface SyncRequest {
  source_project: string;
  rewards: RewardPayload[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use service role for insert operations
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body: SyncRequest = await req.json();
    const { source_project, rewards } = body;

    // Validate source project
    if (!source_project) {
      return new Response(
        JSON.stringify({ error: 'source_project is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedSource = source_project.toLowerCase();
    if (!ALLOWED_PROJECTS.includes(normalizedSource)) {
      console.error(`Unauthorized source project attempt: ${source_project}`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized source project' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate rewards array
    if (!Array.isArray(rewards) || rewards.length === 0) {
      return new Response(
        JSON.stringify({ error: 'rewards array is required and must not be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit batch size
    if (rewards.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Maximum 100 rewards per request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and prepare rewards for upsert
    const rewardsToInsert = rewards.map((reward, index) => {
      if (!reward.source_reward_id || !reward.reward_type) {
        throw new Error(`Reward at index ${index} missing required fields (source_reward_id, reward_type)`);
      }

      return {
        source_project: normalizedSource,
        source_reward_id: reward.source_reward_id,
        wallet_address: reward.wallet_address || null,
        user_email: reward.user_email || null,
        session_id: reward.session_id || null,
        reward_type: reward.reward_type,
        amount_trn: reward.amount_trn || 0,
        status: reward.status || 'pending',
        metadata: reward.metadata || {},
        created_at: reward.created_at || new Date().toISOString(),
        synced_at: new Date().toISOString(),
      };
    });

    console.log(`Syncing ${rewardsToInsert.length} rewards from ${normalizedSource}`);

    // Upsert rewards (on conflict update synced_at and status if changed)
    const { data, error } = await supabase
      .from('trn_rewards_ledger')
      .upsert(rewardsToInsert, {
        onConflict: 'source_project,source_reward_id',
        ignoreDuplicates: false,
      })
      .select('id, source_reward_id, status');

    if (error) {
      console.error('Error inserting rewards:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to sync rewards', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully synced ${data?.length || 0} rewards`);

    return new Response(
      JSON.stringify({
        success: true,
        synced_count: data?.length || 0,
        rewards: data,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync rewards error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
