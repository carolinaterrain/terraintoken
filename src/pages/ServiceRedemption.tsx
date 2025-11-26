import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Ticket, Gift, CheckCircle } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@solana/wallet-adapter-react";

const DISCOUNT_TIERS = [
  { trn: 1000, discount: 5, name: "Bronze" },
  { trn: 10000, discount: 10, name: "Silver" },
  { trn: 100000, discount: 20, name: "Gold" },
  { trn: 500000, discount: 30, name: "Platinum" },
];

const SERVICE_TYPES = [
  { value: 'drainage', label: 'Drainage Solutions' },
  { value: 'grading', label: 'Land Grading' },
  { value: 'erosion', label: 'Erosion Control' },
  { value: 'landscaping', label: 'Landscaping' },
];

const ServiceRedemption = () => {
  const [serviceType, setServiceType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const walletAddress = publicKey?.toString();

  const handleGenerateCode = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to generate discount codes.",
        variant: "destructive",
      });
      return;
    }

    if (!serviceType) {
      toast({
        title: "Service Required",
        description: "Please select a service type.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-discount-code', {
        body: {
          walletAddress,
          serviceType,
        },
      });

      if (error) throw error;

      setGeneratedCode(data.discountCode);
      
      toast({
        title: "Discount Code Generated! 🎉",
        description: `Your ${data.discountPercent}% discount code is ready!`,
      });
    } catch (error: any) {
      console.error('Code generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate discount code",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Service Redemption - Get Discounts on Real Work | Terrain Token</title>
        <meta 
          name="description" 
          content="Redeem your TRN tokens for discounts on real-world terrain services from Carolina Terrain Solutions. Up to 30% off!" 
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
                <Ticket className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Redeem TRN for Real Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn your TRN tokens into discounts on professional terrain services from Carolina Terrain Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Discount Tiers */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Discount Tiers</h2>
              <div className="space-y-4">
                {DISCOUNT_TIERS.map((tier) => (
                  <Card key={tier.name} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{tier.name} Tier</h3>
                        <p className="text-sm text-muted-foreground">Hold {tier.trn.toLocaleString()} TRN</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{tier.discount}%</p>
                        <p className="text-xs text-muted-foreground">OFF</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Code Generator */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Generate Discount Code</h2>
              
              {generatedCode ? (
                <Card className="p-8 text-center bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Code Generated!</h3>
                  <div className="p-4 bg-background rounded-lg mb-4">
                    <code className="text-2xl font-mono font-bold">{generatedCode}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Show this code when booking your service to apply your discount
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        toast({ title: "Copied to clipboard!" });
                      }}
                    >
                      Copy Code
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setGeneratedCode(null)}
                    >
                      Generate Another
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select value={serviceType} onValueChange={setServiceType}>
                        <SelectTrigger id="serviceType">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full"
                      size="lg"
                      onClick={handleGenerateCode}
                      disabled={generating || !serviceType}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      {generating ? 'Generating...' : 'Generate Discount Code'}
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Discount codes are valid for 90 days and can be used once. 
                      Your discount tier is based on your current TRN holdings at the time of code generation.
                    </p>
                  </div>
                </Card>
              )}

              {/* Service Info */}
              <Card className="p-6 mt-6">
                <h3 className="font-bold mb-4">How to Redeem</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Generate your discount code above</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Contact Carolina Terrain Solutions to book your service</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Provide your discount code during booking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Enjoy your discounted professional terrain work!</span>
                  </li>
                </ol>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServiceRedemption;
