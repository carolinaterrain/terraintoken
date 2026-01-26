// Helius API integration for Supabase Edge Functions
// This file is meant to be imported only in edge functions where Deno is available
// NOTE: This is a legacy file - prefer using the fetch-holder-data edge function directly

// Token-2022 with Interest-Bearing Extension
const TRN_MINT_ADDRESS = "Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m";

export interface HolderData {
  address: string;
  balance: number;
  percentage: number;
}

export interface HolderDistribution {
  totalHolders: number;
  tiers: {
    shrimp: number;    // < 10K TRN
    crab: number;      // 10K - 100K TRN
    fish: number;      // 100K - 500K TRN
    dolphin: number;   // 500K - 1M TRN
    shark: number;     // 1M - 5M TRN
    whale: number;     // 5M - 10M TRN
    humpback: number;  // > 10M TRN
  };
  top10Percentage: number;
}

export async function fetchHolderData(apiKey: string): Promise<HolderDistribution> {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/holders`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    const holders = data.result || [];

    // Calculate total supply
    const totalSupply = holders.reduce((sum: number, h: any) => sum + h.amount, 0);

    // Categorize holders into tiers
    const tiers = {
      shrimp: 0,
      crab: 0,
      fish: 0,
      dolphin: 0,
      shark: 0,
      whale: 0,
      humpback: 0,
    };

    holders.forEach((holder: any) => {
      const balance = holder.amount;
      if (balance < 10000) tiers.shrimp++;
      else if (balance < 100000) tiers.crab++;
      else if (balance < 500000) tiers.fish++;
      else if (balance < 1000000) tiers.dolphin++;
      else if (balance < 5000000) tiers.shark++;
      else if (balance < 10000000) tiers.whale++;
      else tiers.humpback++;
    });

    // Calculate top 10 holders percentage
    const sortedHolders = [...holders].sort((a: any, b: any) => b.amount - a.amount);
    const top10Sum = sortedHolders.slice(0, 10).reduce((sum: number, h: any) => sum + h.amount, 0);
    const top10Percentage = totalSupply > 0 ? (top10Sum / totalSupply) * 100 : 0;

    return {
      totalHolders: holders.length,
      tiers,
      top10Percentage,
    };
  } catch (error) {
    console.error('Error fetching holder data from Helius:', error);
    // Return zero state - no fake data
    return {
      totalHolders: 0,
      tiers: {
        shrimp: 0,
        crab: 0,
        fish: 0,
        dolphin: 0,
        shark: 0,
        whale: 0,
        humpback: 0,
      },
      top10Percentage: 0,
    };
  }
}

export async function verifyTRNPurchase(
  apiKey: string,
  walletAddress: string, 
  minAmount: number = 100000
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${apiKey}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const transactions = await response.json();

    // Look for TRN token transfers to this wallet
    for (const tx of transactions) {
      const tokenTransfers = tx.tokenTransfers || [];
      for (const transfer of tokenTransfers) {
        if (
          transfer.mint === TRN_MINT_ADDRESS &&
          transfer.toUserAccount === walletAddress &&
          transfer.tokenAmount >= minAmount
        ) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error verifying TRN purchase:', error);
    return false;
  }
}
