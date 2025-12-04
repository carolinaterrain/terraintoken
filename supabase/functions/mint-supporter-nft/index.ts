import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NFT metadata configuration for Supporter Edition
const SUPPORTER_NFT_CONFIG = {
  symbol: 'TRNSE',
  description: 'TRN Supporter Edition - Digital NFT showing your support for the Terrain Token ecosystem. Thank you for being part of the community!',
  image: 'https://dihbqhofqfcvjgpzmskx.supabase.co/storage/v1/object/public/carolina-terrain-projects/branding/trn-logo-full.png',
  external_url: 'https://terraintoken.com',
  attributes: [
    { trait_type: 'Edition', value: 'Supporter' },
    { trait_type: 'Type', value: 'Digital Certificate' },
    { trait_type: 'Creator', value: 'Terrain Token' }
  ],
  collection: {
    name: 'TRN Supporter Editions',
    family: 'Terrain Token'
  }
};

interface MintRequest {
  buyer_wallet: string;
  buyer_email?: string;
  shopify_order_id?: string;
  shopify_variant_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { buyer_wallet, buyer_email, shopify_order_id, shopify_variant_id }: MintRequest = await req.json();

    // Validate required fields
    if (!buyer_wallet) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: buyer_wallet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Minting Supporter NFT for wallet: ${buyer_wallet}`);

    // Generate unique NFT ID
    const nftId = crypto.randomUUID();
    const mintTimestamp = new Date().toISOString();

    // Create NFT metadata
    const metadata = {
      name: 'TRN Supporter Edition',
      symbol: SUPPORTER_NFT_CONFIG.symbol,
      description: SUPPORTER_NFT_CONFIG.description,
      image: SUPPORTER_NFT_CONFIG.image,
      external_url: SUPPORTER_NFT_CONFIG.external_url,
      attributes: [
        ...SUPPORTER_NFT_CONFIG.attributes,
        { trait_type: 'Mint Date', value: mintTimestamp.split('T')[0] },
        { trait_type: 'NFT ID', value: nftId.slice(0, 8) }
      ],
      properties: {
        files: [
          {
            uri: SUPPORTER_NFT_CONFIG.image,
            type: 'image/png'
          }
        ],
        category: 'image',
        creators: [
          {
            address: 'DJMGpHRF7sToxh7e6xGWvSfaB3zpcSFH3bChZ1w36Tkp', // TRN Treasury
            share: 100
          }
        ]
      },
      collection: SUPPORTER_NFT_CONFIG.collection
    };

    // Generate mock metadata URI (in production, this would upload to Arweave/IPFS)
    const mockMetadataUri = `https://terraintoken.com/api/nft/supporter/${nftId}/metadata.json`;
    
    // Generate mock mint address (in production, this would be actual on-chain minting)
    const mockMintAddress = `TRN${nftId.replace(/-/g, '').slice(0, 40)}`;

    // Insert record into supporter_nfts table
    const { data: nftRecord, error: insertError } = await supabase
      .from('supporter_nfts')
      .insert({
        buyer_wallet,
        buyer_email,
        shopify_order_id,
        shopify_variant_id,
        mint_address: mockMintAddress,
        metadata_uri: mockMetadataUri,
        status: 'minted'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting supporter NFT record:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log(`Successfully minted Supporter NFT: ${mockMintAddress}`);

    // Create activity notification
    await supabase
      .from('activity_notifications')
      .insert({
        activity_type: 'supporter_nft_minted',
        user_identifier: buyer_wallet,
        message: `Supporter Edition NFT minted for ${buyer_wallet.slice(0, 4)}...${buyer_wallet.slice(-4)}`,
        metadata: {
          nft_id: nftRecord.id,
          mint_address: mockMintAddress
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        nft_id: nftRecord.id,
        mint_address: mockMintAddress,
        metadata_uri: mockMetadataUri,
        metadata,
        message: 'Supporter NFT minted successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error minting supporter NFT:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
