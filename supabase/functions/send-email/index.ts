import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: "waitlist_confirmation" | "waitlist_approved" | "trn_reward";
  to_email: string;
  data: {
    referral_code?: string;
    position?: number;
    trn_amount?: number;
    reward_type?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email_type, to_email, data }: EmailRequest = await req.json();
    
    const siteUrl = Deno.env.get("SITE_URL") || "https://terraintoken.com";
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "TerrainScape <onboarding@resend.dev>";

    let html = "";
    let subject = "";

    switch (email_type) {
      case "waitlist_confirmation":
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="background-color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #22c55e; font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 24px;">
                  You're on the List! 🎉
                </h1>
                <p style="color: #e5e5e5; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  Welcome to the TerrainScape waitlist! You're #${data.position?.toLocaleString()} in line to experience the world's first educational play-to-earn MMO.
                </p>
                <div style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #22c55e; padding: 24px; margin: 32px 0; text-align: center;">
                  <p style="color: #a3a3a3; font-size: 14px; margin: 0 0 8px 0;">
                    Your Referral Code:
                  </p>
                  <p style="color: #22c55e; font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">
                    ${data.referral_code}
                  </p>
                </div>
                <p style="color: #e5e5e5; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  <strong>Move up the waitlist faster:</strong> Share your referral code! For every 5 friends who join using your code, you'll skip 100 spots in line.
                </p>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${siteUrl}/?ref=${data.referral_code}" style="background-color: #22c55e; border-radius: 8px; color: #0f0f0f; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 16px 32px;">
                    Share Your Referral Link
                  </a>
                </div>
                <p style="color: #e5e5e5; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  <strong>TRN Holders get Priority Access!</strong> Connect your wallet to move to the front of the line and receive a 500 TRN bonus when TerrainScape launches.
                </p>
                <p style="color: #898989; font-size: 12px; line-height: 22px; margin-top: 48px; text-align: center;">
                  <a href="${siteUrl}" style="color: #22c55e; text-decoration: underline;">Terrain Token (TRN)</a> - The meme coin with real-world utility
                </p>
              </div>
            </body>
          </html>
        `;
        subject = "Welcome to the TerrainScape Waitlist! 🎮";
        break;

      case "waitlist_approved":
        html = `
          <!DOCTYPE html>
          <html>
            <body style="background-color: #0f0f0f; color: #e5e5e5; font-family: sans-serif; padding: 40px;">
              <h1 style="color: #22c55e;">You're In! Welcome to TerrainScape Beta</h1>
              <p>Congratulations! You've been approved for early access to TerrainScape.</p>
              <p>Click here to get started: <a href="${siteUrl}/terrainscape" style="color: #22c55e;">Launch TerrainScape</a></p>
            </body>
          </html>
        `;
        subject = "🎉 TerrainScape Beta Access Granted!";
        break;

      case "trn_reward":
        html = `
          <!DOCTYPE html>
          <html>
            <body style="background-color: #0f0f0f; color: #e5e5e5; font-family: sans-serif; padding: 40px;">
              <h1 style="color: #22c55e;">You Earned ${data.trn_amount} TRN! 💰</h1>
              <p>Great work! You've earned ${data.trn_amount} TRN tokens for ${data.reward_type}.</p>
              <p>Keep contributing to earn more rewards!</p>
            </body>
          </html>
        `;
        subject = `You Earned ${data.trn_amount} TRN Tokens!`;
        break;

      default:
        throw new Error(`Unknown email type: ${email_type}`);
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to_email],
        subject,
        html,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(responseData)}`);
    }

    console.log(`Email sent successfully: ${email_type} to ${to_email}`, responseData);

    return new Response(JSON.stringify({ success: true, id: responseData.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
