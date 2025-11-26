import { Helmet } from "react-helmet-async";
import { Crown, Sparkles } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { SubscriptionManager } from "@/components/subscriptions/SubscriptionManager";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";

const Subscriptions = () => {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString();

  return (
    <>
      <Helmet>
        <title>Subscription Plans - Upgrade Your Analysis | Terrain Token</title>
        <meta 
          name="description" 
          content="Choose from Free, Pro, Business, or Enterprise tiers. Get unlimited energy, advanced AI, and premium features. Pay with TRN for 20% discount!" 
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
                <Crown className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Unlock unlimited terrain analysis power with our subscription tiers
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pay with TRN and save 20%!</span>
            </div>
          </div>

          {/* Subscription Tiers */}
          <SubscriptionManager walletAddress={walletAddress} />

          {/* Benefits Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Advanced AI Models</h3>
              <p className="text-sm text-muted-foreground">
                Access cutting-edge terrain analysis AI with 3D visualization and erosion prediction
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help from our expert team with priority response times and dedicated channels
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">API Access</h3>
              <p className="text-sm text-muted-foreground">
                Integrate terrain analysis into your own tools and workflows with our developer API
              </p>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I change plans anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept TRN tokens (20% discount) or credit/debit cards via Stripe.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What happens to my energy when I subscribe?</h3>
                <p className="text-sm text-muted-foreground">
                  Your daily energy limit increases based on your tier. Pro gets 20/day, Business gets unlimited!
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I cancel my subscription?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel anytime. You'll retain access until the end of your billing period.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Subscriptions;
