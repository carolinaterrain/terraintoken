import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRequest {
  content_type: 'meme' | 'project' | 'comment';
  content_id: string;
  text_content?: string;
  image_url?: string;
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

    const { content_type, content_id, text_content, image_url }: ModerationRequest = await req.json();

    console.log(`Moderating ${content_type} with id: ${content_id}`);

    // Simple rule-based moderation (can be enhanced with AI)
    const flags: string[] = [];
    let score = 100;

    if (text_content) {
      const bannedWords = ['spam', 'scam', 'fake', 'fraud'];
      const lowerText = text_content.toLowerCase();
      
      for (const word of bannedWords) {
        if (lowerText.includes(word)) {
          flags.push(`Contains banned word: ${word}`);
          score -= 30;
        }
      }

      // Check for excessive caps
      const capsRatio = (text_content.match(/[A-Z]/g) || []).length / text_content.length;
      if (capsRatio > 0.5 && text_content.length > 20) {
        flags.push('Excessive capitalization');
        score -= 15;
      }

      // Check for suspicious links
      if (lowerText.includes('bit.ly') || lowerText.includes('tinyurl')) {
        flags.push('Suspicious shortened URL');
        score -= 25;
      }
    }

    const status = score >= 70 ? 'approved' : score >= 40 ? 'review' : 'rejected';

    // Update the content status
    let updateResult;
    if (content_type === 'meme') {
      updateResult = await supabaseClient
        .from('meme_submissions')
        .update({ 
          status,
          engagement_score: score 
        })
        .eq('id', content_id);
    } else if (content_type === 'project') {
      updateResult = await supabaseClient
        .from('project_media')
        .update({ 
          validation_status: status,
          ai_validation_score: score 
        })
        .eq('id', content_id);
    }

    console.log(`Moderation result: ${status} (score: ${score})`);

    // Log activity
    if (status === 'approved') {
      await supabaseClient.from('activity_notifications').insert({
        activity_type: `${content_type}_approved`,
        user_identifier: 'User',
        message: `New ${content_type} approved!`,
        metadata: { content_id, score }
      });
    }

    return new Response(
      JSON.stringify({ 
        status, 
        score, 
        flags,
        content_id 
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error in content moderation:', error);
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
