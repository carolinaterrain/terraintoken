import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ShoppingCart, Check, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setIsLoading(true);
      const data = await fetchProductByHandle(handle);
      setProduct(data);
      setIsLoading(false);
    };
    loadProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/drops">
            <Button>Back to Drops</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem: CartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    setIsAdding(true);
    toast.success(`${product.title} added to cart`, {
      position: "top-center"
    });
    
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <>
      <Helmet>
        <title>{product.title} | Terrain Token Drops</title>
        <meta name="description" content={product.description || `Limited edition ${product.title} from Terrain Token`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/drops" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Drops</span>
            </Link>
            <CartDrawer />
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-square bg-card rounded-lg overflow-hidden border border-primary/20">
                {images[selectedImageIndex]?.node ? (
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                        idx === selectedImageIndex ? 'border-primary' : 'border-primary/20 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <Badge className="mb-3 bg-accent/20 text-accent border border-accent/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Limited Edition
                </Badge>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                
                <p className="text-3xl font-bold text-primary">
                  ${parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
                </p>
              </div>
              
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
              
              {/* Options */}
              {product.options.map((option, optionIdx) => (
                <div key={option.name} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const variantIndex = product.variants.edges.findIndex(
                        v => v.node.selectedOptions.some(
                          so => so.name === option.name && so.value === value
                        )
                      );
                      const isSelected = selectedVariantIndex === variantIndex;
                      
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedVariantIndex(variantIndex >= 0 ? variantIndex : 0)}
                          className={`px-4 py-2 rounded-md border transition-colors ${
                            isSelected 
                              ? 'border-primary bg-primary/20 text-foreground' 
                              : 'border-primary/30 hover:border-primary/60 text-muted-foreground'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {/* Add to Cart */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale || isAdding}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                >
                  {!selectedVariant?.availableForSale ? (
                    "Sold Out"
                  ) : isAdding ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-3">
                  One-time release • No restocks • Ships worldwide
                </p>
              </div>
              
              {/* Community Badge */}
              <div className="pt-6 border-t border-primary/20">
                <div className="flex items-center gap-3">
                  <img 
                    src="/branding/trn-mountains.png" 
                    alt="TRN" 
                    className="w-12 h-12 opacity-80"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Community-Created Design</p>
                    <p className="text-xs text-muted-foreground">Logo Competition Winner</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductDetail;
