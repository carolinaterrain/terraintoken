import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Award, Clock, Shield, Shirt, HardHat, Package } from "lucide-react";
import { CollectorDropCard } from "@/components/shop/CollectorDropCard";
import { useCollectorDrop } from "@/hooks/useCollectorDrop";
import { Link } from "react-router-dom";

type ItemType = 'shirt' | 'hat' | 'bundle';

const COLLECTOR_ITEMS = {
  shirt: {
    shopifyProductId: "8367480537225",
    variantId: "gid://shopify/ProductVariant/45014907125897",
    name: "Collector Shirt",
    price: 100,
    icon: Shirt,
    description: "Premium heavyweight shirt with NFT certificate"
  },
  hat: {
    shopifyProductId: "8367549972617",
    variantId: "gid://shopify/ProductVariant/45015103766665",
    name: "Collector Hat",
    price: 75,
    icon: HardHat,
    description: "Premium collector hat with NFT certificate"
  },
  bundle: {
    shopifyProductId: "8367550922889",
    variantId: "gid://shopify/ProductVariant/45015106191497",
    name: "Collector Bundle",
    price: 175,
    icon: Package,
    description: "Shirt + Hat + Stickers + NFT (Save $14.99)"
  }
};

const Drops = () => {
  const { drop, remaining, isLoading } = useCollectorDrop();
  const [selectedItem, setSelectedItem] = useState<ItemType>('shirt');

  const currentItem = COLLECTOR_ITEMS[selectedItem];

  return (
    <>
      <Helmet>
        <title>Collector Drop #0 | Terrain Token</title>
        <meta name="description" content="Limited to 50 units. Premium collector items with unique NFT certificates of authenticity. Once they're gone, they're gone forever." />
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
          <div className="absolute inset-0">
            <img src="/branding/trn-wireframe.png" alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge className="mb-6 bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Collector Edition — Drop #0
              </Badge>
              
              <div className="mb-8">
                <img src="/branding/trn-logo-full.png" alt="Terrain Token" className="h-24 md:h-32 mx-auto" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Community Edition</span>{" "}
                <span className="text-primary">#0</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                The first ever Terrain Token collector drop. 
                <span className="text-accent font-semibold"> Only 50 units will ever exist. </span>
                Each includes a premium item and matching NFT certificate of authenticity.
              </p>
              
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

            {/* Item Selector */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(COLLECTOR_ITEMS) as ItemType[]).map((itemType) => {
                  const item = COLLECTOR_ITEMS[itemType];
                  const Icon = item.icon;
                  const isSelected = selectedItem === itemType;
                  
                  return (
                    <button
                      key={itemType}
                      onClick={() => setSelectedItem(itemType)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border/50 bg-card/30 hover:border-primary/50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.name}
                      </p>
                      <p className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        ${item.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Card */}
            <div className="max-w-md mx-auto">
              <CollectorDropCard 
                shopifyProductId={currentItem.shopifyProductId}
                variantId={currentItem.variantId}
                itemType={selectedItem}
                itemName={currentItem.name}
                itemPrice={currentItem.price}
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
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">Enter your Solana wallet address to reserve your serial number.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Complete Purchase</h3>
                  <p className="text-sm text-muted-foreground">Checkout through Shopify. We ship your premium collector item.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Receive NFT</h3>
                  <p className="text-sm text-muted-foreground">Your unique NFT certificate (#X/50) is transferred to your wallet.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Shop CTA */}
        <section className="py-16 border-t border-primary/20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Want More TRN Gear?</h3>
            <p className="text-muted-foreground mb-6">Check out our full shop for hoodies, mugs, stickers, and more.</p>
            <Link to="/shop">
              <Button size="lg" variant="outline">
                Browse Full Shop
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Drops;
