import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Sparkles, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getProductCategory } from "@/hooks/useProductImages";

type Category = "all" | "limited" | "apparel" | "accessories" | "digital";

// Category to image types mapping
const CATEGORY_IMAGE_TYPES: Record<string, string[]> = {
  'collector-shirt': ['collector-shirt-front', 'collector-shirt-lifestyle'],
  'hoodie': ['hoodie-front', 'hoodie-lifestyle'],
  'work-tee': ['work-tee-front', 'work-tee-lifestyle'],
  'collector-hat': ['collector-hat-front', 'collector-hat-lifestyle'],
  'beanie': ['beanie-front', 'beanie-lifestyle'],
  'coffee-mug': ['coffee-mug-front', 'coffee-mug-lifestyle'],
  'keychain': ['keychain-front', 'keychain-lifestyle'],
  'sticker-pack': ['sticker-pack-front', 'sticker-pack-lifestyle'],
  'bundle': ['collector-bundle-hero', 'collector-bundle-contents'],
};

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const addItem = useCartStore(state => state.addItem);

  // Fetch all AI-generated product images
  const { data: aiImages } = useQuery({
    queryKey: ['product-images', 'all-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5
  });

  // Helper to get AI image for a product
  const getAIImageUrl = (product: ShopifyProduct): string | null => {
    if (!aiImages || aiImages.length === 0) return null;
    
    const category = getProductCategory(product.node.handle, product.node.title);
    if (!category) return null;
    
    const imageTypes = CATEGORY_IMAGE_TYPES[category];
    if (!imageTypes) return null;
    
    // Find matching AI image
    const matchingImage = aiImages.find(img => imageTypes.includes(img.product_type));
    return matchingImage?.public_url || null;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts(50);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = (products: ShopifyProduct[]): ShopifyProduct[] => {
    if (activeCategory === "all") return products;
    
    return products.filter(product => {
      const tags = product.node.tags?.toLowerCase() || "";
      const productType = product.node.productType?.toLowerCase() || "";
      
      switch (activeCategory) {
        case "limited":
          return tags.includes("limited-edition") || tags.includes("collector");
        case "apparel":
          return productType === "apparel" || tags.includes("apparel");
        case "accessories":
          return productType === "accessories" || tags.includes("accessories");
        case "digital":
          return productType === "digital" || tags.includes("digital") || tags.includes("nft");
        default:
          return true;
      }
    });
  };

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    // Don't allow collector items to be added directly - redirect to /drops
    if (product.node.tags?.includes("collector")) {
      toast.info("Collector items require wallet verification", {
        description: "Please purchase collector items from the Drops page.",
        action: {
          label: "Go to Drops",
          onClick: () => window.location.href = "/drops"
        }
      });
      return;
    }

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });

    toast.success("Added to cart!", {
      description: product.node.title
    });
  };

  const isCollectorItem = (product: ShopifyProduct) => {
    return product.node.tags?.includes("collector") || product.node.tags?.includes("limited-edition");
  };

  const filteredProducts = filterProducts(products);

  return (
    <>
      <Helmet>
        <title>Shop | Terrain Token</title>
        <meta name="description" content="Official Terrain Token merchandise. Premium apparel, accessories, and limited edition collector items with NFT certificates." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <BackToHome />
            <h1 className="text-xl font-bold text-foreground">TRN Shop</h1>
            <CartDrawer />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 lg:py-16 overflow-hidden border-b border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Official Merchandise
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Terrain Token Shop
              </h1>
              <p className="text-muted-foreground">
                Premium gear for the TRN community. Limited editions include NFT certificates of authenticity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-xl border-b border-primary/10">
          <div className="container mx-auto px-4 py-4">
            <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="limited">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Limited Drops
                </TabsTrigger>
                <TabsTrigger value="apparel">Apparel</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
                <TabsTrigger value="digital">Digital</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products found in this category.</p>
                <Button variant="outline" onClick={() => setActiveCategory("all")}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-muted/30">
                      {(() => {
                        const shopifyImage = product.node.images.edges[0]?.node?.url;
                        const aiImage = getAIImageUrl(product);
                        const imageUrl = shopifyImage || aiImage;
                        
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.node.images.edges[0]?.node?.altText || product.node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src="/branding/trn-logo-full.png"
                              alt={product.node.title}
                              className="w-1/2 h-1/2 object-contain opacity-50"
                            />
                          </div>
                        );
                      })()}
                      
                      {/* Limited Edition Badge */}
                      {isCollectorItem(product) && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Limited Edition
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {product.node.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.node.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.node.priceRange.minVariantPrice.currencyCode}
                        </span>
                      </div>

                      {isCollectorItem(product) ? (
                        <Link to="/drops">
                          <Button className="w-full" variant="secondary">
                            <Sparkles className="w-4 h-4 mr-2" />
                            View Drop
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-card/30 border-t border-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Looking for Collector Items?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Limited edition items with NFT certificates are available on our exclusive Drops page.
            </p>
            <Link to="/drops">
              <Button size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                View Drop #0
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Shop;
