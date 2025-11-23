import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { p_wallet_address, p_trn_amount } = await req.json();

    // Get or create leaderboard entry
    const { data: existing } = await supabase
      .from("purchase_leaderboard")
      .select("*")
      .eq("wallet_address", p_wallet_address)
      .single();

    if (existing) {
      // Update existing entry
      const newTotal = Number(existing.total_trn_purchased) + Number(p_trn_amount);
      const newBiggest = Math.max(
        Number(existing.biggest_purchase_trn),
        Number(p_trn_amount)
      );

      await supabase
        .from("purchase_leaderboard")
        .update({
          total_purchases: existing.total_purchases + 1,
          total_trn_purchased: newTotal,
          biggest_purchase_trn: newBiggest,
          last_purchase_date: new Date().toISOString().split("T")[0],
        })
        .eq("wallet_address", p_wallet_address);
    } else {
      // Create new entry
      await supabase.from("purchase_leaderboard").insert({
        wallet_address: p_wallet_address,
        total_purchases: 1,
        total_trn_purchased: p_trn_amount,
        biggest_purchase_trn: p_trn_amount,
        last_purchase_date: new Date().toISOString().split("T")[0],
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
