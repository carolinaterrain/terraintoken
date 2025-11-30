// Shared constants for TRN token across all edge functions
// IMPORTANT: This is the single source of truth for the TRN mint address and wallets

export const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
export const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";

// Whale tiers for purchase tracking
export const WHALE_TIERS = {
  BABY_WHALE: { min: 5_000_000, max: 10_000_000, name: "Baby Whale", emoji: "🐋" },
  WHALE: { min: 10_000_000, max: 25_000_000, name: "Whale", emoji: "🐋" },
  MEGA_WHALE: { min: 25_000_000, max: 50_000_000, name: "Mega Whale", emoji: "🐋" },
  LEVIATHAN: { min: 50_000_000, max: Infinity, name: "Leviathan", emoji: "🐋" },
} as const;

export function getWhaleTier(amount: number) {
  if (amount >= WHALE_TIERS.LEVIATHAN.min) return "LEVIATHAN";
  if (amount >= WHALE_TIERS.MEGA_WHALE.min) return "MEGA_WHALE";
  if (amount >= WHALE_TIERS.WHALE.min) return "WHALE";
  if (amount >= WHALE_TIERS.BABY_WHALE.min) return "BABY_WHALE";
  return null;
}

// Holder distribution tiers
export const HOLDER_TIERS = {
  SHRIMP: { min: 1, max: 100_000, name: "Shrimp", emoji: "🦐" },
  CRAB: { min: 100_000, max: 500_000, name: "Crab", emoji: "🦀" },
  FISH: { min: 500_000, max: 1_000_000, name: "Fish", emoji: "🐟" },
  DOLPHIN: { min: 1_000_000, max: 5_000_000, name: "Dolphin", emoji: "🐬" },
  SHARK: { min: 5_000_000, max: 10_000_000, name: "Shark", emoji: "🦈" },
  WHALE: { min: 10_000_000, max: 50_000_000, name: "Whale", emoji: "🐋" },
  HUMPBACK: { min: 50_000_000, max: Infinity, name: "Humpback", emoji: "🐳" },
} as const;

export function getHolderTier(balance: number) {
  if (balance >= HOLDER_TIERS.HUMPBACK.min) return "HUMPBACK";
  if (balance >= HOLDER_TIERS.WHALE.min) return "WHALE";
  if (balance >= HOLDER_TIERS.SHARK.min) return "SHARK";
  if (balance >= HOLDER_TIERS.DOLPHIN.min) return "DOLPHIN";
  if (balance >= HOLDER_TIERS.FISH.min) return "FISH";
  if (balance >= HOLDER_TIERS.CRAB.min) return "CRAB";
  if (balance >= HOLDER_TIERS.SHRIMP.min) return "SHRIMP";
  return null;
}
