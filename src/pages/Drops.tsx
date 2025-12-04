import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Package, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Drops = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts(50);
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Limited Drops | Terrain Token</title>
        <meta name="description" content="Exclusive limited-edition merch from the Terrain Token community. One-time releases, no restocks. Get yours before they're gone." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <BackToHome />
            <h1 className="text-xl font-bold text-foreground">Limited Drops</h1>
            <CartDrawer />
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background with new branding */}
          <div className="absolute inset-0">
            <img 
              src="/branding/trn-wireframe.png" 
              alt="" 
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Community Badge */}
              <Badge className="mb-6 bg-accent/20 text-accent border border-accent/30">
                <Users className="w-3 h-3 mr-1" />
                Community-Created Artwork
              </Badge>
              
              {/* Logo Display */}
              <div className="mb-8">
                <img 
                  src="/branding/trn-logo-full.png" 
                  alt="Terrain Token" 
                  className="h-32 md:h-48 mx-auto"
                />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Limited Edition</span>{" "}
                <span className="text-primary">Drops</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Exclusive merch featuring our community-designed logo. 
                <span className="text-accent font-semibold"> One-time releases. No restocks. </span>
                Once they're gone, they're gone forever.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Community Designed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Limited Quantity</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>No Restocks</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Products Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Drop #1 — Community Logo Collection
                </h2>
                <Badge variant="outline" className="border-primary/30">
                  {products.length} Items
                </Badge>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner className="w-12 h-12" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-lg border border-primary/20">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Products Yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're preparing the first drop with exclusive community-designed merch. 
                    Tell us in chat what products you'd like to create!
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Example: "Create a black t-shirt with the TRN logo for $29.99"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
        
        {/* Community Credit Section */}
        <section className="py-16 border-t border-primary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/20 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                Logo Competition Winner
              </Badge>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Community-Created Design
              </h3>
              
              <p className="text-muted-foreground mb-6">
                This exclusive artwork was created by a member of our community and selected 
                as the winning design in our logo competition. Every purchase supports the 
                Terrain Token ecosystem and celebrates community creativity.
              </p>
              
              <div className="flex justify-center">
                <img 
                  src="/branding/trn-lockup.png" 
                  alt="TRN Logo" 
                  className="h-24 opacity-80"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Drops;
