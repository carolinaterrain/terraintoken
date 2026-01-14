import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { ProductsGrid } from "@/components/institutional/ProductCard";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Products - Terrain Stormwater Ecosystem</title>
        <meta name="description" content="Explore Terrain's integrated product suite: Carolina Terrain, Terrain Vision, Terrain Guard, Stormwater SCM, and Drainage Academy." />
      </Helmet>

      <PageHeader
        title="Product Suite"
        description="Five integrated products that work together to deliver complete stormwater lifecycle management. From field operations to AI analysis to training—everything connects through a single evidence chain."
      />

      <Section>
        <SectionHeader
          title="Core Products"
          description="Each product addresses a specific need in the stormwater lifecycle while contributing data to the unified evidence chain."
        />
        
        <ProductsGrid exclude={["trn"]} />
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Optional Incentive Layer
          </div>
          
          <h2 className="text-3xl font-bold">TRN Utility Credits</h2>
          
          <p className="text-lg text-muted-foreground">
            TRN provides an optional incentive layer for verified contributions to the Terrain ecosystem. 
            Earn credits through training completions, data quality, and community participation. 
            Redeem for platform discounts and priority services.
          </p>

          <DisclosureCallout type="legal" className="text-left">
            <p>
              TRN is not an investment and has no guaranteed value. Not required to use any Terrain 
              platform features. Subject to market volatility. Consult a financial advisor before acquiring.
            </p>
          </DisclosureCallout>

          <Link to="/products/trn">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Learn About TRN
            </Button>
          </Link>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Integration is the Advantage</h2>
          <p className="text-muted-foreground">
            While each product delivers standalone value, the real power comes from integration. 
            Field data from Carolina Terrain flows to Terrain Vision for AI analysis. Insights 
            trigger Terrain Guard alerts. Everything feeds into Stormwater SCM for compliance 
            reporting. Drainage Academy trains your team on best practices learned from real data.
          </p>
          <Link to="/flywheel">
            <Button className="mt-4">See How It All Connects</Button>
          </Link>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
