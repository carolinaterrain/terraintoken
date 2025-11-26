import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIER_PRICES = {
  pro: { trn: 1000, fiat: 999 }, // cents
  business: { trn: 5000, fiat: 4999 },
  enterprise: { trn: 25000, fiat: 19999 },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, tier, paymentMethod, action } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (action === 'create') {
      if (paymentMethod === 'stripe') {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
          throw new Error('Stripe not configured');
        }

        const stripe = new Stripe(stripeKey, {
          apiVersion: '2023-10-16',
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${tier.toUpperCase()} Subscription`,
                  description: `Monthly ${tier} tier subscription`,
                },
                unit_amount: TIER_PRICES[tier as keyof typeof TIER_PRICES].fiat,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${Deno.env.get('SUPABASE_URL')}/subscriptions?success=true`,
          cancel_url: `${Deno.env.get('SUPABASE_URL')}/subscriptions?canceled=true`,
          metadata: {
            walletAddress,
            tier,
          },
        });

        return new Response(JSON.stringify({ 
          checkoutUrl: session.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // TRN subscription
        const trnCost = TIER_PRICES[tier as keyof typeof TIER_PRICES].trn;
        const trnBurned = trnCost * 0.5; // 50% burn for TRN payments

        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .insert({
            user_wallet: walletAddress,
            tier,
            payment_method: 'trn',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        // Record burn
        await supabase.from('token_burns').insert({
          burn_source: 'subscription',
          burn_amount: trnBurned,
          user_wallet: walletAddress,
          related_transaction_id: subscription.id,
        });

        return new Response(JSON.stringify({ success: true, subscription }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
