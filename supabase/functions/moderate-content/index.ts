import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const moderationSchema = z.object({
  content_type: z.enum(['meme', 'project', 'comment']),
  content_id: z.string().uuid(),
  text_content: z.string().max(10000).optional(),
  image_url: z.string().url().max(500).optional()
});

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

    // Rate limiting: 100 moderation actions per hour per admin
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'moderate-content',
      windowMs: 3600000,
      maxRequests: 100
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
    const validation = moderationSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { content_type, content_id, text_content, image_url } = validation.data;

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
