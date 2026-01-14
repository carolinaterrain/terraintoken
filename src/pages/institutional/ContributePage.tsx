import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Code, 
  FileText, 
  Megaphone, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const contributionPaths = [
  {
    icon: Users,
    title: "Field Operators",
    description: "Join Carolina Terrain as a certified stormwater contractor. Perform installations, maintenance, and inspections with GPS documentation.",
    requirements: ["Valid contractor license", "Insurance coverage", "Background check"],
    cta: "Apply to Join Crew",
    href: "https://stormwaterscm.com/careers"
  },
  {
    icon: Code,
    title: "Technical Contributors",
    description: "Help build and improve our software products. We're looking for developers, data scientists, and DevOps engineers.",
    requirements: ["Relevant technical skills", "Portfolio or GitHub profile", "Interest in stormwater/compliance"],
    cta: "View Open Roles",
    href: "mailto:careers@terraintoken.com"
  },
  {
    icon: FileText,
    title: "Content & Training",
    description: "Create educational content for Drainage Academy. Subject matter experts in stormwater, environmental compliance, or GIS.",
    requirements: ["Domain expertise", "Communication skills", "Writing samples"],
    cta: "Submit Expertise",
    href: "mailto:academy@terraintoken.com"
  },
  {
    icon: Megaphone,
    title: "Community Ambassadors",
    description: "Help spread awareness about the Terrain ecosystem. Answer questions, create tutorials, and moderate discussions.",
    requirements: ["Active community participation", "Clear communication", "Enthusiasm for the mission"],
    cta: "Join Community",
    href: "https://discord.gg/terrain"
  }
];

export default function ContributePage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Contribute - Join the Terrain Ecosystem</title>
        <meta name="description" content="Multiple paths to contribute to the Terrain stormwater ecosystem. From field operations to software development to community building." />
      </Helmet>

      <PageHeader
        title="Contribute to Terrain"
        description="The Terrain ecosystem grows through verified contributions from professionals, developers, and community members. Find your path to making an impact."
      />

      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          {contributionPaths.map((path) => (
            <div key={path.title} className="p-6 rounded-xl border bg-card space-y-4 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <path.icon className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold">{path.title}</h3>
              <p className="text-muted-foreground">{path.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Requirements:</p>
                <ul className="space-y-1">
                  {path.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <a href={path.href} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2">
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Optional Rewards
          </div>
          
          <h2 className="text-3xl font-bold">Earn TRN for Verified Contributions</h2>
          
          <p className="text-lg text-muted-foreground">
            Contributors who complete verified actions—like training certifications, quality data 
            submissions, or community moderation—may earn TRN utility credits. These can be 
            redeemed for platform discounts and priority services.
          </p>

          <DisclosureCallout type="legal" className="text-left">
            <p>
              TRN rewards are optional and not guaranteed. Contribution verification is at Terrain's 
              discretion. TRN has no guaranteed monetary value and should not be treated as compensation. 
              Contributors are not employees or contractors based on TRN receipt.
            </p>
          </DisclosureCallout>

          <Link to="/token">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Learn About TRN
            </Button>
          </Link>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">How Verification Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="text-2xl font-bold text-primary">1</div>
              <h4 className="font-semibold">Submit Work</h4>
              <p className="text-sm text-muted-foreground">Complete tasks through the appropriate platform channel</p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="text-2xl font-bold text-primary">2</div>
              <h4 className="font-semibold">Get Verified</h4>
              <p className="text-sm text-muted-foreground">Automated and human review confirms quality and authenticity</p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="text-2xl font-bold text-primary">3</div>
              <h4 className="font-semibold">Earn Recognition</h4>
              <p className="text-sm text-muted-foreground">Receive badges, leaderboard ranking, and optional TRN credits</p>
            </div>
          </div>

          <Link to="/proof">
            <Button variant="outline" className="mt-4">View Evidence Chain</Button>
          </Link>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
