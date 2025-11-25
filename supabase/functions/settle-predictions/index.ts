import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { TRN_MINT_ADDRESS } from "../_shared/constants.ts";

// Input validation schema
const settleInputSchema = z.object({
  force: z.boolean().optional(),
  apiKey: z.string().optional()
});

// DexScreener response validation
const dexResponseSchema = z.object({
  pairs: z.array(z.object({
    priceUsd: z.string().regex(/^\d+(\.\d+)?$/)
  })).min(1)
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

interface DexScreenerResponse {
  pairs?: Array<{
    priceUsd: string;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input
    const body = await req.json().catch(() => ({}));
    const validation = settleInputSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify API key for security (only allow calls with valid key)
    const apiKey = validation.data.apiKey || req.headers.get('x-api-key');
    const validApiKey = Deno.env.get('SETTLE_PREDICTIONS_API_KEY');
    
    if (apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting prediction settlement process...');

    // Fetch current TRN price from DexScreener with validation
    const dexResponse = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TRN_MINT_ADDRESS}`
    );
    
    if (!dexResponse.ok) {
      throw new Error(`DexScreener API error: ${dexResponse.status}`);
    }
    
    const dexData = await dexResponse.json();
    const dexValidation = dexResponseSchema.safeParse(dexData);
    
    if (!dexValidation.success) {
      throw new Error('Invalid DexScreener API response format');
    }
    
    const currentPrice = parseFloat(dexValidation.data.pairs[0].priceUsd);

    if (!currentPrice) {
      throw new Error('Failed to fetch current price');
    }

    console.log('Current TRN price:', currentPrice);

    // Find all unsettled predictions where target_date has passed
    const { data: predictions, error: fetchError } = await supabase
      .from('market_predictions')
      .select('*')
      .is('was_correct', null)
      .lte('target_date', new Date().toISOString());

    if (fetchError) throw fetchError;

    console.log(`Found ${predictions?.length || 0} predictions to settle`);

    if (!predictions || predictions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No predictions to settle', settled: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let settledCount = 0;
    const nftAchievements: Array<{ user_wallet: string; achievement_id: string }> = [];

    for (const prediction of predictions) {
      // Determine if prediction was correct
      let wasCorrect = false;
      const priceDiff = currentPrice - prediction.current_price;
      const percentChange = (priceDiff / prediction.current_price) * 100;

      if (prediction.prediction_type === 'bull' && percentChange > 0) {
        wasCorrect = true;
      } else if (prediction.prediction_type === 'bear' && percentChange < 0) {
        wasCorrect = true;
      } else if (prediction.prediction_type === 'stable' && Math.abs(percentChange) < 2) {
        wasCorrect = true;
      }

      // Get user's current streak
      const { data: userPredictions } = await supabase
        .from('market_predictions')
        .select('was_correct, predicted_at')
        .eq('user_wallet', prediction.user_wallet)
        .not('was_correct', 'is', null)
        .order('predicted_at', { ascending: false })
        .limit(10);

      let currentStreak = 0;
      if (wasCorrect && userPredictions) {
        for (const pred of userPredictions) {
          if (pred.was_correct) currentStreak++;
          else break;
        }
      }

      // Calculate points and multiplier
      let basePoints = wasCorrect ? 100 : 0;
      let multiplier = 1;
      
      if (currentStreak >= 10) multiplier = 5;
      else if (currentStreak >= 5) multiplier = 2;

      const pointsEarned = basePoints * multiplier;

      // Update prediction
      const { error: updateError } = await supabase
        .from('market_predictions')
        .update({
          was_correct: wasCorrect,
          actual_price: currentPrice,
          points_earned: pointsEarned,
          points_multiplier: multiplier,
          streak_count: currentStreak,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', prediction.id);

      if (updateError) {
        console.error('Error updating prediction:', updateError);
        continue;
      }

      settledCount++;

      // Check for NFT achievements
      if (wasCorrect) {
        const userStats = await supabase
          .from('prediction_user_stats')
          .select('*')
          .eq('user_wallet', prediction.user_wallet)
          .single();

        if (userStats.data) {
          const stats = userStats.data;
          
          // Check for milestone achievements
          if (stats.correct_predictions === 10) {
            nftAchievements.push({
              user_wallet: prediction.user_wallet,
              achievement_id: 'crystal_ball',
            });
          } else if (stats.accuracy_percentage >= 90 && stats.total_predictions >= 30) {
            nftAchievements.push({
              user_wallet: prediction.user_wallet,
              achievement_id: 'market_sage',
            });
          } else if (stats.best_streak >= 10) {
            nftAchievements.push({
              user_wallet: prediction.user_wallet,
              achievement_id: 'streak_master',
            });
          }
        }
      }

      // Update tournament entries if applicable
      const { data: activeTournaments } = await supabase
        .from('prediction_tournaments')
        .select('id')
        .eq('status', 'active')
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString());

      if (activeTournaments && activeTournaments.length > 0) {
        for (const tournament of activeTournaments) {
          const { data: entry } = await supabase
            .from('tournament_entries')
            .select('*')
            .eq('tournament_id', tournament.id)
            .eq('user_wallet', prediction.user_wallet)
            .single();

          if (entry) {
            await supabase
              .from('tournament_entries')
              .update({
                total_predictions: entry.total_predictions + 1,
                correct_predictions: entry.correct_predictions + (wasCorrect ? 1 : 0),
                total_points: entry.total_points + pointsEarned,
                accuracy_rate: ((entry.correct_predictions + (wasCorrect ? 1 : 0)) / (entry.total_predictions + 1)) * 100,
              })
              .eq('id', entry.id);
          } else {
            await supabase
              .from('tournament_entries')
              .insert({
                tournament_id: tournament.id,
                user_wallet: prediction.user_wallet,
                total_predictions: 1,
                correct_predictions: wasCorrect ? 1 : 0,
                total_points: pointsEarned,
                accuracy_rate: wasCorrect ? 100 : 0,
              });
          }
        }
      }
    }

    // Mint NFT achievements
    for (const achievement of nftAchievements) {
      const nftData = getNFTMetadata(achievement.achievement_id);
      
      await supabase
        .from('nft_achievements')
        .upsert({
          user_wallet: achievement.user_wallet,
          achievement_id: achievement.achievement_id,
          ...nftData,
        }, {
          onConflict: 'user_wallet,achievement_id',
          ignoreDuplicates: true,
        });
    }

    console.log(`Successfully settled ${settledCount} predictions`);
    console.log(`Minted ${nftAchievements.length} NFT achievements`);

    return new Response(
      JSON.stringify({ 
        message: 'Predictions settled successfully', 
        settled: settledCount,
        nftsMinted: nftAchievements.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in settle-predictions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getNFTMetadata(achievementId: string) {
  const nfts: Record<string, any> = {
    crystal_ball: {
      nft_name: '🔮 Crystal Ball',
      nft_description: 'Made 10 correct predictions. The future is clear!',
      nft_image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=crystal',
      rarity: 'rare',
    },
    market_sage: {
      nft_name: '🧙 Market Sage',
      nft_description: '90%+ accuracy over 30 predictions. True wisdom!',
      nft_image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sage',
      rarity: 'epic',
    },
    streak_master: {
      nft_name: '🔥 Streak Master',
      nft_description: '10 correct predictions in a row. Unstoppable!',
      nft_image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=fire',
      rarity: 'epic',
    },
    contrarian_king: {
      nft_name: '👑 Contrarian King',
      nft_description: 'Correct when 90% were wrong. Against the grain!',
      nft_image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=crown',
      rarity: 'legendary',
    },
  };

  return nfts[achievementId] || nfts.crystal_ball;
}
