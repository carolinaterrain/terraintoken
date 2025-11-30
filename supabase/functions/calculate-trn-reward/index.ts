import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { trnRewardSchema, validateInput } from "../_shared/validation.ts";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Streak bonus multipliers
const STREAK_MULTIPLIERS: Record<number, number> = {
  3: 1.2,   // 3-day streak: 20% bonus
  7: 1.5,   // 7-day streak: 50% bonus
  14: 2.0,  // 14-day streak: 100% bonus
  30: 2.5,  // 30-day streak: 150% bonus
};

function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return STREAK_MULTIPLIERS[30];
  if (streak >= 14) return STREAK_MULTIPLIERS[14];
  if (streak >= 7) return STREAK_MULTIPLIERS[7];
  if (streak >= 3) return STREAK_MULTIPLIERS[3];
  return 1.0;
}

function calculateStreak(lastUploadDate: string | null, currentStreak: number): { newStreak: number; isConsecutive: boolean } {
  if (!lastUploadDate) {
    return { newStreak: 1, isConsecutive: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastUpload = new Date(lastUploadDate);
  lastUpload.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastUpload.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day upload - maintain streak but don't increment
    return { newStreak: currentStreak || 1, isConsecutive: true };
  } else if (diffDays === 1) {
    // Consecutive day - increment streak
    return { newStreak: (currentStreak || 0) + 1, isConsecutive: true };
  } else {
    // Streak broken - reset to 1
    return { newStreak: 1, isConsecutive: false };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Rate limiting: 10 reward calculations per hour per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'calculate-trn-reward',
      windowMs: 3600000,
      maxRequests: 10
    }, supabaseUrl, supabaseKey);

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.', retryAfter: rateLimitResult.retryAfter }),
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateInput(trnRewardSchema, body);
    
    if (!validation.success) {
      console.error('Validation failed:', validation.errors.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          details: validation.errors.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { mediaId, walletAddress, dataConsent, category } = validation.data;

    console.log('Calculating TRN reward for:', { mediaId, walletAddress, category, dataConsent });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate the media exists and hasn't been rewarded yet
    const { data: media, error: mediaError } = await supabase
      .from('project_media')
      .select('id, trn_earned, user_wallet_address')
      .eq('id', mediaId)
      .maybeSingle();

    if (mediaError || !media) {
      console.error('Media not found:', mediaError);
      return new Response(
        JSON.stringify({ error: 'Media not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent duplicate rewards
    if (media.trn_earned && media.trn_earned > 0) {
      console.log('Media already rewarded:', mediaId);
      return new Response(
        JSON.stringify({ error: 'This media has already been rewarded' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate wallet address ownership (if provided)
    if (walletAddress && media.user_wallet_address !== walletAddress) {
      console.error('Wallet address mismatch');
      return new Response(
        JSON.stringify({ error: 'Wallet address does not match media owner' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let baseTRN = 10; // Base upload reward
    const rewards = [{ type: 'upload', amount: 10 }];

    // Data consent bonus
    if (dataConsent) {
      baseTRN += 50;
      rewards.push({ type: 'consent', amount: 50 });
    }

    // Wallet address bonus (incentive to provide wallet)
    if (walletAddress) {
      baseTRN += 5;
      rewards.push({ type: 'wallet', amount: 5 });
    }

    // High-value category bonus
    if (['drainage', 'erosion'].includes(category)) {
      baseTRN += 10;
      rewards.push({ type: 'category', amount: 10 });
    }

    let totalTRN = baseTRN;
    let streakInfo = { current: 1, multiplier: 1.0 };

    // Insert reward records and handle streaks
    if (walletAddress) {
      // Get current user stats to check for achievements and streaks
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_wallet_address', walletAddress)
        .maybeSingle();

      const currentUploads = existingStats ? existingStats.total_uploads + 1 : 1;
      const newAchievements = [];

      // Calculate streak
      const { newStreak, isConsecutive } = calculateStreak(
        existingStats?.last_upload_date || null,
        existingStats?.current_streak || 0
      );

      const multiplier = getStreakMultiplier(newStreak);
      streakInfo = { current: newStreak, multiplier };

      // Apply streak bonus
      if (multiplier > 1.0) {
        const streakBonus = Math.round(baseTRN * (multiplier - 1));
        totalTRN = baseTRN + streakBonus;
        rewards.push({ type: 'streak_bonus', amount: streakBonus });
        console.log(`Streak bonus applied: ${newStreak}-day streak, ${multiplier}x multiplier, +${streakBonus} TRN`);
      }

      // Insert reward records
      for (const reward of rewards) {
        const { error: rewardError } = await supabase
          .from('trn_rewards')
          .insert({
            user_wallet_address: walletAddress,
            media_id: mediaId,
            reward_type: reward.type,
            trn_amount: reward.amount,
            transaction_status: 'completed'
          });

        if (rewardError) {
          console.error('Error inserting reward:', rewardError);
        }
      }

      // Check First Drop achievement (first upload)
      if (currentUploads === 1) {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_wallet_address: walletAddress,
            achievement_id: 'first_drop',
            trn_bonus: 10
          });

        if (!error) {
          newAchievements.push({ id: 'first_drop', name: 'First Drop', bonus: 10 });
          totalTRN += 10;
          rewards.push({ type: 'achievement_first_drop', amount: 10 });
        }
      }

      // Check Data Knight achievement (10th upload)
      if (currentUploads === 10) {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_wallet_address: walletAddress,
            achievement_id: 'data_knight',
            trn_bonus: 50
          });

        if (!error) {
          newAchievements.push({ id: 'data_knight', name: 'Data Knight', bonus: 50 });
          totalTRN += 50;
          rewards.push({ type: 'achievement_data_knight', amount: 50 });
        }
      }

      // Check streak achievements
      if (newStreak === 7) {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_wallet_address: walletAddress,
            achievement_id: 'week_warrior',
            trn_bonus: 25
          });

        if (!error) {
          newAchievements.push({ id: 'week_warrior', name: 'Week Warrior', bonus: 25 });
          totalTRN += 25;
          rewards.push({ type: 'achievement_week_warrior', amount: 25 });
        }
      }

      // Update user_stats with streak info
      const longestStreak = Math.max(newStreak, existingStats?.longest_streak || 0);

      if (existingStats) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({
            total_uploads: currentUploads,
            total_trn_earned: Number(existingStats.total_trn_earned) + totalTRN,
            last_upload_date: new Date().toISOString().split('T')[0],
            current_streak: newStreak,
            longest_streak: longestStreak,
            updated_at: new Date().toISOString()
          })
          .eq('user_wallet_address', walletAddress);
        
        if (updateError) {
          console.error('Error updating user_stats:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_wallet_address: walletAddress,
            total_uploads: 1,
            total_trn_earned: totalTRN,
            last_upload_date: new Date().toISOString().split('T')[0],
            current_streak: 1,
            longest_streak: 1
          });
        
        if (insertError) {
          console.error('Error inserting user_stats:', insertError);
        }
      }

      console.log('Final reward calculation:', { totalTRN, streak: newStreak, achievements: newAchievements.length });

      // Update project_media with TRN earned
      await supabase
        .from('project_media')
        .update({ trn_earned: totalTRN })
        .eq('id', mediaId);

      // Generate goblin message
      const goblinMessage = generateGoblinMessage(totalTRN, newAchievements, streakInfo);

      return new Response(
        JSON.stringify({ 
          totalTRN, 
          rewards, 
          newAchievements, 
          goblinMessage,
          streakInfo
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          totalTRN: 0, 
          message: 'No wallet address provided - rewards not recorded' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in calculate-trn-reward:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateGoblinMessage(trn: number, achievements: any[], streakInfo: { current: number; multiplier: number }): string {
  const messages = {
    high: [
      `🎉 Terry the Goblin is impressed! ${trn} TRN earned! Your yard chaos feeds the AI.`,
      `⛏️ LEGENDARY CONTRIBUTION! ${trn} TRN secured. The drainage gods smile upon you.`,
      `🌱 ${trn} TRN! Your erosion disaster is our training treasure!`
    ],
    medium: [
      `Nice work! ${trn} TRN earned. Your yard's pain is our AI's gain.`,
      `Terry approves! ${trn} TRN deposited. Keep the chaos coming.`,
      `${trn} TRN secured! Your drainage woes = our data gold.`
    ],
    low: [
      `${trn} TRN earned! Every upload helps. Add data consent next time for +50 TRN!`,
      `You earned ${trn} TRN. Pro tip: Allow AI training for bigger rewards!`
    ]
  };
  
  const tier = trn >= 75 ? 'high' : trn >= 40 ? 'medium' : 'low';
  let message = messages[tier][Math.floor(Math.random() * messages[tier].length)];
  
  // Add streak info
  if (streakInfo.current >= 3) {
    message += ` 🔥 ${streakInfo.current}-day streak (${streakInfo.multiplier}x bonus)!`;
  }
  
  if (achievements.length > 0) {
    message += ` 🏆 ACHIEVEMENT UNLOCKED: ${achievements[0].name}!`;
  }
  
  return message;
}
