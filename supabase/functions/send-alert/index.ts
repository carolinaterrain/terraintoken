import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const alertSchema = z.object({
  type: z.enum(["error", "security", "content", "milestone"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  metadata: z.record(z.any()).optional()
});

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: isAdmin } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: 20 alerts per hour per admin
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'send-alert',
      windowMs: 3600000,
      maxRequests: 20
    }, supabaseUrl, supabaseKey);

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter }),
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

    // Validate input
    const body = await req.json();
    const validation = alertSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const alert = validation.data;

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
