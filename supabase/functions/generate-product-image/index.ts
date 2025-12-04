import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// WINNING TRN LOGO DESCRIPTION:
// - Angular purple/violet geometric mountain peaks with gold/bronze accent highlights
// - Gold hexagonal "TRN" badge with circuit board pattern details
// - "TERRAIN TOKEN" text with TERRAIN in silver/white and TOKEN in purple/magenta
// - Cyan/teal glowing wireframe grid landscape stretching to horizon
// - Dark cosmic space background with subtle star field

const WINNING_LOGO_DESCRIPTION = `featuring the Terrain Token winning logo design: angular purple and violet geometric mountain peaks with gold/bronze accent highlights, a gold hexagonal "TRN" monogram badge with circuit board pattern details, "TERRAIN TOKEN" text (TERRAIN in silver/white, TOKEN in purple/magenta), and a cyan/teal glowing wireframe grid element. Dark cosmic background with subtle stars.`;

const PRODUCT_PROMPTS: Record<string, string> = {
  // === COLLECTOR SHIRT ===
  'collector-shirt-front': `Professional e-commerce product photography of a premium black heavyweight t-shirt on a pure white background. The shirt ${WINNING_LOGO_DESCRIPTION} Clean studio lighting, crisp shadows, Printify/Shopify product listing style. The shirt is laid flat or on invisible mannequin showing the front. Ultra high resolution, commercial quality, no wrinkles, perfectly pressed. 4:5 aspect ratio product shot.`,
  
  'collector-shirt-lifestyle': `Lifestyle product photography of a confident entrepreneur in their 30s wearing a premium black t-shirt ${WINNING_LOGO_DESCRIPTION} Setting: modern industrial coffee shop with exposed brick. Natural window lighting. The person is holding a coffee, looking successful and approachable. Professional lifestyle marketing shot like Printify mockup. Sharp focus on the shirt design, bokeh background. Ultra high resolution.`,

  // === PREMIUM HOODIE ===
  'hoodie-front': `Professional e-commerce product photography of a premium black heavyweight hoodie on a pure white background. The hoodie ${WINNING_LOGO_DESCRIPTION} High-quality cotton blend fabric visible, kangaroo pocket, drawstring hood. Clean studio lighting, Printify/Shopify product listing style. Laid flat or ghost mannequin. Ultra high resolution, commercial quality. 4:5 aspect ratio.`,
  
  'hoodie-lifestyle': `Lifestyle product photography of a person wearing a premium black hoodie ${WINNING_LOGO_DESCRIPTION} They're outdoors on a cool autumn day on a hiking trail with mountains in the background. Hood down, hands in pocket, confident stance. Golden hour lighting. Professional lifestyle marketing shot. Sharp focus on hoodie design. Ultra high resolution.`,

  // === WORK TEE ===
  'work-tee-front': `Professional e-commerce product photography of a rugged work-ready black pocket t-shirt on a pure white background. Features a small version of the Terrain Token logo (purple mountain peaks, gold TRN badge) on the left chest pocket. Heavy-duty construction quality visible, reinforced seams. The shirt is laid flat showing the pocket detail. Printify/Shopify product listing style. Ultra high resolution, commercial quality. 4:5 aspect ratio.`,
  
  'work-tee-lifestyle': `Lifestyle product photography of a hardworking tradesperson wearing a black pocket t-shirt with the Terrain Token logo (purple mountains, gold TRN badge) on the pocket. Setting: outdoor job site or workshop. They look professional and capable. Natural lighting, some construction/landscaping elements visible. The shirt shows durability. Professional marketing shot. Ultra high resolution.`,

  // === COLLECTOR HAT ===
  'collector-hat-front': `Professional e-commerce product photography of a black structured snapback cap on a pure white background. The hat features an embroidered Terrain Token logo: purple/violet geometric mountain peaks with gold "TRN" badge and cyan wireframe accent. High-quality construction, flat brim, snapback closure. Clean studio lighting, showing the crown shape. Printify/Shopify product listing style. Ultra high resolution. 1:1 aspect ratio.`,
  
  'collector-hat-lifestyle': `Lifestyle product photography of a stylish person wearing a black snapback cap with the embroidered Terrain Token logo (purple mountains, gold TRN badge, cyan accents). Urban setting, natural lighting. They look confident and trendy. The hat fits perfectly, slight angle showing the logo. Professional lifestyle marketing shot like Printify mockup. Sharp focus on hat design. Ultra high resolution.`,

  // === BEANIE ===
  'beanie-front': `Professional e-commerce product photography of a black knit beanie on a pure white background. Features an embroidered or patch Terrain Token logo: purple geometric mountains with gold TRN badge on the front cuff. Soft ribbed texture visible. Printify/Shopify product listing style, clean studio lighting. Ultra high resolution, commercial quality. 1:1 aspect ratio.`,
  
  'beanie-lifestyle': `Lifestyle product photography of a person wearing a black knit beanie with the Terrain Token logo (purple mountains, gold badge) in a winter setting. Light snow or cold weather atmosphere, cozy scarf. Natural lighting, breath visible in cold air. Professional lifestyle marketing shot. Sharp focus on the beanie. Ultra high resolution.`,

  // === COFFEE MUG ===
  'coffee-mug-front': `Professional e-commerce product photography of a premium black ceramic coffee mug on a pure white background. Features a wraparound Terrain Token design: purple/violet geometric mountain peaks, gold hexagonal TRN badge, cyan wireframe grid, "TERRAIN TOKEN" text. Glossy finish, comfortable handle. Clean studio lighting, slight steam effect optional. Printify/Shopify product listing style. Ultra high resolution. 1:1 aspect ratio.`,
  
  'coffee-mug-lifestyle': `Lifestyle product photography of a person's hands holding a black ceramic mug with the Terrain Token design (purple mountains, gold TRN badge, cyan grid). Setting: modern desk setup with laptop and plants. Morning light streaming in. The mug is being enjoyed during a work session. Professional lifestyle shot, warm and inviting. Ultra high resolution.`,

  // === KEYCHAIN ===
  'keychain-front': `Professional e-commerce product photography of a premium metal keychain on a pure white background. Features the Terrain Token logo: purple enamel geometric mountains with gold TRN badge and cyan accent details. High-quality metal ring attachment, substantial weight visible. Clean studio lighting, showing the detail and craftsmanship. Printify/Shopify style. Ultra high resolution. 1:1 aspect ratio.`,
  
  'keychain-lifestyle': `Lifestyle product photography of keys on a surface with the Terrain Token keychain (purple mountains, gold badge, cyan accents) prominently displayed. Setting: car interior dashboard or modern entryway key hook. Natural lighting. The keychain looks premium and catches light. Professional marketing shot. Ultra high resolution.`,

  // === STICKER PACK ===
  'sticker-pack-front': `Professional e-commerce product photography of a sticker pack on a pure white background. Includes 5-6 holographic/iridescent stickers featuring: the Terrain Token logo (purple mountains, gold TRN badge), "TERRAIN TOKEN" text, goblin mascot character in purple/gold colors, "HODL" slogan, and cyan wireframe grid pattern. Arranged artfully showing variety with holographic shine. Printify/Shopify style. Ultra high resolution. 4:3 aspect ratio.`,
  
  'sticker-pack-lifestyle': `Lifestyle product photography of the Terrain Token sticker pack applied to various surfaces: laptop lid, water bottle, phone case, notebook. Purple mountain designs with gold TRN badges and holographic effects catching light. Modern desk setup. Professional marketing shot showing real-world use. Ultra high resolution.`,

  // === COLLECTOR BUNDLE ===
  'collector-bundle-hero': `Professional product photography of the complete Terrain Token Collector's Bundle on a premium dark slate surface. Includes: folded black t-shirt with the purple/violet mountain logo and gold TRN badge visible, black snapback hat with embroidered logo, sticker pack spread artfully, and a holographic NFT certificate card with cyan wireframe border. Premium packaging elements, gift-ready presentation. Luxury brand aesthetic, dramatic lighting with purple and cyan accent glow. Ultra high resolution. 16:9 aspect ratio hero shot.`,
  
  'collector-bundle-contents': `Overhead flat lay product photography of all Terrain Token Collector's Bundle contents spread on a dark textured background. Each item clearly visible: t-shirt unfolded showing the purple mountain logo with gold TRN badge, hat, individual stickers with holographic effects, NFT certificate with cyan border, and premium packaging. Numbered labels or callouts optional. Clean professional lighting. Ultra high resolution. 4:3 aspect ratio.`,

  // === NFT CERTIFICATE ===
  'nft-certificate-display': `Digital art of an NFT Certificate of Authenticity displayed on a premium stand. Dark gradient background with purple and cyan accent lighting. The certificate features: the Terrain Token logo (purple geometric mountains, gold hexagonal TRN badge), "TERRAIN TOKEN COLLECTOR" header in silver, edition number "#XX/50", unique serial number, holographic border effects in cyan/teal, and blockchain verification QR code. Sleek modern design, glass-like reflections. Ultra high resolution digital artwork. 3:4 aspect ratio.`,
  
  'nft-certificate-mobile': `Digital mockup of the NFT certificate displayed on a smartphone screen in a hand. The certificate shows the Terrain Token branding: purple mountains, gold TRN badge, edition number, holographic cyan effects. The phone is in a modern room setting, soft lighting. Showing how collectors view their digital asset. Professional marketing shot. Ultra high resolution. 9:16 aspect ratio.`,

  // === MARKETING HERO SHOTS ===
  'brand-hero-all-products': `Epic marketing hero image featuring ALL Terrain Token merchandise arranged in a powerful composition. Black t-shirt, hoodie, hat, beanie, mug, keychain, stickers, and NFT certificate all visible - each featuring the distinctive purple/violet mountain logo with gold TRN badge. Dramatic purple and cyan lighting effects, dark premium background with cosmic starfield. Mountain landscape subtle in background. Professional campaign-quality shot. Ultra high resolution. 21:9 ultrawide aspect ratio.`,
  
  'lifestyle-team-shot': `Professional lifestyle photography of a diverse group of 3-4 people wearing various Terrain Token merchandise: one in t-shirt, one in hoodie, one in hat. All items feature the purple mountain logo with gold TRN badge. They're outdoors in a mountainous setting, golden hour lighting with purple/magenta sky tones. Everyone looks confident and connected, like a team. Purple and cyan accents pop against the natural backdrop. Professional marketing campaign shot. Ultra high resolution. 16:9 aspect ratio.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productType, regenerate = false } = await req.json();

    if (!productType || !PRODUCT_PROMPTS[productType]) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid product type. Valid types: ${Object.keys(PRODUCT_PROMPTS).join(', ')}`,
          validTypes: Object.keys(PRODUCT_PROMPTS)
        }),
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
    // Collector Shirt
    'collector-shirt-front': 1,
    'collector-shirt-lifestyle': 2,
    // Hoodie
    'hoodie-front': 3,
    'hoodie-lifestyle': 4,
    // Work Tee
    'work-tee-front': 5,
    'work-tee-lifestyle': 6,
    // Hat
    'collector-hat-front': 7,
    'collector-hat-lifestyle': 8,
    // Beanie
    'beanie-front': 9,
    'beanie-lifestyle': 10,
    // Mug
    'coffee-mug-front': 11,
    'coffee-mug-lifestyle': 12,
    // Keychain
    'keychain-front': 13,
    'keychain-lifestyle': 14,
    // Stickers
    'sticker-pack-front': 15,
    'sticker-pack-lifestyle': 16,
    // Bundle
    'collector-bundle-hero': 17,
    'collector-bundle-contents': 18,
    // Certificate
    'nft-certificate-display': 19,
    'nft-certificate-mobile': 20,
    // Marketing
    'brand-hero-all-products': 21,
    'lifestyle-team-shot': 22
  };
  return order[productType] || 99;
}
