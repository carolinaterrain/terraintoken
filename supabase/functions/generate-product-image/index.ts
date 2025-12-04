import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// God-tier Printify-style prompts for each product type
const PRODUCT_PROMPTS: Record<string, string> = {
  'shirt-front': `Professional e-commerce product photography of a premium black heavyweight t-shirt on a pure white background. The shirt features a striking emerald green mountain logo design on the chest - angular geometric mountains with "TRN" text below. Clean studio lighting, crisp shadows, Printify/Shopify product listing style. The shirt is laid flat or on invisible mannequin showing the front. Ultra high resolution, commercial quality, no wrinkles, perfectly pressed. 4:5 aspect ratio product shot.`,
  
  'shirt-model': `Lifestyle product photography of a confident person wearing a premium black t-shirt with an emerald green geometric mountain logo and "TRN" text on the chest. Outdoor setting with natural lighting, casual urban environment. The model is relaxed and approachable, showing the shirt naturally. Professional lifestyle marketing shot like Printify mockup. Sharp focus on the shirt design, slightly blurred background. Ultra high resolution.`,
  
  'hat-front': `Professional e-commerce product photography of a black snapback cap on a pure white background. The hat features an embroidered emerald green geometric mountain logo on the front panel with "TRN" below. Clean studio lighting, showing the structured crown and flat brim. Printify/Shopify product listing style. Ultra high resolution, commercial quality. 1:1 aspect ratio product shot.`,
  
  'hat-model': `Lifestyle product photography of a person wearing a black snapback cap with an emerald green embroidered mountain logo and "TRN" text. Natural outdoor lighting, casual setting. The model looks confident and stylish. Professional lifestyle marketing shot like Printify mockup. Sharp focus on the hat design. Ultra high resolution.`,
  
  'flat-lay': `Professional flat lay product photography on a dark textured surface. Arranged items include: a black t-shirt with emerald green mountain logo, a black snapback hat with matching embroidered logo, holographic stickers with "TRN" branding, and a mint/emerald green accent card. Overhead shot, artistic arrangement, soft shadows. Premium brand aesthetic. Ultra high resolution. 4:3 aspect ratio.`,
  
  'bundle': `Professional product photography of a complete collector's bundle on a premium background. Display includes: a folded black t-shirt with emerald green mountain logo visible, a black snapback hat with embroidered logo, several holographic/iridescent stickers, and a special NFT certificate card with holographic effects showing "#XX/50". Premium packaging elements visible. Luxury brand aesthetic, clean studio lighting. Ultra high resolution.`,
  
  'certificate': `Digital art of an NFT certificate of authenticity. Dark premium background with emerald green accents. Features a stylized geometric mountain logo, "TERRAIN TOKEN" header, "COLLECTOR EDITION #0" text, serial number field showing "#XX/50", holographic/iridescent effects along the borders, blockchain verification badge. Sleek modern design with subtle grid patterns. Certificate style layout. Ultra high resolution digital artwork.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productType, regenerate = false } = await req.json();

    if (!productType || !PRODUCT_PROMPTS[productType]) {
      return new Response(
        JSON.stringify({ error: `Invalid product type. Valid types: ${Object.keys(PRODUCT_PROMPTS).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if image already exists (unless regenerating)
    if (!regenerate) {
      const { data: existing } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_type', productType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        console.log(`Using existing image for ${productType}`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            image: existing,
            cached: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Generating new image for ${productType}...`);

    // Generate image using Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: PRODUCT_PROMPTS[productType]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const imageData = aiResponse.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      console.error('No image data in response:', JSON.stringify(aiResponse).slice(0, 500));
      throw new Error('No image generated');
    }

    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${productType}-${timestamp}.png`;
    const storagePath = `generated/${filename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, binaryData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // If regenerating, deactivate old images
    if (regenerate) {
      await supabase
        .from('product_images')
        .update({ is_active: false })
        .eq('product_type', productType);
    }

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_type: productType,
        image_source: 'ai_generated',
        storage_path: storagePath,
        public_url: publicUrl,
        is_active: true,
        display_order: getDisplayOrder(productType),
        metadata: {
          prompt: PRODUCT_PROMPTS[productType],
          generated_at: new Date().toISOString(),
          model: 'google/gemini-2.5-flash-image-preview'
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save image record: ${dbError.message}`);
    }

    console.log(`Successfully generated and saved ${productType} image`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: imageRecord,
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-product-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getDisplayOrder(productType: string): number {
  const order: Record<string, number> = {
    'shirt-front': 1,
    'shirt-model': 2,
    'hat-front': 3,
    'hat-model': 4,
    'flat-lay': 5,
    'bundle': 6,
    'certificate': 7
  };
  return order[productType] || 99;
}
