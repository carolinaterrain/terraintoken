import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const platformTiers = [
  { name: "Starter", price: "Free", features: ["Basic asset tracking", "Manual inspections", "Email support", "Up to 50 SCMs"] },
  { name: "Professional", price: "$299/mo", features: ["Unlimited SCMs", "Mobile app access", "Automated reports", "Priority support", "API access"] },
  { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integrations", "Dedicated success manager", "SLA guarantees", "On-premise option"] },
];

export default function PricingPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Pricing - Terrain Platform</title>
        <meta name="description" content="Terrain platform pricing for stormwater management software. TRN is not required for any platform features." />
      </Helmet>

      <PageHeader title="Pricing" description="Straightforward pricing for platform access. TRN utility credits are completely optional." />

      <Section>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {platformTiers.map((tier) => (
            <div key={tier.name} className="p-6 rounded-xl border bg-card space-y-4">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-3xl font-bold">{tier.price}</p>
              <ul className="space-y-2">
                {tier.features.map((f, i) => (
                  <li key={i} className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Button className="w-full" variant={tier.name === "Professional" ? "default" : "outline"}>Get Started</Button>
            </div>
          ))}
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
