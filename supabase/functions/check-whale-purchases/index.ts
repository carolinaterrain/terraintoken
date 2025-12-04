/**
 * ARCHIVED: This edge function is not currently called from the frontend.
 * It was designed to detect large TRN purchases and create whale alerts.
 * 
 * Dependencies:
 * - trn_purchases table (may not exist)
 * - whale_alerts table
 * 
 * To reactivate: Add frontend trigger or cron job integration.
 * Last archived: 2025-12-04
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { checkRateLimit, getClientIP } from '../_shared/rate-limit.ts';

const signatureSchema = z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{87,88}$/, 'Invalid Solana transaction signature');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WHALE_THRESHOLD = 5000000; // 5M TRN

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const clientIP = getClientIP(req);
    
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'check-whale-purchases',
      windowMs: 3600000,
      maxRequests: 30
    }, SUPABASE_URL, SUPABASE_KEY);
    
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
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          } 
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: purchases, error } = await supabase
      .from("trn_purchases")
      .select("*")
      .gte("amount_trn", WHALE_THRESHOLD)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    for (const purchase of purchases || []) {
      if (purchase.transaction_signature) {
        const sigValidation = signatureSchema.safeParse(purchase.transaction_signature);
        if (!sigValidation.success) {
          console.error('Invalid transaction signature format:', purchase.transaction_signature);
          continue;
        }
        
        const { data: existing } = await supabase
          .from("whale_alerts")
          .select("id")
          .eq("metadata->transaction_signature", purchase.transaction_signature)
          .maybeSingle();

        if (!existing) {
          await supabase.from("whale_alerts").insert({
            wallet_address: purchase.wallet_address,
            amount_trn: purchase.amount_trn,
            alert_type: "large_purchase",
            metadata: {
              transaction_signature: purchase.transaction_signature,
              purchase_tier: purchase.purchase_tier,
            },
          });

          console.log(`Whale alert created for ${purchase.wallet_address}: ${purchase.amount_trn} TRN`);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, checked: purchases?.length || 0 }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error checking whale purchases:", message);
    
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
