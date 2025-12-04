import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (walletAddress: string | null, certificateId: string, serialNumber: number) => void;
  dropId: string;
}

export function WalletCollectionModal({ open, onOpenChange, onSubmit, dropId }: WalletCollectionModalProps) {
  const { publicKey, connected } = useWallet();
  const [manualWallet, setManualWallet] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = connected && publicKey ? publicKey.toBase58() : manualWallet;
  const isValidWallet = walletAddress.length >= 32 && walletAddress.length <= 44;
  const hasWalletInput = walletAddress.length > 0;

  const handleReserve = async (skipWallet: boolean = false) => {
    if (!skipWallet && hasWalletInput && !isValidWallet) {
      setError('Please enter a valid Solana wallet address');
      return;
    }

    setIsReserving(true);
    setError(null);

    try {
      // Generate a session ID for this reservation
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Reserve the next available certificate
      const { data, error: rpcError } = await supabase.rpc('reserve_next_certificate', {
        p_drop_id: dropId,
        p_session_id: sessionId
      });

      if (rpcError) throw rpcError;

      if (!data || data.length === 0 || !data[0].certificate_id) {
        throw new Error('No certificates available');
      }

      const { certificate_id, serial_number } = data[0];

      // Store the session ID for later checkout matching
      localStorage.setItem('collector_session_id', sessionId);

      // Pass wallet address or null if skipped
      const finalWallet = skipWallet ? null : (isValidWallet ? walletAddress : null);
      onSubmit(finalWallet, certificate_id, serial_number);
    } catch (err) {
      console.error('Error reserving certificate:', err);
      setError(err instanceof Error ? err.message : 'Failed to reserve certificate');
      toast.error('Failed to reserve certificate. Please try again.');
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Your NFT certificate will be sent to this Solana wallet address after purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Option 1: Connect Wallet */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Option 1: Connect Wallet</Label>
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-md !h-10 !px-4 !text-sm" />
            </div>
            {connected && publicKey && (
              <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/30">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-mono truncate">{publicKey.toBase58()}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Option 2: Manual Entry */}
          <div className="space-y-3">
            <Label htmlFor="wallet" className="text-sm font-medium">
              Option 2: Enter Wallet Address
            </Label>
            <Input
              id="wallet"
              placeholder="Your Solana wallet address..."
              value={manualWallet}
              onChange={(e) => {
                setManualWallet(e.target.value);
                setError(null);
              }}
              disabled={connected}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Providing your wallet lets us send your NFT certificate (#X/50) after order fulfillment. 
              You can also provide it later via email.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleReserve(false)}
              disabled={!isValidWallet || isReserving}
              className="w-full"
              size="lg"
            >
              {isReserving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reserving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Reserve with Wallet
                </>
              )}
            </Button>
            
            <Button
              onClick={() => handleReserve(true)}
              disabled={isReserving}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isReserving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reserving...
                </>
              ) : (
                'Skip & Continue to Checkout'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
