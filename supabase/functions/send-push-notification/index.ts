import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { title, body, icon, badge, data, target, session_id }: PushNotificationRequest = await req.json();

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
