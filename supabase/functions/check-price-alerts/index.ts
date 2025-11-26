import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { checkRateLimit, getClientIP } from '../_shared/rate-limit.ts';

// DexScreener response validation
const dexResponseSchema = z.object({
  pair: z.object({
    priceUsd: z.string().regex(/^\d+(\.\d+)?$/)
  })
});

// Email validation
const emailSchema = z.string().email().max(255);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      throw new Error('Email configuration missing');
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'check-price-alerts',
      windowMs: 60000, // 1 minute
      maxRequests: 1
    }, SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          } 
        }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log('Checking price alerts...');

    // Get current TRN price from DexScreener with validation
    const priceResponse = await fetch(
      'https://api.dexscreener.com/latest/dex/pairs/solana/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump'
    );

    if (!priceResponse.ok) {
      throw new Error('Failed to fetch current price');
    }

    const priceData = await priceResponse.json();
    const dexValidation = dexResponseSchema.safeParse(priceData);
    
    if (!dexValidation.success) {
      throw new Error('Invalid DexScreener API response');
    }
    
    const currentPrice = parseFloat(dexValidation.data.pair.priceUsd);

    console.log(`Current TRN price: $${currentPrice}`);

    // Get all active alerts
    const { data: alerts, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('is_active', true)
      .is('triggered_at', null);

    if (error) {
      throw error;
    }

    console.log(`Found ${alerts?.length || 0} active alerts`);

    let triggeredCount = 0;

    // Check each alert
    for (const alert of alerts || []) {
      // Validate email before sending
      const emailValidation = emailSchema.safeParse(alert.user_email);
      if (!emailValidation.success) {
        console.error('Invalid email address:', alert.user_email);
        continue;
      }
      
      let shouldTrigger = false;

      if (alert.alert_type === 'above' && currentPrice >= alert.target_price) {
        shouldTrigger = true;
      } else if (alert.alert_type === 'below' && currentPrice <= alert.target_price) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        console.log(`Triggering alert for ${alert.user_email}`);

        // Send email
        try {
          await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: [alert.user_email],
            subject: `🔔 TRN Price Alert: Target Reached!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #22c55e;">🚀 Price Alert Triggered!</h1>
                <p>Your TRN price alert has been triggered.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Target Price:</strong> $${alert.target_price}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Current Price:</strong> $${currentPrice.toFixed(8)}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Alert Type:</strong> ${alert.alert_type === 'above' ? 'Above 📈' : 'Below 📉'}</p>
                </div>
                <p>Visit the <a href="https://terraintoken.com/goblin-market" style="color: #22c55e;">Goblin Market</a> to see live charts and trading activity.</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">This alert has been deactivated. Create a new alert if you want to continue tracking this price level.</p>
              </div>
            `,
          });

          // Mark alert as triggered
          await supabase
            .from('price_alerts')
            .update({
              triggered_at: new Date().toISOString(),
              is_active: false,
            })
            .eq('id', alert.id);

          triggeredCount++;
        } catch (emailError) {
          console.error(`Failed to send email to ${alert.user_email}:`, emailError);
        }
      }
    }

    console.log(`Triggered ${triggeredCount} alerts`);

    return new Response(
      JSON.stringify({
        success: true,
        currentPrice,
        alertsChecked: alerts?.length || 0,
        alertsTriggered: triggeredCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error checking price alerts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
