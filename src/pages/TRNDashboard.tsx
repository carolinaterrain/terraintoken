import { Helmet } from "react-helmet-async";
import { DashboardErrorBoundary } from "@/components/charts/DashboardErrorBoundary";
import { TRNDashboardHeader } from "@/components/dashboard/TRNDashboardHeader";
import { UtilityTrustCards } from "@/components/dashboard/UtilityTrustCards";
import { LiveTokenStats } from "@/components/dashboard/LiveTokenStats";
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

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
