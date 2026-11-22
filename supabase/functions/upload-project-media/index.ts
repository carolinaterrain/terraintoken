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
};
const MAX_BYTES = 10 * 1024 * 1024;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : null));

const fieldsSchema = z.object({
  title: optionalText(200),
  category: z.enum(['drainage', 'erosion', 'grading', 'retaining-wall', 'other']),
  location: optionalText(200),
  description: optionalText(2000),
  user_wallet_address: z.string().trim().max(100).regex(/^[A-Za-z0-9]*$/).optional()
    .transform((v) => (v ? v : null)),
  is_featured: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
  data_consent: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
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

    // Rate limit: 10 uploads per hour per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(
      clientIP,
      { endpoint: 'upload-project', windowMs: 3600000, maxRequests: 10 },
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
      return json({ error: 'Invalid upload' }, 400);
    }

    const file = form.get('file');
    if (!(file instanceof File)) {
      return json({ error: 'An image file is required' }, 400);
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return json({ error: 'Please upload a PNG, JPG, or WebP image' }, 400);
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
      return json({ error: 'Image must be less than 10MB' }, 400);
    }

    const parsed = fieldsSchema.safeParse({
      title: form.get('title') ?? undefined,
      category: form.get('category') ?? undefined,
      location: form.get('location') ?? undefined,
      description: form.get('description') ?? undefined,
      user_wallet_address: form.get('wallet_address') ?? undefined,
      is_featured: form.get('is_featured') ?? undefined,
      data_consent: form.get('data_consent') ?? undefined,
    });
    if (!parsed.success) {
      return json({ error: 'Please check your project details and try again' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('carolina-terrain-projects')
      .upload(fileName, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error('Project upload failed:', uploadError);
      return json({ error: 'Upload failed. Please try again.' }, 500);
    }

    const { data: { publicUrl } } = supabase.storage.from('carolina-terrain-projects').getPublicUrl(fileName);

    const { data: inserted, error: insertError } = await supabase
      .from('project_media')
      .insert({ image_url: publicUrl, ...parsed.data })
      .select('id')
      .single();

    if (insertError) {
      console.error('Project insert failed:', insertError);
      await supabase.storage.from('carolina-terrain-projects').remove([fileName]);
      return json({ error: 'Saving your project failed. Please try again.' }, 500);
    }

    return json({ success: true, id: inserted.id, image_url: publicUrl });
  } catch (error) {
    console.error('Error in upload-project-media:', error);
    return json({ error: 'Upload failed. Please try again.' }, 500);
  }
});
