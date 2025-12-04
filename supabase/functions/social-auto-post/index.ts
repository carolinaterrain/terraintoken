/**
 * ARCHIVED: This edge function is not currently called from the frontend.
 * It generates social media share URLs but doesn't actually post (no API integrations).
 * 
 * To fully implement: Add Twitter API, Facebook Graph API, LinkedIn API keys.
 * Last archived: 2025-12-04
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const socialPostSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'linkedin']),
  message: z.string().min(1).max(280).trim(),
  image_url: z.string().url().optional(),
  link: z.string().url().optional()
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = Deno.env.get('CRON_API_KEY');
    
    if (apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validation = socialPostSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { platform, message, link } = validation.data;

    console.log(`Auto-posting to ${platform}: ${message}`);

    let shareUrl = '';
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = link ? encodeURIComponent(link) : '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        share_url: shareUrl,
        platform,
        message: 'Share URL generated successfully'
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error in social auto-post:', error);
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
