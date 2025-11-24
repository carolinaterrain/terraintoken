import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const emailWorkflowSchema = z.object({
  type: z.enum(['waitlist_signup', 'trn_reward', 'contest_entry', 'meme_approved']),
  data: z.object({
    email: z.string().email().max(255),
    name: z.string().max(100).optional(),
    position: z.number().int().positive().optional(),
    referral_code: z.string().max(20).optional(),
    trn_amount: z.number().positive().optional(),
    contest_week: z.string().max(50).optional()
  })
});

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailWorkflowEvent {
  type: "waitlist_signup" | "trn_reward" | "contest_entry" | "meme_approved";
  data: {
    email: string;
    name?: string;
    position?: number;
    referral_code?: string;
    trn_amount?: number;
    contest_week?: string;
  };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Key validation for cron job security
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = Deno.env.get('CRON_API_KEY');
    
    if (apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Validate input
    const body = await req.json();
    const validation = emailWorkflowSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const event: EmailWorkflowEvent = validation.data;

    console.log("Processing email workflow:", event.type);

    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "TerrainScape <onboarding@resend.dev>";
    let subject = "";
    let html = "";

    switch (event.type) {
      case "waitlist_signup":
        subject = "🎉 Welcome to TerrainScape Waitlist!";
        html = `
          <h1>You're In! 🌱</h1>
          <p>Welcome to the TerrainScape waitlist! You're position <strong>#${event.data.position}</strong>.</p>
          <p><strong>Your Referral Code:</strong> ${event.data.referral_code}</p>
          <p>Share your code and move up the waitlist faster!</p>
          <p>Share link: https://terraintoken.fun/?ref=${event.data.referral_code}</p>
          <hr />
          <p>Stay tuned for beta access announcements!</p>
          <p>- The Terrain Token Team 🏔️</p>
        `;
        break;

      case "trn_reward":
        subject = "💰 You Earned TRN!";
        html = `
          <h1>Congratulations! 💎</h1>
          <p>You just earned <strong>${event.data.trn_amount} TRN</strong> for your contribution!</p>
          <p>Keep uploading terrain analysis to earn more rewards.</p>
          <p><a href="https://terraintoken.fun/earn-trn">Upload More</a></p>
          <hr />
          <p>- The Terrain Token Team 🌱</p>
        `;
        break;

      case "contest_entry":
        subject = "🏆 Contest Entry Received!";
        html = `
          <h1>Contest Entry Confirmed! 🎉</h1>
          <p>Your entry for <strong>${event.data.contest_week}</strong> has been received!</p>
          <p>Winners will be announced at the end of the contest period.</p>
          <p>Good luck! 🍀</p>
          <hr />
          <p>- The Terrain Token Team</p>
        `;
        break;

      case "meme_approved":
        subject = "✅ Your Meme Was Approved!";
        html = `
          <h1>Meme Approved! 🎨</h1>
          <p>Your meme submission has been approved and is now live!</p>
          <p><a href="https://terraintoken.fun/goblin-cave">View Your Meme</a></p>
          <p>Share it on Twitter for extra engagement!</p>
          <hr />
          <p>- The Terrain Token Team 🏆</p>
        `;
        break;

      default:
        throw new Error("Unknown workflow type");
    }

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [event.data.email],
        subject,
        html,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(responseData)}`);
    }

    console.log(`Email sent successfully: ${event.type} to ${event.data.email}`);

    return new Response(
      JSON.stringify({ success: true, id: responseData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Email workflow error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
