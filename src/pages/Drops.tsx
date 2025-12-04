import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Award, Clock, Shield } from "lucide-react";
import { CollectorDropCard } from "@/components/shop/CollectorDropCard";
import { useCollectorDrop } from "@/hooks/useCollectorDrop";

const Drops = () => {
  const { drop, remaining, isLoading } = useCollectorDrop();

  return (
    <>
      <Helmet>
        <title>Collector Drop #0 | Terrain Token</title>
        <meta name="description" content="Limited to 50 units. Premium collector shirt with unique NFT certificate of authenticity. Once they're gone, they're gone forever." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <BackToHome />
            <h1 className="text-xl font-bold text-foreground">Drop #0</h1>
            <CartDrawer />
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background */}
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
              className="text-center max-w-3xl mx-auto mb-12"
            >
              {/* Drop Badge */}
              <Badge className="mb-6 bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Collector Edition — Drop #0
              </Badge>
              
              {/* Logo */}
              <div className="mb-8">
                <img 
                  src="/branding/trn-logo-full.png" 
                  alt="Terrain Token" 
                  className="h-24 md:h-32 mx-auto"
                />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Community Edition</span>{" "}
                <span className="text-primary">#0</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                The first ever Terrain Token collector drop. 
                <span className="text-accent font-semibold"> Only 50 units will ever exist. </span>
                Each includes a premium shirt and matching NFT certificate of authenticity.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Community Designed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
                  <Award className="w-4 h-4 text-primary" />
                  <span>1:1 NFT Certificate</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>No Restocks Ever</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>On-Chain Proof</span>
                </div>
              </div>
            </motion.div>

            {/* Product Card */}
            <div className="max-w-md mx-auto">
              <CollectorDropCard 
                shopifyProductId="8367480537225"
                variantId="gid://shopify/ProductVariant/45014907125897"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-card/30 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                How It Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your Solana wallet address to reserve your serial number.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Complete Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Checkout through Shopify. We ship your premium collector shirt.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Receive NFT</h3>
                  <p className="text-sm text-muted-foreground">
                    Your unique NFT certificate (#X/50) is transferred to your wallet.
                  </p>
                </div>
              </div>
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
              <Badge className="mb-4 bg-accent/20 text-accent">
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
                  className="h-20 opacity-80"
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
