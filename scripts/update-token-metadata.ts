/**
 * Solana Token Metadata Update Script
 * 
 * This script updates the on-chain metadata for the Terrain Token (TRN)
 * using the Metaplex Token Metadata Program.
 * 
 * Prerequisites:
 * 1. Install dependencies: npm install @metaplex-foundation/mpl-token-metadata@3 @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
 * 2. Have update authority wallet's private key
 * 3. Have ~0.01 SOL for transaction fees
 * 
 * Usage:
 * ts-node scripts/update-token-metadata.ts
 * or
 * npx tsx scripts/update-token-metadata.ts
 */

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  mplTokenMetadata, 
  updateV1, 
  findMetadataPda 
} from '@metaplex-foundation/mpl-token-metadata';
import { 
  publicKey, 
  createSignerFromKeypair,
  signerIdentity,
  generateSigner
} from '@metaplex-foundation/umi';

// Configuration
const CONFIG = {
  // Terrain Token mint address
  MINT_ADDRESS: 'Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m',
  
  // Metadata URI - points to your hosted JSON
  METADATA_URI: 'https://terrainvision-ai.com/token-metadata.json',
  
  // Token details
  TOKEN_NAME: 'Terrain Token',
  TOKEN_SYMBOL: 'TRN',
  
  // Solana RPC endpoint
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  // For better reliability, consider using a paid RPC like:
  // 'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
  // 'https://rpc.helius.xyz/?api-key=YOUR_API_KEY'
};

async function updateTokenMetadata() {
  console.log('🚀 Starting Terrain Token Metadata Update...\n');
  
  try {
    // Step 1: Initialize UMI
    console.log('📡 Connecting to Solana mainnet...');
    const umi = createUmi(CONFIG.RPC_ENDPOINT);
    
    // Step 2: Load Metaplex Token Metadata Program
    umi.use(mplTokenMetadata());
    
    // Step 3: Set up signer (update authority)
    // IMPORTANT: Replace this with your actual wallet loading mechanism
    // Option A: From environment variable
    // const walletKeypair = umi.eddsa.createKeypairFromSecretKey(
    //   new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY!))
    // );
    
    // Option B: From file (Solana CLI wallet)
    // import fs from 'fs';
    // const walletKeypair = umi.eddsa.createKeypairFromSecretKey(
    //   new Uint8Array(JSON.parse(fs.readFileSync('/path/to/wallet.json', 'utf-8')))
    // );
    
    console.log('⚠️  WARNING: Signer setup not implemented!');
    console.log('Please uncomment and configure wallet loading in the script.\n');
    
    // For testing/demonstration - DO NOT USE IN PRODUCTION
    const updateAuthority = generateSigner(umi);
    const signer = createSignerFromKeypair(umi, updateAuthority);
    umi.use(signerIdentity(signer));
    
    console.log(`🔑 Update Authority: ${signer.publicKey}`);
    
    // Step 4: Find metadata PDA
    console.log('\n🔍 Finding metadata account...');
    const mint = publicKey(CONFIG.MINT_ADDRESS);
    const metadataPda = findMetadataPda(umi, { mint });
    
    console.log(`📋 Metadata PDA: ${metadataPda[0]}`);
    
    // Step 5: Update metadata
    console.log('\n📝 Updating metadata...');
    console.log(`   Name: ${CONFIG.TOKEN_NAME}`);
    console.log(`   Symbol: ${CONFIG.TOKEN_SYMBOL}`);
    console.log(`   URI: ${CONFIG.METADATA_URI}`);
    
    const tx = await updateV1(umi, {
      mint,
      authority: signer,
      data: {
        name: CONFIG.TOKEN_NAME,
        symbol: CONFIG.TOKEN_SYMBOL,
        uri: CONFIG.METADATA_URI,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
    }).sendAndConfirm(umi);
    
    console.log('\n✅ Metadata updated successfully!');
    console.log(`🔗 Transaction signature: ${tx.signature}`);
    console.log(`\n🔍 View on Solscan:`);
    console.log(`   https://solscan.io/tx/${tx.signature}`);
    console.log(`   https://solscan.io/token/${CONFIG.MINT_ADDRESS}#metadata`);
    
    console.log('\n📊 Next Steps:');
    console.log('   1. Verify metadata on Solscan');
    console.log('   2. Check token-metadata.json is accessible');
    console.log('   3. Test in Phantom wallet (may take 1-6 hours to refresh)');
    console.log('   4. Monitor coin trackers (may take 24-48 hours)');
    
  } catch (error) {
    console.error('\n❌ Error updating metadata:');
    console.error(error);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Ensure you have the update authority wallet');
    console.log('   - Check you have sufficient SOL for transaction fees');
    console.log('   - Verify the mint address is correct');
    console.log('   - Confirm metadata URI is publicly accessible');
    console.log('   - Try using a different RPC endpoint if timeout occurs');
    
    process.exit(1);
  }
}

// Verification function to check current metadata
async function verifyMetadata() {
  console.log('🔍 Verifying current metadata...\n');
  
  try {
    const umi = createUmi(CONFIG.RPC_ENDPOINT);
    umi.use(mplTokenMetadata());
    
    const mint = publicKey(CONFIG.MINT_ADDRESS);
    const metadataPda = findMetadataPda(umi, { mint });
    
    console.log(`Metadata PDA: ${metadataPda[0]}`);
    console.log('\nTo view current metadata, visit:');
    console.log(`https://solscan.io/token/${CONFIG.MINT_ADDRESS}#metadata`);
    
  } catch (error) {
    console.error('Error verifying metadata:', error);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--verify')) {
  verifyMetadata();
} else if (args.includes('--help')) {
  console.log(`
Terrain Token Metadata Update Script

Usage:
  ts-node scripts/update-token-metadata.ts          Update metadata
  ts-node scripts/update-token-metadata.ts --verify  Verify current metadata
  ts-node scripts/update-token-metadata.ts --help    Show this help

Before running:
1. Install dependencies:
   npm install @metaplex-foundation/mpl-token-metadata@3 @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults

2. Configure your wallet in the script (search for "IMPORTANT")

3. Ensure you have ~0.01 SOL for transaction fees

4. Verify token-metadata.json is accessible at:
   ${CONFIG.METADATA_URI}
  `);
} else {
  updateTokenMetadata();
}
