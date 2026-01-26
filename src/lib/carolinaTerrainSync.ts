/**
 * Carolina Terrain Sync Utility Library
 * Handles data synchronization between Carolina Terrain and Terrain Token apps
 */

import { supabase } from "@/integrations/supabase/client";
import { TRN_MINT_ADDRESS, ADMIN_WALLET, TRN_DECIMALS, TRN_APY_RATE } from "@/lib/airdropConstants";

// Re-export for backwards compatibility
export { TRN_MINT_ADDRESS, TRN_DECIMALS, TRN_APY_RATE };
export const TRN_TREASURY_WALLET = ADMIN_WALLET;
export const MAX_SUPPLY = 1_000_000_000;

// Fee Allocation Model
export const FEE_ALLOCATION = {
  BURN: 0.05,        // 5% - Deflationary burn
  FOUNDATION: 0.02,  // 2% - Community foundation
  REWARDS: 0.03,     // 3% - User rewards pool
  TREASURY: 0.90     // 90% - Operations treasury
} as const;

// Reward Amounts
export const REWARDS = {
  BASE_UPLOAD: 10,
  DATA_CONSENT: 50,
  VALIDATION_FEEDBACK: 25,
  SOCIAL_SHARE: 15,
  STREAK_BONUS_PER_DAY: 5,
  MAX_STREAK_BONUS: 25,
} as const;

// Types
export interface LiveStats {
  price_usd: number;
  price_sol: number;
  price_change_24h: number;
  market_cap_usd: number;
  current_supply: number;
  max_supply: number;
  total_burned: number;
  volume_24h_usd: number;
  liquidity_usd: number;
  active_users: number;
  data_source: string;
  last_updated: string;
}

export interface RewardStats {
  total_rewards_issued: number;
  total_rewards_count: number;
  pending_claims: number;
  claimed_rewards: number;
  unique_earners: number;
  rewards_by_type: Record<string, number>;
}

export interface TreasuryData {
  current_balance: number;
  total_income: number;
  total_expenses: number;
  recent_transactions: Array<{
    type: string;
    amount: number;
    description: string;
    tx_signature: string | null;
    solscan_url: string | null;
    timestamp: string;
  }>;
  last_updated: string;
}

export interface FoundationData {
  total_allocated: number;
  pending_disbursements: number;
  grant_stats: {
    total_proposals: number;
    approved: number;
    funded: number;
    pending: number;
    completed: number;
  };
  recent_grants: Array<{
    title: string;
    recipient_type: string;
    amount: number;
    status: string;
  }>;
}

export interface RewardsPoolData {
  current_balance: number;
  total_deposited: number;
  total_distributed: number;
  last_updated: string;
}

export interface BurnData {
  total_burned: number;
  burn_count: number;
  pending_burns: number;
  burn_velocity_24h: number;
  burns_by_type: Record<string, number>;
  recent_burns: Array<{
    amount: number;
    burn_type: string;
    tx_signature: string;
    solscan_url: string;
    confirmed_at: string;
  }>;
}

export interface SyncResponse {
  success: boolean;
  timestamp: string;
  mode: string;
  source?: string;
  fallback?: boolean;
  error?: string;
  data: {
    liveStats?: LiveStats;
    rewardStats?: RewardStats;
    treasury?: TreasuryData;
    foundation?: FoundationData;
    rewardsPool?: RewardsPoolData;
    burns?: BurnData;
  };
}

export type SyncMode = 'stats' | 'rewards' | 'treasury' | 'burns' | 'full';

/**
 * Fetch ecosystem stats from the edge function
 */
export async function syncFromCarolinaTerrain(
  mode: SyncMode = 'full'
): Promise<SyncResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-ecosystem-stats', {
      body: null,
      headers: {},
    });

    // The function uses query params, so we need to call it differently
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-ecosystem-stats?mode=${mode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Carolina Terrain sync error:', error);
    
    // Return fallback structure
    return {
      success: false,
      timestamp: new Date().toISOString(),
      mode,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {},
    };
  }
}

/**
 * Format wallet address for display
 */
export function formatWalletAddress(
  address: string,
  prefixLength = 4,
  suffixLength = 4
): string {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address || '';
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Validate Solana wallet address
 */
export interface WalletValidationResult {
  isValid: boolean;
  error?: string;
}

const SOLANA_ADDRESS_LENGTHS = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;

export function validateSolanaAddress(address: string): WalletValidationResult {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Wallet address is required' };
  }

  const trimmedAddress = address.trim();

  if (!SOLANA_ADDRESS_LENGTHS.includes(trimmedAddress.length)) {
    return {
      isValid: false,
      error: `Invalid length. Solana addresses are typically 32-44 characters (got ${trimmedAddress.length})`
    };
  }

  if (!BASE58_REGEX.test(trimmedAddress)) {
    return {
      isValid: false,
      error: 'Invalid format. Solana addresses use Base58 encoding (no 0, O, I, or l)'
    };
  }

  if (trimmedAddress.startsWith('0x')) {
    return {
      isValid: false,
      error: 'This looks like an Ethereum address. Please use your Solana wallet address'
    };
  }

  return { isValid: true };
}

/**
 * Format TRN amount with proper decimals
 */
export function formatTRN(amount: number, decimals = 2): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(decimals)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(decimals)}K`;
  }
  return amount.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

/**
 * Format USD amount
 */
export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(2)}K`;
  }
  if (amount < 0.01) {
    return `$${amount.toFixed(6)}`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Get Solscan URL for a transaction
 */
export function getSolscanTxUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}`;
}

/**
 * Get Solscan URL for a token
 */
export function getSolscanTokenUrl(): string {
  return `https://solscan.io/token/${TRN_MINT_ADDRESS}`;
}

/**
 * Get Solscan URL for a wallet
 */
export function getSolscanWalletUrl(address: string): string {
  return `https://solscan.io/account/${address}`;
}

/**
 * Get Solscan URL for the TRN Treasury wallet
 */
export function getSolscanTreasuryUrl(): string {
  return `https://solscan.io/account/${TRN_TREASURY_WALLET}`;
}

/**
 * Calculate supply percentage
 */
export function calculateSupplyPercentage(amount: number, total = MAX_SUPPLY): number {
  return (amount / total) * 100;
}

/**
 * Calculate burn rate (daily average)
 */
export function calculateBurnRate(totalBurned: number, daysSinceLaunch: number): number {
  if (daysSinceLaunch <= 0) return 0;
  return totalBurned / daysSinceLaunch;
}

// Burn Sources
export type BurnSource = 
  | 'marketplace_fee'
  | 'energy_purchase'
  | 'prediction_stake'
  | 'gamification'
  | 'mystery_box'
  | 'season_pass'
  | 'manual';

export interface BurnResult {
  success: boolean;
  burnId?: string;
  amount?: number;
  error?: string;
}

/**
 * Record a TRN burn event to Supabase
 * This function records burns for tracking - actual on-chain burns happen separately
 */
export async function burnTRN(
  amount: number,
  burnSource: BurnSource,
  userWallet: string,
  metadata?: Record<string, unknown>
): Promise<BurnResult> {
  console.log('[burnTRN] === START BURN RECORD ===');
  console.log('[burnTRN] Amount:', amount);
  console.log('[burnTRN] Source:', burnSource);
  console.log('[burnTRN] Wallet:', userWallet);
  
  // Validation
  if (!amount || amount <= 0) {
    console.error('[burnTRN] Invalid amount:', amount);
    return { success: false, error: 'Invalid burn amount' };
  }
  
  if (!userWallet || userWallet.trim() === '') {
    console.error('[burnTRN] Missing wallet address');
    return { success: false, error: 'User wallet address is required' };
  }
  
  const validation = validateSolanaAddress(userWallet);
  if (!validation.isValid) {
    console.error('[burnTRN] Invalid wallet:', validation.error);
    return { success: false, error: validation.error };
  }
  
  try {
    const burnRecord = {
      burn_amount: amount,
      burn_source: burnSource,
      user_wallet: userWallet,
      transaction_signature: 'pending_verification',
      metadata: {
        ...metadata,
        recorded_at: new Date().toISOString(),
        source: 'frontend_burnTRN'
      }
    };
    
    console.log('[burnTRN] Inserting record:', JSON.stringify(burnRecord));
    
    const { data, error } = await supabase
      .from('token_burns')
      .insert(burnRecord)
      .select()
      .single();
    
    if (error) {
      console.error('[burnTRN] Insert FAILED:', error);
      return { success: false, error: error.message };
    }
    
    console.log('[burnTRN] Insert SUCCESS:', data);
    console.log('[burnTRN] === END BURN RECORD ===');
    
    return {
      success: true,
      burnId: data.id,
      amount: data.burn_amount
    };
  } catch (error) {
    console.error('[burnTRN] EXCEPTION:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get total burned amount from database
 */
/**
 * Get total burned amount from database (REAL burns only, excludes test data)
 */
export async function getTotalBurned(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('token_burns')
      .select('burn_amount, is_test_data')
      .eq('is_test_data', false); // Only count REAL burns
    
    if (error) {
      console.error('[getTotalBurned] Error:', error);
      return 0;
    }
    
    return data?.reduce((sum, burn) => sum + (burn.burn_amount || 0), 0) || 0;
  } catch (error) {
    console.error('[getTotalBurned] Exception:', error);
    return 0;
  }
}

/**
 * Refresh holder distribution cache by calling the edge function
 */
export async function refreshHolderDistribution(): Promise<boolean> {
  console.log('[refreshHolderDistribution] Triggering cache refresh...');
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-holder-data', {
      body: { forceRefresh: true }
    });
    
    if (error) {
      console.error('[refreshHolderDistribution] Error:', error);
      return false;
    }
    
    console.log('[refreshHolderDistribution] Success:', data);
    return true;
  } catch (error) {
    console.error('[refreshHolderDistribution] Exception:', error);
    return false;
  }
}
