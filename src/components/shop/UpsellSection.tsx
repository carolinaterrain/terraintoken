import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Gift } from 'lucide-react';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { toast } from 'sonner';

interface UpsellSectionProps {
  cartItems: CartItem[];
}

interface UpsellItem {
  product: ShopifyProduct;
  reason: string;
  discount?: string;
}

export function UpsellSection({ cartItems }: UpsellSectionProps) {
  const [upsells, setUpsells] = useState<UpsellItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    loadUpsells();
  }, [cartItems]);

  const loadUpsells = async () => {
    setIsLoading(true);
    try {
      const allProducts = await fetchProducts(50);
      const suggestions = generateUpsells(allProducts, cartItems);
      setUpsells(suggestions.slice(0, 3)); // Max 3 upsells
    } catch (error) {
      console.error('Error loading upsells:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateUpsells = (products: ShopifyProduct[], cart: CartItem[]): UpsellItem[] => {
    const cartVariantIds = cart.map(item => item.variantId);
    const cartTags = cart.flatMap(item => 
      item.product.node.tags?.split(',').map(t => t.trim().toLowerCase()) || []
    );

    const suggestions: UpsellItem[] = [];

    // Check if cart has digital NFT
    const hasDigitalNFT = cart.some(item => 
      item.product.node.title.toLowerCase().includes('supporter') &&
      item.product.node.title.toLowerCase().includes('nft')
    );

    // Check if cart has collector items
    const hasCollectorItem = cartTags.some(tag => 
      tag.includes('collector') || tag.includes('limited-edition')
    );

    // Check if cart has stickers
    const hasStickers = cart.some(item => 
      item.product.node.title.toLowerCase().includes('sticker')
    );

    for (const product of products) {
      const variant = product.node.variants.edges[0]?.node;
      if (!variant) continue;
      
      // Skip if already in cart
      if (cartVariantIds.includes(variant.id)) continue;

      // Skip collector items (they need special flow)
      if (product.node.tags?.includes('collector')) continue;

      const title = product.node.title.toLowerCase();
      const tags = product.node.tags?.toLowerCase() || '';

      // Suggest Supporter NFT if not in cart
      if (!hasDigitalNFT && tags.includes('digital') && title.includes('supporter')) {
        suggestions.push({
          product,
          reason: 'Show your support with a digital NFT',
          discount: undefined
        });
        continue;
      }

      // Suggest stickers if has collector item but no stickers
      if (hasCollectorItem && !hasStickers && title.includes('sticker')) {
        suggestions.push({
          product,
          reason: 'Complete your collector set',
          discount: undefined
        });
        continue;
      }

      // Suggest matching apparel
      if (cartTags.some(t => t.includes('apparel')) && tags.includes('apparel')) {
        if (!cart.some(item => item.product.node.title === product.node.title)) {
          suggestions.push({
            product,
            reason: 'Matching TRN apparel',
            discount: undefined
          });
        }
      }

      // Suggest accessories
      if (tags.includes('accessories') && !cartTags.includes('accessories')) {
        suggestions.push({
          product,
          reason: 'Popular add-on',
          discount: undefined
        });
      }
    }

    return suggestions;
  };

  const handleAddUpsell = (upsell: UpsellItem) => {
    const variant = upsell.product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product: upsell.product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });

    toast.success('Added to cart!', {
      description: upsell.product.node.title
    });
  };

  if (isLoading || upsells.length === 0) return null;

  return (
    <div className="space-y-3 py-4 border-t border-border/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Gift className="w-4 h-4" />
        <span>You might also like</span>
      </div>

      <div className="space-y-2">
        {upsells.map((upsell) => {
          const variant = upsell.product.node.variants.edges[0]?.node;
          if (!variant) return null;

          return (
            <div
              key={upsell.product.node.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded bg-background flex-shrink-0 overflow-hidden">
                {upsell.product.node.images.edges[0]?.node ? (
                  <img
                    src={upsell.product.node.images.edges[0].node.url}
                    alt={upsell.product.node.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {upsell.product.node.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {upsell.reason}
                </p>
              </div>

              {/* Price & Add */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-semibold text-primary">
                  +${parseFloat(variant.price.amount).toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => handleAddUpsell(upsell)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
