import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section } from "@/components/institutional/InstitutionalLayout";

export default function LegalPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Legal - Terrain</title>
        <meta name="description" content="Privacy policy, terms of service, and legal disclosures for the Terrain ecosystem." />
      </Helmet>

      <PageHeader title="Legal" description="Privacy policy, terms of service, risk disclosures, and token disclaimer." />

      <Section>
        <div className="max-w-3xl mx-auto space-y-12">
          <div id="privacy" className="space-y-4">
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
            <p className="text-muted-foreground">We collect minimal data necessary to provide our services. Your information is never sold to third parties.</p>
          </div>
          <div id="terms" className="space-y-4">
            <h2 className="text-2xl font-bold">Terms of Service</h2>
            <p className="text-muted-foreground">By using Terrain products, you agree to use them lawfully and in accordance with applicable regulations.</p>
          </div>
          <div id="risk" className="space-y-4">
            <h2 className="text-2xl font-bold">Risk Disclosure</h2>
            <p className="text-muted-foreground">Stormwater management involves inherent risks. Terrain provides tools but does not guarantee compliance outcomes.</p>
          </div>
          <div id="token" className="space-y-4">
            <h2 className="text-2xl font-bold">Token Disclaimer</h2>
            <p className="text-muted-foreground">TRN is a utility credit, not an investment. It has no guaranteed value and is not required for platform access. Do not purchase expecting profits. Subject to market volatility. Consult a financial advisor before acquiring.</p>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
