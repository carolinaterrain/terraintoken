// Token Airdrop Constants for $TRN

// Admin wallet authorized to execute airdrops
export const ADMIN_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";

// TRN Token Mint Address (Token-2022)
export const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

// Token-2022 Program ID
export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

// Batch size for transfers (Solana tx size limits)
export const BATCH_SIZE = 10;

// Token decimals for TRN
export const TRN_DECIMALS = 6;

// ===== SAFETY FILTER: Blocked Addresses =====
// These addresses should NEVER receive airdrops

export const BLOCKED_ADDRESSES = new Set([
  // Pump.fun Bonding Curve (Liquidity Pool)
  "7XGAV46ChZ3n5hhMKYgr9gqNy3YeRKHeaoy54YXy6HNG",
  
  // Solana System Programs
  "11111111111111111111111111111111",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  
  // Raydium AMM
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
  
  // Orca Whirlpool
  "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
  
  // Metaplex
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  
  // Jupiter Aggregator
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  
  // Serum DEX
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
  
  // Known burn addresses
  "1nc1nerator11111111111111111111111111111111",
]);

// Check if an address is safe for airdrop
export function isSafeAddress(address: string): boolean {
  // Block known unsafe addresses
  if (BLOCKED_ADDRESSES.has(address)) {
    return false;
  }
  
  // Block if address is the admin wallet (don't airdrop to self)
  if (address === ADMIN_WALLET) {
    return false;
  }
  
  // Block addresses that look like program IDs (end with many 1s)
  if (address.endsWith("11111111")) {
    return false;
  }
  
  return true;
}
