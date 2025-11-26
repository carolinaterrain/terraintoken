import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price_trn: number;
  seller_wallet: string;
  item_type: string;
  image_url: string;
  rating: number;
  sales_count: number;
  is_featured: boolean;
}

interface MarketplaceGridProps {
  itemType: string;
}

export const MarketplaceGrid = ({ itemType }: MarketplaceGridProps) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { publicKey } = useWallet();

  useEffect(() => {
    fetchItems();
  }, [itemType]);

  const fetchItems = async () => {
    try {
      let query = supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (itemType !== 'all') {
        query = query.eq('item_type', itemType);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item: MarketplaceItem) => {
    if (!publicKey) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to purchase items.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('process-marketplace-sale', {
        body: {
          itemId: item.id,
          buyerWallet: publicKey.toString(),
          priceTrn: item.price_trn,
        },
      });

      if (error) throw error;

      toast({
        title: "Purchase Successful! 🎉",
        description: `You purchased "${item.title}" for ${item.price_trn} TRN!`,
      });

      fetchItems();
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading marketplace...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items available in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
          {item.is_featured && (
            <Badge className="absolute top-4 right-4 z-10">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          
          <div className="aspect-video bg-muted relative overflow-hidden">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-primary">{item.price_trn} TRN</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>{item.rating?.toFixed(1) || 'New'}</span>
                  <span>•</span>
                  <span>{item.sales_count || 0} sales</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handlePurchase(item)}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
