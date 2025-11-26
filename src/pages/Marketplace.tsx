import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Store, TrendingUp, Sparkles } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import { CreateListingModal } from "@/components/marketplace/CreateListingModal";
import { Button } from "@/components/ui/button";

const Marketplace = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>TRN Marketplace - Buy & Sell with Terrain Token</title>
        <meta 
          name="description" 
          content="Trade premium items, NFTs, and exclusive content using TRN tokens. Peer-to-peer marketplace with 5% platform fee (2.5% burned!)" 
        />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
        <BackToHome />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
                <Store className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              TRN Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Buy and sell premium items, NFTs, and exclusive content using TRN tokens
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => setCreateModalOpen(true)} size="lg">
                <Sparkles className="h-5 w-5 mr-2" />
                List Item for Sale
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="h-5 w-5 mr-2" />
                My Listings
              </Button>
            </div>
          </div>

          {/* Marketplace Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <MarketplaceGrid itemType="all" />
            </TabsContent>

            <TabsContent value="nfts" className="mt-8">
              <MarketplaceGrid itemType="nft" />
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <MarketplaceGrid itemType="service" />
            </TabsContent>

            <TabsContent value="content" className="mt-8">
              <MarketplaceGrid itemType="content" />
            </TabsContent>
          </Tabs>
        </section>

        <CreateListingModal 
          open={createModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
        />
      </main>

      <Footer />
    </>
  );
};

export default Marketplace;
