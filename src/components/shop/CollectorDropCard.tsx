import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, Lock, ShoppingCart, Loader2 } from 'lucide-react';
import { useCollectorDrop } from '@/hooks/useCollectorDrop';
import { WalletCollectionModal } from './WalletCollectionModal';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

interface CollectorDropCardProps {
  shopifyProductId: string;
  variantId: string;
  itemType?: 'shirt' | 'hat' | 'bundle';
  itemName?: string;
  itemPrice?: number;
}

export function CollectorDropCard({ shopifyProductId, variantId, itemType = 'shirt', itemName = 'Collector Shirt', itemPrice = 100 }: CollectorDropCardProps) {
  const { drop, remaining, isLoading, isSoldOut } = useCollectorDrop();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const displayPrice = itemPrice || drop?.price_usd || 100;

  const handleBuyClick = () => {
    if (isSoldOut) return;
    setShowWalletModal(true);
  };

  const handleWalletSubmit = async (walletAddress: string, certificateId: string, serialNumber: number) => {
    setIsReserving(true);
    try {
      // Store wallet and certificate info in localStorage for checkout
      localStorage.setItem('collector_wallet', walletAddress);
      localStorage.setItem('collector_certificate_id', certificateId);
      localStorage.setItem('collector_serial', serialNumber.toString());

      // Add to cart with serial info
      addItem({
        product: {
          node: {
            id: `gid://shopify/Product/${shopifyProductId}`,
            title: `TRN ${itemName} #${serialNumber}/50`,
            description: drop?.description || '',
            handle: 'trn-collector-edition-0',
            priceRange: {
              minVariantPrice: {
                amount: displayPrice.toString(),
                currencyCode: 'USD'
              }
            },
            images: {
              edges: [{
                node: {
                  url: '/branding/trn-logo-full.png',
                  altText: 'TRN Collector Edition'
                }
              }]
            },
            variants: {
              edges: [{
                node: {
                  id: variantId,
                  title: 'One Size',
                  price: { amount: displayPrice.toString(), currencyCode: 'USD' },
                  availableForSale: true,
                  selectedOptions: [{ name: 'Size', value: 'One Size' }]
                }
              }]
            },
            options: [{ name: 'Size', values: ['One Size'] }]
          }
        },
        variantId: variantId,
        variantTitle: 'One Size',
        price: { amount: displayPrice.toString(), currencyCode: 'USD' },
        quantity: 1,
        selectedOptions: [
          { name: 'Item', value: itemName },
          { name: 'Serial', value: `#${serialNumber}/50` },
          { name: 'NFT Wallet', value: walletAddress.slice(0, 8) + '...' }
        ]
      });

      toast.success(`Reserved Serial #${serialNumber}/50!`, {
        description: 'NFT certificate will be sent to your wallet after purchase.'
      });
      
      setShowWalletModal(false);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to reserve. Please try again.');
    } finally {
      setIsReserving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-primary/20 rounded-xl p-8 animate-pulse">
        <div className="h-64 bg-muted rounded-lg mb-4" />
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (!drop) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-primary/30 rounded-xl overflow-hidden shadow-xl"
      >
        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-accent/20 p-8">
          <img
            src="/branding/trn-logo-full.png"
            alt="TRN Collector Edition #0"
            className="w-full h-full object-contain"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="bg-primary text-primary-foreground">
              <Sparkles className="w-3 h-3 mr-1" />
              Limited Edition
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              <Award className="w-3 h-3 mr-1" />
              NFT Included
            </Badge>
          </div>

          {/* Supply Counter */}
          <div className="absolute bottom-4 right-4">
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${
              isSoldOut 
                ? 'bg-destructive text-destructive-foreground' 
                : remaining <= 10 
                  ? 'bg-amber-500/90 text-black' 
                  : 'bg-accent/90 text-accent-foreground'
            }`}>
              {isSoldOut ? (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  SOLD OUT
                </span>
              ) : (
                `${remaining}/${drop.total_supply} Remaining`
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{itemName}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Premium item + Unique NFT Certificate
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">${displayPrice}</span>
            <span className="text-muted-foreground text-sm">USD</span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Individually numbered: #1/50 - #50/50</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>1:1 NFT certificate on Solana</span>
            </div>
          </div>

          <Button
            onClick={handleBuyClick}
            disabled={isSoldOut || isReserving}
            className="w-full"
            size="lg"
          >
            {isReserving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Reserving...
              </>
            ) : isSoldOut ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Sold Out
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Reserve Your Serial
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <WalletCollectionModal
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
        onSubmit={handleWalletSubmit}
        dropId={drop.id}
      />
    </>
  );
}
