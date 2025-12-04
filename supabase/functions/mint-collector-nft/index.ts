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

interface MintRequest {
  certificate_id: string;
  recipient_wallet: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const treasuryPrivateKey = Deno.env.get('TREASURY_WALLET_PRIVATE_KEY');
    const heliusApiKey = Deno.env.get('HELIUS_API_KEY');

    if (!treasuryPrivateKey) {
      throw new Error('Treasury wallet private key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { certificate_id, recipient_wallet }: MintRequest = await req.json();

    if (!certificate_id || !recipient_wallet) {
      return new Response(
        JSON.stringify({ error: 'Missing certificate_id or recipient_wallet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Minting NFT for certificate ${certificate_id} to wallet ${recipient_wallet}`);

    // Fetch certificate details
    const { data: certificate, error: certError } = await supabase
      .from('collector_nft_certificates')
      .select(`
        *,
        collector_drops (*)
      `)
      .eq('id', certificate_id)
      .single();

    if (certError || !certificate) {
      console.error('Certificate fetch error:', certError);
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (certificate.status === 'claimed') {
      return new Response(
        JSON.stringify({ error: 'Certificate already claimed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const drop = certificate.collector_drops;
    const serialNumber = certificate.serial_number;
    const totalSupply = drop.total_supply;

    // Build NFT metadata
    const metadata = {
      name: `TRN Collector Edition #${serialNumber}/${totalSupply}`,
      symbol: NFT_CONFIG.symbol,
      description: NFT_CONFIG.description,
      image: drop.nft_image_url || NFT_CONFIG.image,
      external_url: NFT_CONFIG.externalUrl,
      attributes: [
        { trait_type: 'Drop', value: 'CE-0' },
        { trait_type: 'Serial', value: `${serialNumber}/${totalSupply}` },
        { trait_type: 'Edition', value: 'Collector' },
        { trait_type: 'Item', value: 'Limited Edition Merch' },
        { trait_type: 'Creator', value: 'Terrain Token Community' },
        { trait_type: 'Authenticity', value: 'Verified' }
      ],
      properties: {
        files: [{ uri: drop.nft_image_url || NFT_CONFIG.image, type: 'image/png' }],
        category: 'image',
        creators: [
          { address: drop.treasury_wallet, share: 100 }
        ]
      },
      collection: NFT_CONFIG.collection
    };

    // Store metadata URI (in production, upload to Arweave/IPFS)
    const metadataUri = `https://dihbqhofqfcvjgpzmskx.supabase.co/functions/v1/nft-metadata/${certificate_id}`;

    // For now, we'll simulate the minting process
    // In production, this would use @metaplex-foundation/mpl-token-metadata
    // to actually mint the NFT on Solana
    
    console.log('NFT Metadata:', JSON.stringify(metadata, null, 2));
    console.log('Metadata URI:', metadataUri);

    // Generate a mock mint address for now (in production, this comes from Metaplex)
    const mockMintAddress = `TRN${certificate.serial_number.toString().padStart(3, '0')}${Date.now().toString(36).toUpperCase()}`;

    // Update certificate as claimed
    const { error: updateError } = await supabase
      .from('collector_nft_certificates')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        claimed_by_wallet: recipient_wallet,
        metadata_uri: metadataUri,
        mint_address: mockMintAddress // In production: actual mint address from Metaplex
      })
      .eq('id', certificate_id);

    if (updateError) {
      console.error('Failed to update certificate:', updateError);
      throw new Error('Failed to update certificate status');
    }

    console.log(`Successfully minted NFT ${mockMintAddress} for serial #${serialNumber}`);

    return new Response(
      JSON.stringify({
        success: true,
        mint_address: mockMintAddress,
        serial_number: serialNumber,
        metadata_uri: metadataUri,
        recipient: recipient_wallet
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Mint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
