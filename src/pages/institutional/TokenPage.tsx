import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { StatusBadge, OptionalBadge } from "@/components/institutional/StatusBadge";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Coins, 
  Flame, 
  Award, 
  ShoppingBag, 
  AlertTriangle,
  ExternalLink,
  Copy,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

const TRN_CONTRACT = TRN_MINT_ADDRESS;

const utilities = [
  {
    icon: ShoppingBag,
    title: "Platform Discounts",
    description: "Redeem TRN for discounts on Terrain platform subscriptions, API access, and premium features."
  },
  {
    icon: Award,
    title: "Priority Services",
    description: "TRN holders get priority scheduling for Carolina Terrain field services during peak demand."
  },
  {
    icon: Flame,
    title: "Deflationary Mechanics",
    description: "A portion of platform revenue is used for monthly buyback and burn, reducing total supply over time."
  }
];

const disclaimers = [
  "TRN is a utility credit, not an investment. Do not purchase expecting profits.",
  "TRN has no guaranteed value and is subject to market volatility.",
  "TRN is not required to use any Terrain platform features.",
  "Past performance does not indicate future results.",
  "Consult a financial advisor before acquiring TRN.",
  "Terrain makes no representations about future TRN value or utility expansion."
];

export default function TokenPage() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyContract = () => {
    navigator.clipboard.writeText(TRN_CONTRACT);
    setCopied(true);
    toast({ title: "Contract address copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InstitutionalLayout>
      <Helmet>
        <title>TRN Utility Credits - Optional Ecosystem Incentives</title>
        <meta name="description" content="TRN provides optional utility credits for verified contributions to the Terrain ecosystem. Not required for platform access." />
      </Helmet>

      <PageHeader
        title="TRN Utility Credits"
        description="An optional incentive layer for verified contributions to the Terrain ecosystem. Earn through participation, redeem for platform benefits."
        badge={
          <div className="flex items-center gap-2 mb-4">
            <OptionalBadge />
            <StatusBadge status="live" />
          </div>
        }
      />

      {/* Critical Disclosure */}
      <Section className="py-8">
        <DisclosureCallout type="warning" title="Important: Read Before Proceeding">
          <p className="mb-2">
            <strong>TRN is NOT an investment.</strong> It is a utility credit with no guaranteed value. 
            You should not purchase TRN expecting to profit. TRN is completely optional—all Terrain 
            platform features work without it.
          </p>
          <Link to="/legal#token" className="text-primary hover:underline text-sm">
            Read full token disclaimer →
          </Link>
        </DisclosureCallout>
      </Section>

      {/* Contract Info */}
      <Section className="py-12 bg-muted/30">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold">Contract Address (Solana)</h2>
          <button
            onClick={copyContract}
            className="w-full p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          >
            <code className="text-sm font-mono truncate">{TRN_CONTRACT}</code>
            {copied ? (
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Copy className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            Always verify the contract address before any transaction.
          </p>
        </div>
      </Section>

      {/* Utilities */}
      <Section>
        <SectionHeader
          title="What TRN Does"
          description="TRN utility credits can be earned and redeemed within the Terrain ecosystem."
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {utilities.map((util) => (
            <div key={util.title} className="p-6 rounded-xl border bg-card space-y-3 text-center">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                <util.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{util.title}</h3>
              <p className="text-sm text-muted-foreground">{util.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How to Earn */}
      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <SectionHeader
            title="How to Earn TRN"
            description="TRN is distributed for verified contributions to ecosystem quality."
            align="center"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Training Completions</h3>
              <p className="text-sm text-muted-foreground">
                Complete certified courses through Drainage Academy.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Quality Data Submissions</h3>
              <p className="text-sm text-muted-foreground">
                Submit high-quality field documentation that passes verification.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Community Participation</h3>
              <p className="text-sm text-muted-foreground">
                Help moderate discussions, answer questions, create tutorials.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Platform Usage</h3>
              <p className="text-sm text-muted-foreground">
                Active engagement with Terrain products may qualify for rewards.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/contribute">
              <Button className="gap-2">
                Start Contributing
                <Sparkles className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Full Disclaimers */}
      <Section>
        <div className="max-w-3xl mx-auto space-y-6">
          <SectionHeader
            title="Legal Disclaimers"
            description="Please read and understand these disclosures before acquiring TRN."
            align="center"
          />

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Risk Disclosures</span>
            </div>
            <ul className="space-y-2">
              {disclaimers.map((d, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/legal#token">
              <Button variant="outline">Full Token Disclaimer</Button>
            </Link>
            <Link to="/whitepaper">
              <Button variant="outline">Read Whitepaper</Button>
            </Link>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
