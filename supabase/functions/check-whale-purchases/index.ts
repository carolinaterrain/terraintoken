import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get recent purchases above whale threshold
    const { data: purchases, error } = await supabase
      .from("trn_purchases")
      .select("*")
      .gte("amount_trn", WHALE_THRESHOLD)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    // Check each purchase and create whale alert if not already exists
    for (const purchase of purchases || []) {
      const { data: existing } = await supabase
        .from("whale_alerts")
        .select("id")
        .eq("metadata->transaction_signature", purchase.transaction_signature)
        .single();

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
