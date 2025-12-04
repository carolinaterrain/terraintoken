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
  onSubmit: (walletAddress: string, certificateId: string, serialNumber: number) => void;
  dropId: string;
}

export function WalletCollectionModal({ open, onOpenChange, onSubmit, dropId }: WalletCollectionModalProps) {
  const { publicKey, connected } = useWallet();
  const [manualWallet, setManualWallet] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = connected && publicKey ? publicKey.toBase58() : manualWallet;
  const isValidWallet = walletAddress.length >= 32 && walletAddress.length <= 44;

  const handleReserve = async () => {
    if (!isValidWallet) {
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

      onSubmit(walletAddress, certificate_id, serial_number);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Your NFT certificate will be sent to this Solana wallet address after purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Important</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Your NFT certificate (#X/50) will be transferred to this wallet after your order is fulfilled. 
              Make sure this is a wallet you control and can receive Solana NFTs.
            </p>
          </div>

          <Button
            onClick={handleReserve}
            disabled={!isValidWallet || isReserving}
            className="w-full"
            size="lg"
          >
            {isReserving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Reserving Serial Number...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Reserve & Add to Cart
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
