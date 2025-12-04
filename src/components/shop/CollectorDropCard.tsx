import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, Lock, ShoppingCart, Loader2, Heart } from 'lucide-react';
import { useCollectorDrop } from '@/hooks/useCollectorDrop';
import { WalletCollectionModal } from './WalletCollectionModal';
import { useCartStore } from '@/stores/cartStore';
import { useProductImages } from '@/hooks/useProductImages';
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
  const { primaryImage } = useProductImages(itemType);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const displayPrice = itemPrice || drop?.price_usd || 100;
  const totalSupply = drop?.total_supply || 50;

  // Dynamic supply state
  const getSupplyState = () => {
    if (isSoldOut) return 'soldOut';
    if (remaining <= 10) return 'critical';
    if (remaining <= 25) return 'low';
    return 'available';
  };

  const supplyState = getSupplyState();

  const supplyStyles = {
    available: {
      bg: 'bg-primary/90',
      text: 'text-primary-foreground',
      label: `${remaining}/${totalSupply} Remaining`,
      pulse: false,
    },
    low: {
      bg: 'bg-amber-500/90',
      text: 'text-black',
      label: `${remaining}/${totalSupply} — Going Fast`,
      pulse: false,
    },
    critical: {
      bg: 'bg-destructive',
      text: 'text-destructive-foreground',
      label: `Only ${remaining} Left — Selling Fast!`,
      pulse: true,
    },
    soldOut: {
      bg: 'bg-destructive',
      text: 'text-destructive-foreground',
      label: 'SOLD OUT',
      pulse: false,
    },
  };

  const currentStyle = supplyStyles[supplyState];

  const handleBuyClick = () => {
    if (isSoldOut) return;
    setShowWalletModal(true);
  };

  const handleWalletSubmit = async (walletAddress: string, certificateId: string, serialNumber: number) => {
    setIsReserving(true);
    try {
      localStorage.setItem('collector_wallet', walletAddress);
      localStorage.setItem('collector_certificate_id', certificateId);
      localStorage.setItem('collector_serial', serialNumber.toString());

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
                  url: primaryImage,
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
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-2 border-primary/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_40px_hsl(142_76%_39%/0.2)] transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-primary/20 via-card to-terrain-purple/10 p-8">
          <motion.img
            src={primaryImage}
            alt="TRN Collector Edition #0"
            className="w-full h-full object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Badges with shimmer */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="bg-primary text-primary-foreground animate-glow-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              Limited Edition
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-primary/40">
              <Award className="w-3 h-3 mr-1" />
              NFT Included
            </Badge>
          </div>

          {/* Dynamic Supply Counter */}
          <div className="absolute bottom-4 right-4">
            <motion.div 
              animate={currentStyle.pulse ? { scale: [1, 1.05, 1] } : {}}
              transition={currentStyle.pulse ? { duration: 1.5, repeat: Infinity } : {}}
              className={`px-4 py-2 rounded-full font-bold text-sm ${currentStyle.bg} ${currentStyle.text} ${
                currentStyle.pulse ? 'shadow-[0_0_20px_hsl(0_84%_60%/0.5)]' : ''
              }`}
            >
              {isSoldOut ? (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  SOLD OUT
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {supplyState === 'critical' && <span className="animate-pulse">🔥</span>}
                  {currentStyle.label}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{itemName}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Premium Collector Item + 1/1 NFT Certificate
            </p>
          </div>

          {/* Enhanced Price Display */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">${displayPrice}</span>
              <span className="text-muted-foreground text-sm">USD</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Includes physical item + on-chain NFT certificate
            </p>
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

          {/* Community Support Line */}
          <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/5 px-3 py-2 rounded-lg">
            <Heart className="w-3 h-3" />
            <span>A portion supports future community events & giveaways</span>
          </div>

          <Button
            onClick={handleBuyClick}
            disabled={isSoldOut || isReserving}
            className="w-full group"
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
                <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
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
