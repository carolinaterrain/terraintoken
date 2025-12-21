import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, FileText, Info } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";

interface SystemUpdate {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

// Reframed as release notes / system updates
const systemUpdates: SystemUpdate[] = [
  {
    id: "whitepaper-release",
    slug: "whitepaper",
    title: "Documentation Update: Official Whitepaper v1.0",
    excerpt: "The complete TRN documentation is now available, covering tokenomics structure, platform integration, and governance framework.",
    author: "TRN Team",
    date: "November 20, 2025",
    category: "Documentation",
    readTime: "3 min"
  },
  {
    id: "origin-story",
    slug: "how-terrain-token-started",
    title: "Project Background: From Drainage Contractor to Terrain System",
    excerpt: "Background documentation on how TRN emerged from Carolina Terrain's operational needs and platform development.",
    author: "Alex Purdy & Zac Hyman",
    date: "November 15, 2025",
    category: "Background",
    readTime: "10 min"
  },
  {
    id: "why-real-backing",
    slug: "why-meme-coins-need-real-world-backing",
    title: "Context: Understanding Utility-Backed Token Design",
    excerpt: "Technical analysis of utility token design principles and how TRN's structure differs from speculative tokens.",
    author: "TRN Team",
    date: "November 10, 2025",
    category: "Technical",
    readTime: "8 min"
  },
  {
    id: "ai-drainage-future",
    slug: "ai-powered-drainage-analysis-future",
    title: "Platform Update: TerrainVision AI Integration",
    excerpt: "Technical overview of how TerrainVision AI integrates with the Terrain ecosystem and the role of TRN utility credits.",
    author: "TRN Development Team",
    date: "November 5, 2025",
    category: "Platform",
    readTime: "12 min"
  },
  {
    id: "transparency-report-nov",
    slug: "transparency-report-november-2025",
    title: "Transparency Report — November 2025",
    excerpt: "Monthly transparency report covering wallet holdings, treasury activity, and ecosystem metrics.",
    author: "TRN Team",
    date: "November 1, 2025",
    category: "Transparency",
    readTime: "10 min"
  }
];

const Updates = () => {
  return (
    <>
      <Helmet>
        <title>System Updates | Terrain Token (TRN)</title>
        <meta name="description" content="System updates, transparency reports, and documentation changes for the Terrain ecosystem." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero - Release notes style */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              System <span className="text-primary">Updates</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparency reports, documentation changes, and platform updates.
            </p>
          </div>

          {/* Framing notice */}
          <div className="flex items-center justify-center gap-2 mb-12 bg-muted/30 border border-border/50 rounded-lg px-4 py-3 max-w-2xl mx-auto">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground text-center">
              Infrastructure updates and accountability reports. Not promotional content.
            </p>
          </div>

          {/* Featured Documentation */}
          <div className="mb-12">
            <GlassCard className="p-8 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary">
                  DOCUMENTATION
                </span>
                <span className="text-sm text-muted-foreground">{systemUpdates[0].category}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                {systemUpdates[0].title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {systemUpdates[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {systemUpdates[0].date}
                </div>
                <div>{systemUpdates[0].readTime} read</div>
              </div>
              <p className="text-muted-foreground mb-6">
                {systemUpdates[0].excerpt}
              </p>
              <Button variant="outline" asChild>
                <Link to="/whitepaper">
                  <FileText className="mr-2 h-4 w-4" />
                  View Documentation
                </Link>
              </Button>
            </GlassCard>
          </div>

          {/* Updates List */}
          <div className="space-y-4">
            {systemUpdates.slice(1).map((update) => (
              <Link key={update.id} to={`/blog/${update.slug}`}>
                <GlassCard hover className="p-5 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-muted-foreground">
                          {update.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-1 hover:text-primary transition-colors">
                        {update.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {update.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Community Link */}
          <div className="mt-12">
            <GlassCard className="p-6 text-center">
              <h3 className="font-display text-xl font-semibold mb-3">
                Community Discussion
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
                Join the Discord community for update notifications and ecosystem discussions.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://discord.gg/rM8b6V5Ce" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Updates;
