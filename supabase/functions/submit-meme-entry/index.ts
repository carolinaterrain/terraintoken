import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_BYTES = 10 * 1024 * 1024;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : null));

const fieldsSchema = z.object({
  email: z.union([z.literal(''), z.string().trim().email().max(255)]).optional()
    .transform((v) => (v ? v : null)),
  x_handle: optionalText(50),
  caption: optionalText(1000),
  x_post_url: z.union([z.literal(''), z.string().trim().url().max(500)]).optional()
    .transform((v) => (v ? v : null)),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Rate limit: 5 meme submissions per hour per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(
      clientIP,
      { endpoint: 'submit-meme', windowMs: 3600000, maxRequests: 5 },
      supabaseUrl,
      supabaseKey
    );
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.', retryAfter: rateLimitResult.retryAfter }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600',
          },
        }
      );
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return json({ error: 'Invalid submission' }, 400);
    }

    const file = form.get('file');
    if (!(file instanceof File)) {
      return json({ error: 'An image file is required' }, 400);
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return json({ error: 'Please upload a PNG, JPG, WebP or GIF image' }, 400);
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
      return json({ error: 'Image must be less than 10MB' }, 400);
    }

    const parsed = fieldsSchema.safeParse({
      email: form.get('email') ?? undefined,
      x_handle: form.get('x_handle') ?? undefined,
      caption: form.get('caption') ?? undefined,
      x_post_url: form.get('x_post_url') ?? undefined,
    });
    if (!parsed.success) {
      return json({ error: 'Please check your details and try again' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('meme-submissions')
      .upload(fileName, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error('Meme upload failed:', uploadError);
      return json({ error: 'Upload failed. Please try again.' }, 500);
    }

    const { data: { publicUrl } } = supabase.storage.from('meme-submissions').getPublicUrl(fileName);

    const { data: inserted, error: insertError } = await supabase
      .from('meme_submissions')
      .insert({
        image_url: publicUrl,
        ...parsed.data,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Meme insert failed:', insertError);
      await supabase.storage.from('meme-submissions').remove([fileName]);
      return json({ error: 'Submission failed. Please try again.' }, 500);
    }

    return json({ success: true, id: inserted.id, image_url: publicUrl });
  } catch (error) {
    console.error('Error in submit-meme-entry:', error);
    return json({ error: 'Submission failed. Please try again.' }, 500);
  }
});
