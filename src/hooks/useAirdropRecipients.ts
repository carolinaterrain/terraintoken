import { useState, useEffect, useMemo } from "react";
import { isSafeAddress, ADMIN_WALLET } from "@/lib/airdropConstants";
import airdropCSV from "@/data/trn_airdrop_list.csv?raw";

export interface AirdropRecipient {
  address: string;
  tokenAccount: string;
  quantity: number;
  percentage: number;
  isSafe: boolean;
  filterReason?: string;
}

export interface AirdropStats {
  total: number;
  safe: number;
  filtered: number;
  totalTokens: number;
  safeTokens: number;
}

export function useAirdropRecipients() {
  const [recipients, setRecipients] = useState<AirdropRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function parseCSV() {
      try {
        setLoading(true);
        const text = airdropCSV;
        const lines = text.trim().split("\n");
        const parsed: AirdropRecipient[] = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const [address, tokenAccount, quantityStr, percentageStr] = line.split(",");
          
          if (!address || !tokenAccount) continue;

          const quantity = parseFloat(quantityStr) || 0;
          const percentage = parseFloat(percentageStr) || 0;

          // Skip dust amounts
          if (quantity < 1) continue;

          let isSafe = true;
          let filterReason: string | undefined;

          if (!isSafeAddress(address)) {
            isSafe = false;
            if (address === "7XGAV46ChZ3n5hhMKYgr9gqNy3YeRKHeaoy54YXy6HNG") {
              filterReason = "Pump.fun Bonding Curve (Liquidity Pool)";
            } else if (address === ADMIN_WALLET) {
              filterReason = "Admin Wallet (Self)";
            } else {
              filterReason = "System Program or Known DEX";
            }
          }

          parsed.push({
            address,
            tokenAccount,
            quantity,
            percentage,
            isSafe,
            filterReason,
          });
        }

        setRecipients(parsed);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError(err instanceof Error ? err.message : "Failed to parse recipients");
      } finally {
        setLoading(false);
      }
    }

    parseCSV();
  }, []);

  const stats = useMemo<AirdropStats>(() => {
    const safe = recipients.filter(r => r.isSafe);
    return {
      total: recipients.length,
      safe: safe.length,
      filtered: recipients.length - safe.length,
      totalTokens: recipients.reduce((sum, r) => sum + r.quantity, 0),
      safeTokens: safe.reduce((sum, r) => sum + r.quantity, 0),
    };
  }, [recipients]);

  const safeRecipients = useMemo(() => 
    recipients.filter(r => r.isSafe), 
    [recipients]
  );

  const filteredRecipients = useMemo(() => 
    recipients.filter(r => !r.isSafe), 
    [recipients]
  );

  return {
    recipients,
    safeRecipients,
    filteredRecipients,
    stats,
    loading,
    error,
  };
}
