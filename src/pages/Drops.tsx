import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CartDrawer } from "@/components/shop/CartDrawer";
import BackToHome from "@/components/BackToHome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Award, Clock, Shield, Shirt, HardHat, Package, Flame, Image as ImageIcon } from "lucide-react";
import { CollectorDropCard } from "@/components/shop/CollectorDropCard";
import { useCollectorDrop } from "@/hooks/useCollectorDrop";
import { Link } from "react-router-dom";
import { CountdownTimer } from "@/components/drops/CountdownTimer";
import { SerialPreview } from "@/components/drops/SerialPreview";
import { SocialProofQuotes } from "@/components/drops/SocialProofQuotes";
import { CollectorBenefits } from "@/components/drops/CollectorBenefits";
import { FoundersNote } from "@/components/drops/FoundersNote";
import { ProductGallery } from "@/components/drops/ProductGallery";

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

// Drop end date - set to a fixed date in the future for consistency
// Update this date when launching new drops
const DROP_END_DATE = new Date('2025-01-15T23:59:59Z');

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
              className="text-center max-w-3xl mx-auto mb-8"
            >
              <Badge className="mb-6 bg-primary/20 text-primary border border-primary/30 animate-pulse">
                <Flame className="w-3 h-3 mr-1" />
                First Ever Collector Drop — Limited to 50 Units
              </Badge>
              
              <div className="mb-8">
                <img src="/branding/trn-logo-full.png" alt="Terrain Token" className="h-24 md:h-32 mx-auto" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Community Edition</span>{" "}
                <motion.span 
                  className="text-primary inline-block"
                  animate={{ 
                    textShadow: [
                      "0 0 20px hsl(142 76% 39% / 0.5)",
                      "0 0 40px hsl(142 84% 47% / 0.9)",
                      "0 0 20px hsl(142 76% 39% / 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  #0
                </motion.span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                The first ever Terrain Token collector drop. 
                <span className="text-accent font-semibold"> Only 50 units will ever exist. </span>
                Each includes a premium item and matching NFT certificate of authenticity.
              </p>

              {/* Countdown Timer */}
              <div className="mb-8">
                <CountdownTimer endDate={DROP_END_DATE} />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-colors">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Community Designed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-colors">
                  <Award className="w-4 h-4 text-primary" />
                  <span>1:1 NFT Certificate</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-colors">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>No Restocks Ever</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-colors">
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
                    <motion.button
                      key={itemType}
                      onClick={() => setSelectedItem(itemType)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(142_76%_39%/0.2)]' 
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
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Product Gallery */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <Badge variant="outline" className="bg-card/50 border-primary/30">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Product Preview
                </Badge>
              </motion.div>
              <ProductGallery itemType={selectedItem} />
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

        {/* Why This Drop Matters Section */}
        <section className="py-16 bg-gradient-to-b from-background to-card/30 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Flame className="w-3 h-3 mr-1" />
                Why This Drop Matters
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                This Isn't Just Merch
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                It's <span className="text-primary font-bold">Collector Drop #0</span> — the first Terrain Token collectible ever released.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                <div className="flex items-start gap-3 bg-card/50 p-4 rounded-xl border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">Only <strong>50 units</strong> will ever exist</span>
                </div>
                <div className="flex items-start gap-3 bg-card/50 p-4 rounded-xl border border-primary/20">
                  <Award className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">Each includes a <strong>1/1 serialized NFT</strong></span>
                </div>
                <div className="flex items-start gap-3 bg-card/50 p-4 rounded-xl border border-primary/20">
                  <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">Artwork <strong>designed by the community</strong></span>
                </div>
                <div className="flex items-start gap-3 bg-card/50 p-4 rounded-xl border border-primary/20">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground"><strong>Never restocked.</strong> Never recreated.</span>
                </div>
              </div>
              
              <p className="text-primary font-semibold mt-8 text-lg">
                Owning one makes you part of TRN history.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Serial Preview Section */}
        <section className="py-16 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Your Unique Serial Awaits
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each collector item comes with a unique serial number, permanently recorded on the Solana blockchain.
              </p>
            </motion.div>
            
            <SerialPreview />
          </div>
        </section>

        {/* Collector Benefits Section */}
        <section className="py-16 bg-card/30 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Collector Perks
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                More Than Just a Collectible
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Owning a Drop #0 item unlocks exclusive benefits in the TRN ecosystem.
              </p>
            </motion.div>
            
            <CollectorBenefits />
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-card/30 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">Enter your Solana wallet address to reserve your serial number.</p>
                </div>
                
                <div className="text-center p-6 bg-card/30 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Complete Purchase</h3>
                  <p className="text-sm text-muted-foreground">Checkout through Shopify. We ship your premium collector item.</p>
                </div>
                
                <div className="text-center p-6 bg-card/30 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
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

        {/* Social Proof Section */}
        <section className="py-16 bg-card/30 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                What People Are Saying
              </h2>
            </motion.div>
            
            <SocialProofQuotes />
          </div>
        </section>

        {/* Founder's Note Section */}
        <section className="py-16 border-t border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                💬 Founder's Note
              </Badge>
            </motion.div>
            
            <FoundersNote />
          </div>
        </section>
        
        {/* Shop CTA */}
        <section className="py-16 border-t border-primary/20 bg-gradient-to-b from-card/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Want More TRN Gear?</h3>
            <p className="text-muted-foreground mb-6">Check out our full shop for hoodies, mugs, stickers, and more.</p>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="group">
                Browse Full Shop
                <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Drops;
