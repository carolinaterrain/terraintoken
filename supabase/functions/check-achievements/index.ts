/**
 * ARCHIVED: This edge function is not currently called from the frontend.
 * It was built for an achievement system that requires:
 * - CHECK_ACHIEVEMENTS_API_KEY secret to be configured
 * - Frontend integration to trigger checks
 * - Cron job setup for periodic checks
 * 
 * To reactivate: Configure the API key and add frontend calls.
 * Last archived: 2025-12-04
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const achievementCheckSchema = z.object({
  wallet_address: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address')
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // API Key verification for cron jobs
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('CHECK_ACHIEVEMENTS_API_KEY');
    
    if (!apiKey || apiKey !== expectedApiKey) {
      console.error('Invalid or missing API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'check-achievements',
      windowMs: 3600000,
      maxRequests: 60
    }, supabaseUrl, supabaseKey);

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          } 
        }
      );
    }

    const body = await req.json();
    const validation = achievementCheckSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const { wallet_address } = validation.data;

    const { data: stats } = await supabaseClient
      .from('user_stats')
      .select('*')
      .eq('user_wallet_address', wallet_address)
      .maybeSingle();

    if (!stats) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { data: definitions } = await supabaseClient
      .from('achievement_definitions')
      .select('*');

    const { data: earned } = await supabaseClient
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_wallet_address', wallet_address);

    const earnedIds = new Set(earned?.map(a => a.achievement_id) || []);
    const newAchievements = [];

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
        const { data: newAchievement } = await supabaseClient
          .from('user_achievements')
          .insert({
            user_wallet_address: wallet_address,
            achievement_id: def.id,
            trn_bonus: def.trn_reward
          })
          .select()
          .maybeSingle();

        await supabaseClient.from('trn_rewards').insert({
          user_wallet_address: wallet_address,
          reward_type: 'achievement',
          trn_amount: def.trn_reward,
          reward_metadata: { achievement_id: def.id }
        });

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
