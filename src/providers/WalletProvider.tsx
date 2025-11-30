import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface Props {
  children: ReactNode;
}

// RPC endpoints in order of preference
const RPC_ENDPOINTS = {
  // Helius (if API key available via env)
  helius: (apiKey: string) => `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
  // Reliable public alternatives
  ankr: 'https://rpc.ankr.com/solana',
  // Official Solana (often rate-limited)
  official: 'https://api.mainnet-beta.solana.com',
};

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  
  // Select best available RPC endpoint
  const endpoint = useMemo(() => {
    // Check for Helius API key (most reliable)
    const heliusKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (heliusKey) {
      return RPC_ENDPOINTS.helius(heliusKey);
    }
    
    // Use Ankr as reliable free alternative (less rate-limiting than official)
    return RPC_ENDPOINTS.ankr;
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
