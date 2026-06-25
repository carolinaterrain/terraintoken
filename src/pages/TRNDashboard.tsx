import { Helmet } from "react-helmet-async";
import { DashboardErrorBoundary } from "@/components/charts/DashboardErrorBoundary";
import { TRNDashboardHeader } from "@/components/dashboard/TRNDashboardHeader";
import { TRNGrowthCard } from "@/components/dashboard/TRNGrowthCard";
import { APYHeroBanner } from "@/components/dashboard/APYHeroBanner";
import { UtilityTrustCards } from "@/components/dashboard/UtilityTrustCards";
import { LiveTokenStats } from "@/components/dashboard/LiveTokenStats";
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";
import { BurnBandIndicator } from "@/components/ecosystem/BurnBandIndicator";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TRN_MINT_ADDRESS, TRN_APY_RATE } from "@/lib/airdropConstants";

export default function TRNDashboard() {
  return (
    <>
      <Helmet>
        <title>TRN Dashboard — Token-2022 Utility Token | Terrain Ecosystem</title>
        <meta
          name="description"
          content="Track your $TRN balance on Solana Token-2022. An incentive layer tied to Carolina Terrain LLC, a licensed NC drainage contractor. $TRN is a utility/incentive token — not an investment, not a security."
        />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <TRNDashboardHeader />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-10 flex-1">
        {/* APY Hero Banner - Maximum Prominence */}
        <section>
          <DashboardErrorBoundary componentName="APY Banner">
            <APYHeroBanner />
          </DashboardErrorBoundary>
        </section>

        {/* Personal Balance Card */}
        <section className="max-w-4xl mx-auto">
          <DashboardErrorBoundary componentName="Growth Card">
            <TRNGrowthCard />
          </DashboardErrorBoundary>
        </section>

          {/* Live Token Stats */}
          <section>
            <DashboardErrorBoundary componentName="Token Stats">
              <LiveTokenStats />
            </DashboardErrorBoundary>
          </section>

          {/* Utility & Trust Cards */}
          <DashboardErrorBoundary componentName="Utility Cards">
            <UtilityTrustCards />
          </DashboardErrorBoundary>

          {/* Price Chart */}
          <section>
            <DashboardErrorBoundary componentName="Price Chart">
              <DexScreenerChart />
            </DashboardErrorBoundary>
          </section>

          {/* Burn Band Indicator */}
          <DashboardErrorBoundary componentName="Burn Band">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <BurnBandIndicator showProgress />
            </Card>
          </DashboardErrorBoundary>

          {/* Holder Tracker */}
          <DashboardErrorBoundary componentName="Holder Tracker">
            <LiveHolderTracker />
          </DashboardErrorBoundary>

          {/* Cross-App Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" asChild>
              <Link to="/transparency">
                View Transparency Hub →
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/ecosystem">
                Explore Ecosystem
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                Verify on Solscan
              </a>
            </Button>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
