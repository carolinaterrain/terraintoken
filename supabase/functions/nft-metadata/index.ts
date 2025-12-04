import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NFT metadata configuration
const NFT_CONFIG = {
  symbol: 'TRNCE0',
  description: 'Official Terrain Token Community Edition Drop #0 - Limited to 50 worldwide. This NFT certifies ownership of an authentic TRN Collector Edition item.',
  image: 'https://dihbqhofqfcvjgpzmskx.supabase.co/storage/v1/object/public/carolina-terrain-projects/trn-collector-nft.png',
  externalUrl: 'https://terraintoken.com/drops',
  collection: {
    name: 'TRN Collector Editions',
    family: 'Terrain Token'
  }
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Extract certificate_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const certificateId = pathParts[pathParts.length - 1];

    if (!certificateId || certificateId === 'nft-metadata') {
      return new Response(
        JSON.stringify({ error: 'Certificate ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching metadata for certificate: ${certificateId}`);

    // Fetch certificate details
    const { data: certificate, error: certError } = await supabase
      .from('collector_nft_certificates')
      .select(`
        *,
        collector_drops (*)
      `)
      .eq('id', certificateId)
      .single();

    if (certError || !certificate) {
      console.error('Certificate fetch error:', certError);
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const drop = certificate.collector_drops;
    const serialNumber = certificate.serial_number;
    const totalSupply = drop.total_supply;

    // Build NFT metadata in Metaplex standard format
    const metadata = {
      name: `TRN Collector Edition #${serialNumber}/${totalSupply}`,
      symbol: NFT_CONFIG.symbol,
      description: NFT_CONFIG.description,
      seller_fee_basis_points: 500, // 5% royalties
      image: drop.nft_image_url || NFT_CONFIG.image,
      external_url: NFT_CONFIG.externalUrl,
      attributes: [
        { trait_type: 'Drop', value: 'CE-0' },
        { trait_type: 'Serial', value: `${serialNumber}/${totalSupply}` },
        { trait_type: 'Edition', value: 'Collector' },
        { trait_type: 'Item', value: 'Limited Edition Merch' },
        { trait_type: 'Creator', value: 'Terrain Token Community' },
        { trait_type: 'Authenticity', value: 'Verified' },
        { trait_type: 'Rarity', value: serialNumber <= 10 ? 'Ultra Rare' : serialNumber <= 25 ? 'Rare' : 'Standard' }
      ],
      properties: {
        files: [
          { uri: drop.nft_image_url || NFT_CONFIG.image, type: 'image/png' }
        ],
        category: 'image',
        creators: [
          { address: drop.treasury_wallet, share: 100 }
        ]
      },
      collection: NFT_CONFIG.collection
    };

    return new Response(
      JSON.stringify(metadata),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        } 
      }
    );

  } catch (error: unknown) {
    console.error('Metadata fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
