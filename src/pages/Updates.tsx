import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, FileText } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "whitepaper-release",
    slug: "whitepaper",
    title: "Official Whitepaper Released: The Complete TRN Story",
    excerpt: "We're excited to release the official Terrain Token whitepaper — a comprehensive 25-page document detailing our tokenomics, vision, roadmap, and how we're bridging meme culture with real-world utility.",
    content: "Today marks a major milestone for the Terrain Token community. After months of development and community feedback, we're proud to release our official whitepaper...",
    author: "TRN Team",
    date: "November 20, 2025",
    category: "Announcements",
    readTime: "3 min"
  },
  {
    id: "origin-story",
    slug: "how-terrain-token-started",
    title: "How Terrain Token Started – From Drainage Ditches to Digital Revolution",
    excerpt: "The story of how two drainage contractors decided to launch a meme coin that actually means something. Spoiler: it involves a lot of French drains and goblin memes.",
    content: "Terrain Token wasn't born in a Silicon Valley boardroom or at a crypto conference. It was born in Waxhaw, North Carolina, at the intersection of stormwater management and internet culture...",
    author: "Alex Purdy & Zac Hyman",
    date: "November 15, 2025",
    category: "Origin Story",
    readTime: "10 min"
  },
  {
    id: "why-real-backing",
    slug: "why-meme-coins-need-real-world-backing",
    title: "Why Every Meme Coin Needs Real-World Backing",
    excerpt: "The BEER collapse showed us what happens when meme coins have nothing behind them. TRN is different — here's why backing matters and how it protects our community.",
    content: "The recent BEER token collapse sent shockwaves through the meme coin community. Holders watched helplessly as insider wallets dumped massive amounts, revealing that the project had no substance...",
    author: "TRN Team",
    date: "November 10, 2025",
    category: "Analysis",
    readTime: "8 min"
  },
  {
    id: "ai-drainage-future",
    slug: "ai-powered-drainage-analysis-future",
    title: "The Future of AI-Powered Drainage Analysis",
    excerpt: "TerrainVision AI is just the beginning. Here's how we're using computer vision and machine learning to revolutionize the landscaping industry while rewarding our community with TRN.",
    content: "Traditional landscaping estimates are slow, expensive, and often inaccurate. A homeowner calls, waits days for a site visit, then waits more for a quote. TerrainVision AI changes everything...",
    author: "TRN Development Team",
    date: "November 5, 2025",
    category: "Technology",
    readTime: "12 min"
  },
  {
    id: "transparency-report-nov",
    slug: "transparency-report-november-2025",
    title: "TRN Transparency Report – November 2025",
    excerpt: "Our first monthly transparency report covering wallet holdings, treasury activity, community growth metrics, and development updates. No secrets, no surprises.",
    content: "Welcome to our inaugural monthly transparency report. As promised in our whitepaper, we're committed to radical transparency...",
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
        <title>Updates & Blog | Terrain Token (TRN)</title>
        <meta name="description" content="Latest news, updates, and insights from the Terrain Token team. Read about our progress, transparency reports, and the future of TRN." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              TRN <span className="text-primary">Updates</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Latest news, transparency reports, and insights from the terrain revolution.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <GlassCard className="p-8 md:p-12 bg-gradient-to-br from-primary/20 to-primary/5 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 rounded-full text-xs font-bold text-primary">
                  FEATURED
                </span>
                <span className="text-sm text-muted-foreground">{blogPosts[0].category}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {blogPosts[0].title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {blogPosts[0].date}
                </div>
                <div>{blogPosts[0].readTime} read</div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="font-display" asChild>
                  <Link to="/whitepaper">
                    <FileText className="mr-2 h-5 w-5" />
                    Read Whitepaper
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <GlassCard hover className="p-6 cursor-pointer h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div>{post.readTime} read</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16">
            <GlassCard className="p-8 text-center">
              <h3 className="font-display text-2xl font-bold mb-4">
                Stay Updated
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our Telegram and Discord to get instant updates on new blog posts, transparency reports, and major announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="https://t.me/+s6385WFOp21lOGZh" target="_blank" rel="noopener noreferrer">
                    Join Telegram 📱
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary" asChild>
                  <a href="https://discord.gg/terraintoken" target="_blank" rel="noopener noreferrer">
                    Join Discord 💬
                  </a>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Updates;
