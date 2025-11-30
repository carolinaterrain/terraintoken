/**
 * Shared Solana RPC endpoint configuration
 * Use Helius if API key available, otherwise fall back to Ankr
 */

// RPC endpoints in order of preference
const RPC_ENDPOINTS = {
  // Helius (if API key available via env)
  helius: (apiKey: string) => `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
  // Reliable public alternatives
  ankr: 'https://rpc.ankr.com/solana',
  // Official Solana (often rate-limited)
  official: 'https://api.mainnet-beta.solana.com',
};

/**
 * Get the best available Solana RPC endpoint
 * Prefers Helius if API key is available, otherwise uses Ankr
 */
export function getSolanaRpcEndpoint(): string {
  // Check for Helius API key (most reliable)
  const heliusKey = import.meta.env.VITE_HELIUS_API_KEY;
  if (heliusKey) {
    return RPC_ENDPOINTS.helius(heliusKey);
  }
  
  // Use Ankr as reliable free alternative (less rate-limiting than official)
  return RPC_ENDPOINTS.ankr;
}

export { RPC_ENDPOINTS };
