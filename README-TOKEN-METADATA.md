# Terrain Token (TRN) - Metadata Implementation Guide

## Overview

This document explains how to update the on-chain metadata for Terrain Token (TRN) on Solana using the Metaplex Token Metadata Program.

## Token Information

- **Token Name**: Terrain Token
- **Symbol**: TRN
- **Contract Address**: `2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump`
- **Blockchain**: Solana
- **Standard**: SPL Token with Metaplex Metadata

## Files Created

1. **`public/token-metadata.json`** - Off-chain metadata JSON with token details, social links, and images
2. **`public/trn-coin.png`** - Token logo (512x512px)
3. **`scripts/update-token-metadata.ts`** - TypeScript script to update on-chain metadata
4. **`src/pages/TokenMetadata.tsx`** - Public documentation page explaining metadata

## Quick Start

### Prerequisites

1. **Install Dependencies**:
```bash
npm install @metaplex-foundation/mpl-token-metadata@3 @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

2. **Wallet Access**:
   - You need the private key of the wallet that has update authority for the token
   - Ensure wallet has ~0.01 SOL for transaction fees

3. **Verify Metadata JSON is Accessible**:
```bash
curl https://terrainvision-ai.com/token-metadata.json
```

### Update Metadata

1. **Configure Wallet** in `scripts/update-token-metadata.ts`:

```typescript
// Option A: From environment variable
const walletKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY!))
);

// Option B: From Solana CLI wallet file
import fs from 'fs';
const walletKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync('/path/to/wallet.json', 'utf-8')))
);
```

2. **Run Update Script**:
```bash
npx tsx scripts/update-token-metadata.ts
```

3. **Verify Update**:
```bash
npx tsx scripts/update-token-metadata.ts --verify
```

Or visit: https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump#metadata

## Metadata JSON Structure

The `token-metadata.json` includes:

```json
{
  "name": "Terrain Token",
  "symbol": "TRN",
  "description": "...",
  "image": "https://terrainvision-ai.com/trn-coin.png",
  "external_url": "https://terrainvision-ai.com/",
  "extensions": {
    "website": "...",
    "twitter": "https://x.com/carolinaterrain",
    "x": "https://x.com/carolinaterrain",
    "telegram": "https://t.me/terraintoken",
    "discord": "https://discord.gg/terraintoken",
    "whitepaper": "...",
    "docs": "...",
    "contact": "..."
  },
  "tags": [...],
  "creator": {...}
}
```

### Why Both `twitter` and `x`?

Different platforms read different fields:
- Some trackers still use `twitter`
- Newer platforms may use `x`
- Including both ensures maximum compatibility

## Hosting Options

### Current: Website Hosting (Easiest)
- **URI**: `https://terrainvision-ai.com/token-metadata.json`
- **Pros**: Easy to update, you control it
- **Cons**: Centralized, depends on website hosting

### Future: IPFS (Recommended for Permanence)
```bash
# Upload to IPFS via Pinata/NFT.Storage
ipfs://QmYourHashHere

# Use gateway URL in metadata:
https://gateway.pinata.cloud/ipfs/QmYourHashHere
```

### Alternative: Arweave (Most Professional)
- Upload to Arweave for permanent, decentralized storage
- Pay once (~$0.01-0.10), store forever
- No ongoing costs or maintenance

## Verification Checklist

After updating metadata:

- [ ] Verify on Solscan: https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump#metadata
- [ ] Check metadata JSON is accessible: https://terrainvision-ai.com/token-metadata.json
- [ ] Test in Phantom wallet (may take 1-6 hours to refresh)
- [ ] Check token logo displays in wallet
- [ ] Verify social links in metadata
- [ ] Monitor coin trackers (DexScreener, Birdeye) - may take 24-48 hours

## Coin Tracker Integration Timeline

After metadata update:

| Platform | Update Time |
|----------|-------------|
| Solscan | Immediate |
| Solana Explorer | Immediate |
| Phantom Wallet | 1-6 hours |
| DexScreener | 24-48 hours |
| Birdeye | 24-48 hours |
| Jupiter | 24-48 hours |

**Note**: Coin trackers cache heavily. If they don't update automatically, you may need to request a manual update through their support.

## Important Security Considerations

1. **Update Authority**:
   - Only the update authority wallet can modify metadata
   - Keep private keys secure and never share them
   - Consider using a hardware wallet for update authority

2. **Immutability**:
   - Set `isMutable: true` if you want ability to update later
   - Set `isMutable: false` for permanent, unchangeable metadata
   - **Current Setting**: Mutable (allows updates)

3. **URI Security**:
   - Use HTTPS (not HTTP)
   - Ensure JSON file has proper CORS headers
   - Test accessibility from multiple locations
   - Consider CDN for better performance

4. **Backup**:
   - Keep backup of metadata JSON
   - Store original images/assets
   - Document update authority wallet details (securely)

## Troubleshooting

### "Insufficient Funds" Error
- Ensure wallet has at least 0.01 SOL for transaction fees

### "Unauthorized" Error
- Verify you're using the wallet that has update authority
- Check wallet is properly loaded in the script

### "RPC Timeout" Error
- Try a different RPC endpoint (see script comments)
- Consider using paid RPC like Helius or Alchemy

### Metadata Not Showing in Wallet
- Wait 1-6 hours for wallet to refresh metadata
- Try clearing wallet cache or reinstalling
- Verify metadata JSON is publicly accessible

### Coin Trackers Not Updated
- Wait 24-48 hours for cache to clear
- Request manual update through platform support
- Verify metadata URI is correct on Solscan

## Support & Resources

- **Metaplex Documentation**: https://developers.metaplex.com/token-metadata
- **Solana Token Extensions**: https://solana.com/docs/tokens/extensions/metadata
- **Token Metadata Page**: https://terrainvision-ai.com/token-metadata
- **Solscan**: https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump

## Contact

For questions about TRN token metadata:
- Email: info@carolinaterrain.com
- Twitter: https://x.com/carolinaterrain
- Telegram: https://t.me/terraintoken

---

**Last Updated**: 2025-01-21
**Status**: Ready for implementation
