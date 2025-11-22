import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SocialPostRequest {
  platform: 'twitter' | 'facebook' | 'linkedin';
  message: string;
  image_url?: string;
  link?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, message, image_url, link }: SocialPostRequest = await req.json();

    console.log(`Auto-posting to ${platform}: ${message}`);

    // This is a placeholder - in production, integrate with Twitter API, Facebook Graph API, etc.
    // For now, we'll generate a shareable link
    
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
