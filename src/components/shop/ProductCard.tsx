import { useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  
  const { node } = product;
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("Product unavailable");
      return;
    }

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    setIsAdding(true);
    toast.success(`${node.title} added to cart`, {
      position: "top-center"
    });
    
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Link 
      to={`/drops/${node.handle}`}
      className="group block"
    >
      <div className="bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.2)] hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Limited Edition Badge */}
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Limited Edition
          </Badge>
          
          {/* Sold out overlay */}
          {!firstVariant?.availableForSale && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                SOLD OUT
              </Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          
          {node.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-primary">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!firstVariant?.availableForSale || isAdding}
              className="bg-primary hover:bg-primary/90"
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
