import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  type: "error" | "security" | "content" | "milestone";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

const ADMIN_EMAIL = "admin@terraintoken.fun"; // Update with real admin email

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alert: AlertRequest = await req.json();

    console.log("Sending alert:", alert);

    // Only send emails for medium+ severity
    if (alert.severity === "low") {
      return new Response(
        JSON.stringify({ success: true, skipped: "Low severity" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const severityEmoji = {
      low: "ℹ️",
      medium: "⚠️",
      high: "🚨",
      critical: "🔥",
    };

    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Alerts <onboarding@resend.dev>";
    const subject = `${severityEmoji[alert.severity]} ${alert.severity.toUpperCase()}: ${alert.title}`;
    const html = `
      <h1>${severityEmoji[alert.severity]} ${alert.title}</h1>
      <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
      <p><strong>Type:</strong> ${alert.type}</p>
      <hr />
      <p>${alert.message}</p>
      ${alert.metadata ? `
        <hr />
        <h3>Additional Details:</h3>
        <pre>${JSON.stringify(alert.metadata, null, 2)}</pre>
      ` : ''}
      <hr />
      <p><small>Sent from Terrain Token Alert System at ${new Date().toISOString()}</small></p>
    `;

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(responseData)}`);
    }

    console.log(`Alert sent successfully: ${alert.type} - ${alert.severity}`);

    return new Response(
      JSON.stringify({ success: true, id: responseData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Alert error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
