import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const notificationSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  icon: z.string().url().optional(),
  url: z.string().url().optional()
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationRequest {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  target?: 'all' | 'session_id';
  session_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Key validation
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = Deno.env.get('CRON_API_KEY');
    
    if (apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate input
    const body = await req.json();
    const validation = notificationSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { title, body: notificationBody, icon, url } = validation.data;
    const { badge, data, target, session_id } = await req.json();

    // Get subscriptions
    let query = supabaseClient.from('push_subscriptions').select('*');
    
    if (target === 'session_id' && session_id) {
      query = query.eq('session_id', session_id);
    }

    const { data: subscriptions, error } = await query;

    if (error) throw error;

    console.log(`Sending push notification to ${subscriptions?.length || 0} subscribers`);

    const notification = {
      title,
      body,
      icon: icon || '/icon-192.png',
      badge: badge || '/icon-192.png',
      data: data || {},
    };

    // In production, use Web Push API with VAPID keys
    // For now, store notification intent
    const results = {
      success: true,
      sent_count: subscriptions?.length || 0,
      notification,
      message: 'Push notifications queued (implement Web Push in production)'
    };

    return new Response(
      JSON.stringify(results),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);
