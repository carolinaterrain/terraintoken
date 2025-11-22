import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AchievementCheckRequest {
  wallet_address: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { wallet_address }: AchievementCheckRequest = await req.json();

    // Get user stats
    const { data: stats } = await supabaseClient
      .from('user_stats')
      .select('*')
      .eq('user_wallet_address', wallet_address)
      .single();

    if (!stats) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get achievement definitions
    const { data: definitions } = await supabaseClient
      .from('achievement_definitions')
      .select('*');

    // Get already earned achievements
    const { data: earned } = await supabaseClient
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_wallet_address', wallet_address);

    const earnedIds = new Set(earned?.map(a => a.achievement_id) || []);
    const newAchievements = [];

    // Check each achievement
    for (const def of definitions || []) {
      if (earnedIds.has(def.id)) continue;

      let qualifies = false;

      switch (def.requirement_type) {
        case 'uploads':
          qualifies = (stats.total_uploads || 0) >= def.requirement_value;
          break;
        case 'streak':
          qualifies = (stats.streak_days || 0) >= def.requirement_value;
          break;
        case 'shares':
          qualifies = (stats.total_shares || 0) >= def.requirement_value;
          break;
        case 'validations':
          qualifies = (stats.total_validations || 0) >= def.requirement_value;
          break;
        case 'trn_earned':
          qualifies = (stats.total_trn_earned || 0) >= def.requirement_value;
          break;
      }

      if (qualifies) {
        // Award achievement
        const { data: newAchievement } = await supabaseClient
          .from('user_achievements')
          .insert({
            user_wallet_address: wallet_address,
            achievement_id: def.id,
            trn_bonus: def.trn_reward
          })
          .select()
          .single();

        // Create TRN reward
        await supabaseClient.from('trn_rewards').insert({
          user_wallet_address: wallet_address,
          reward_type: 'achievement',
          trn_amount: def.trn_reward,
          reward_metadata: { achievement_id: def.id }
        });

        // Create notification
        await supabaseClient.from('activity_notifications').insert({
          activity_type: 'achievement_earned',
          user_identifier: wallet_address.substring(0, 8),
          message: `Achievement unlocked: ${def.name}!`,
          metadata: { achievement_id: def.id, reward: def.trn_reward }
        });

        newAchievements.push({ ...def, ...newAchievement });
        console.log(`Achievement awarded: ${def.name} to ${wallet_address}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        new_achievements: newAchievements,
        total_earned: earnedIds.size + newAchievements.length
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error checking achievements:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);
