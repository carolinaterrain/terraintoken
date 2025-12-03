import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { CallToAction } from "@/components/blog/CallToAction";
import { GoblinWisdomBox } from "@/components/blog/GoblinWisdomBox";
import { Calendar, User, Clock, TrendingUp, Users, DollarSign } from "lucide-react";

const TransparencyReportNovember2025 = () => {
  const title = "TRN Transparency Report – November 2025: Complete Financial Breakdown & Metrics";
  const description = "Full transparency: 2,100 holders, $180K revenue, 620K USDC treasury. See exactly where every TRN token is and how Carolina Terrain's established business backs the token. No secrets.";
  const url = "https://terraintoken.com/blog/transparency-report-november-2025";
  const publishDate = "2025-11-01T09:00:00-05:00";
  const modifiedDate = "2025-11-01T09:00:00-05:00";

  const headings = [
    { id: "overview", text: "At a Glance: November 2025 Summary", level: 2 },
    { id: "manifesto", text: "Why This Report Exists: The Accountability Manifesto", level: 2 },
    { id: "supply", text: "Circulating Supply Analysis", level: 2 },
    { id: "holders", text: "Holder Growth Analysis", level: 2 },
    { id: "treasury", text: "Treasury Breakdown", level: 2 },
    { id: "revenue", text: "Revenue Detail", level: 2 },
    { id: "liquidity", text: "Liquidity Analysis", level: 2 },
    { id: "community", text: "Community Metrics: Beyond the Numbers", level: 2 },
    { id: "development", text: "Development Updates: What We Shipped", level: 2 },
    { id: "spending", text: "What We're Spending On", level: 2 },
    { id: "december", text: "Looking Ahead: December Preview", level: 2 },
    { id: "wallets", text: "The Wallet Addresses: Full Transparency", level: 2 },
    { id: "faq", text: "FAQ: Report Questions", level: 2 }
  ];

  const relatedArticles = [
    {
      slug: "how-terrain-token-started",
      title: "How Terrain Token Started",
      excerpt: "The origin story of how two drainage contractors built a crypto ecosystem backed by real revenue.",
      category: "Origin Story",
      date: "November 15, 2025",
      author: "Alex Purdy & Zac Hyman",
      readTime: "10 min"
    },
    {
      slug: "why-meme-coins-need-real-world-backing",
      title: "Why Every Meme Coin Needs Real-World Backing",
      excerpt: "The BEER collapse and why TRN's established revenue backing makes it different from 99% of meme coins.",
      category: "Analysis",
      date: "November 10, 2025",
      author: "TRN Team",
      readTime: "8 min"
    },
    {
      slug: "ai-powered-drainage-analysis-future",
      title: "The Future of AI-Powered Drainage Analysis",
      excerpt: "TerrainVision AI combines LiDAR, IoT sensors, and deep learning to predict drainage issues with 94.7% accuracy.",
      category: "Technology",
      date: "November 5, 2025",
      author: "TRN Development Team",
      readTime: "12 min"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{title} | Terrain Token Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://terraintoken.com/og-terrain.png" />
        <meta property="og:url" content={url} />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="TRN Team" />
        <meta property="article:section" content="Transparency" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://terraintoken.com/og-terrain.png" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Report",
          "headline": title,
          "image": "https://terraintoken.com/og-terrain.png",
          "author": {
            "@type": "Organization",
            "name": "TRN Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Terrain Token",
            "logo": {
              "@type": "ImageObject",
              "url": "https://terraintoken.com/trn-coin.png"
            }
          },
          "datePublished": publishDate,
          "dateModified": modifiedDate,
          "description": description
        })}
      </script>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        
        <article className="container mx-auto px-4 max-w-5xl">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-green-500/20 rounded-full text-sm font-bold text-green-400">
                TRANSPARENCY
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              TRN Transparency Report – <span className="text-primary">November 2025</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">TRN Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">November 1, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">10 min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Welcome to our inaugural monthly transparency report. As promised in our whitepaper, we're committed to radical transparency—full disclosure of financials, token distribution, community metrics, and development progress. No secrets, no surprises.
            </p>
          </header>

          <ShareButtons title={title} description={description} url={url} />

          <div className="flex gap-8">
            <div className="flex-1 max-w-3xl">
              <div className="prose prose-lg max-w-none">
                
                <h2 id="overview" className="font-display text-3xl font-bold mt-12 mb-6">
                  At a Glance: November 2025 Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  <div className="p-6 bg-card/40 rounded-lg border border-primary/20">
                    <Users className="w-10 h-10 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary mb-1">2,100</div>
                    <div className="text-sm text-muted-foreground">Total Holders</div>
                    <div className="text-xs text-green-400 mt-2">↑ +50% from October</div>
                  </div>
                  <div className="p-6 bg-card/40 rounded-lg border border-primary/20">
                    <DollarSign className="w-10 h-10 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary mb-1">$180K</div>
                    <div className="text-sm text-muted-foreground">October Revenue</div>
                    <div className="text-xs text-green-400 mt-2">↑ +12% MoM</div>
                  </div>
                  <div className="p-6 bg-card/40 rounded-lg border border-primary/20">
                    <TrendingUp className="w-10 h-10 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary mb-1">620K</div>
                    <div className="text-sm text-muted-foreground">USDC Treasury</div>
                    <div className="text-xs text-green-400 mt-2">↑ +18% MoM</div>
                  </div>
                </div>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <h3 className="font-display text-xl font-bold mb-4">Key Metrics</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Circulating Supply</span>
                      <span className="font-semibold">850M TRN (85% of total)</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Tokens Burned</span>
                      <span className="font-semibold">50M TRN (5% of total)</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Treasury Reserves</span>
                      <span className="font-semibold">620K USDC + 8.5K SOL + 175K TRN</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Liquidity Pool</span>
                      <span className="font-semibold">400M TRN + 6K SOL (locked)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Holder Retention</span>
                      <span className="font-semibold text-green-400">87% MoM</span>
                    </li>
                  </ul>
                </div>

                <h2 id="manifesto" className="font-display text-3xl font-bold mt-12 mb-6">
                  Why This Report Exists: The Accountability Manifesto
                </h2>

                <p>
                  Most crypto projects hide their financials. We do the opposite.
                </p>

                <p>
                  <strong>The problem with crypto opacity:</strong> Without transparency, investors can't assess risk. Anonymous teams can dump tokens, drain treasuries, or simply disappear. Rug pulls are rampant because there's no accountability.
                </p>

                <p>
                  <strong>TRN's commitment:</strong> Publish detailed monthly reports disclosing:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Exact wallet holdings (all addresses public)</li>
                  <li>Treasury allocation and changes</li>
                  <li>Token distribution and vesting schedules</li>
                  <li>Revenue sources and amounts from Carolina Terrain</li>
                  <li>Development progress and roadmap updates</li>
                  <li>Community metrics and engagement data</li>
                </ul>

                <GoblinWisdomBox>
                  Trust through transparency. If we hide numbers, you should run. If we show everything, you can verify everything. That's the goblin way.
                </GoblinWisdomBox>

                <p>
                  <strong>What we'll never disclose:</strong> Personal information about token holders, customer data from Carolina Terrain, or anything that violates privacy laws. Transparency ≠ doxxing.
                </p>

                <h2 id="supply" className="font-display text-3xl font-bold mt-12 mb-6">
                  Circulating Supply Analysis
                </h2>

                <p>
                  <strong>Total supply:</strong> 1,000,000,000 TRN (1 billion)<br />
                  <strong>Circulating supply:</strong> 850,000,000 TRN (85%)<br />
                  <strong>Locked/vesting:</strong> 100,000,000 TRN (10%)<br />
                  <strong>Burned:</strong> 50,000,000 TRN (5%)
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Why We Locked 100M TRN</h3>

                <p>
                  Team allocation (founders, advisors, early contributors) is locked for 12 months from launch (October 2025 → October 2026). After that, linear vesting over 24 months.
                </p>

                <p>
                  <strong>Why this matters:</strong> Prevents founders from dumping tokens in the first year. Aligns long-term incentives—if TRN succeeds, we benefit. If it fails, we suffer alongside holders.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Burn Schedule</h3>

                <p>
                  We've burned 50M TRN across two events:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>September burn:</strong> 20M TRN removed from circulation after 1,000 holder milestone</li>
                  <li><strong>October burn:</strong> 30M TRN removed after Raydium migration</li>
                </ul>

                <p>
                  <strong>Future burns:</strong> Quarterly burns funded by a portion of buybacks. Goal: Reduce circulating supply to 700-750M over 2-3 years.
                </p>

                <h2 id="holders" className="font-display text-3xl font-bold mt-12 mb-6">
                  Holder Growth Analysis
                </h2>

                <p>
                  <strong>Current holders:</strong> 2,100 unique wallets (up from 1,400 in October)<br />
                  <strong>Growth rate:</strong> +50% month-over-month<br />
                  <strong>Retention rate:</strong> 87% (holders who stay active 30+ days)
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Where Are New Holders Coming From?</h3>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">FlowGuardian installs</span>
                      <span className="font-semibold text-primary">40%</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">LawnShift subscriptions</span>
                      <span className="font-semibold text-primary">25%</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">DEX trading (Raydium)</span>
                      <span className="font-semibold text-primary">30%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Community referrals</span>
                      <span className="font-semibold text-primary">5%</span>
                    </li>
                  </ul>
                </div>

                <p>
                  <strong>Key insight:</strong> 65% of new holders come from real-world utility (FlowGuardian + LawnShift), not speculation. This is unusual for meme coins and indicates sustainable growth.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Holder Distribution</h3>

                <p>
                  <strong>Largest holder:</strong> 3.8% of supply (liquidity pool excluded)<br />
                  <strong>Top 10 holders:</strong> 18.2% of supply<br />
                  <strong>Top 100 holders:</strong> 41.5% of supply
                </p>

                <p>
                  For comparison, typical meme coins see top 10 holders controlling 50-70%+. TRN's distribution is healthier, reducing rug pull risk.
                </p>

                <h2 id="treasury" className="font-display text-3xl font-bold mt-12 mb-6">
                  Treasury Breakdown
                </h2>

                <p>
                  <strong>As of October 31, 2025:</strong>
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>620,000 USDC</strong> – Stablecoin reserves for operational stability</li>
                  <li><strong>8,500 SOL</strong> – For gas fees, liquidity adds, and operating expenses</li>
                  <li><strong>175,000 TRN</strong> – Reserved for community grants, airdrops, and emergency fund</li>
                </ul>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Why These Holdings?</h3>

                <p>
                  <strong>USDC (Stablecoins):</strong> Provides stability. Used for buybacks, development funding, and protecting against crypto market volatility. We don't want treasury value to crash 50% in a bear market.
                </p>

                <p>
                  <strong>SOL (Solana):</strong> Needed for transaction fees on Solana network. Also strategic hold—as Solana ecosystem grows, so does SOL value, benefiting treasury.
                </p>

                <p>
                  <strong>TRN (Native Token):</strong> Reserved for rewards, grants, and community programs. Not sold for operating expenses to avoid selling pressure.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Month-over-Month Changes</h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li>USDC: +18% (from $525K to $620K) due to revenue allocation</li>
                  <li>SOL: +5% (from 8.1K to 8.5K) from buybacks and liquidity ops</li>
                  <li>TRN: -12% (from 200K to 175K) used for airdrops and contributor rewards</li>
                </ul>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Multisig Control</h3>

                <p>
                  Treasury is controlled by 3-of-5 multisig wallet. Signers:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Alex Purdy (CEO)</li>
                  <li>Zac Hyman (COO)</li>
                  <li>Lead Developer (pseudonymous for security)</li>
                  <li>Community Representative (elected quarterly)</li>
                  <li>External Auditor (third-party security firm)</li>
                </ul>

                <p>
                  <strong>What this means:</strong> No single person can drain the treasury. Requires 3 signatures for any large transaction.
                </p>

                <h2 id="revenue" className="font-display text-3xl font-bold mt-12 mb-6">
                  Revenue Detail: October 2025
                </h2>

                <p>
                  <strong>Total revenue:</strong> $180,000<br />
                  <strong>Gross margin:</strong> 42%<br />
                  <strong>Net profit allocated to TRN treasury:</strong> $15,120 (20% of net profit)
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Revenue Breakdown by Division</h3>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-start border-b border-primary/10 pb-3">
                      <div>
                        <div className="font-semibold">Drainage Projects</div>
                        <div className="text-sm text-muted-foreground">23 completed projects</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">$120,000</div>
                        <div className="text-xs text-muted-foreground">67% of revenue</div>
                      </div>
                    </li>
                    <li className="flex justify-between items-start border-b border-primary/10 pb-3">
                      <div>
                        <div className="font-semibold">FlowGuardian</div>
                        <div className="text-sm text-muted-foreground">145 new units @ $240 avg</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">$35,000</div>
                        <div className="text-xs text-muted-foreground">19% of revenue</div>
                      </div>
                    </li>
                    <li className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">LawnShift</div>
                        <div className="text-sm text-muted-foreground">Recurring subscriptions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">$25,000</div>
                        <div className="text-xs text-muted-foreground">14% of revenue</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">How 20% Profit Allocation Works</h3>

                <p>
                  <strong>Gross revenue:</strong> $180,000<br />
                  <strong>Operating expenses:</strong> $104,400 (labor, equipment, materials)<br />
                  <strong>Net profit:</strong> $75,600<br />
                  <strong>20% to TRN treasury:</strong> $15,120
                </p>

                <p>
                  This $15,120 was converted to USDC and added to treasury for buybacks and development funding.
                </p>

                <GoblinWisdomBox>
                  This is real money from real work. Not speculative future revenue or "partnerships to be announced." We dug 23 drainage systems last month and earned $180K doing it. Some of that flows to you, the token holder.
                </GoblinWisdomBox>

                <h2 id="liquidity" className="font-display text-3xl font-bold mt-12 mb-6">
                  Liquidity Analysis
                </h2>

                <p>
                  <strong>Raydium LP Pool:</strong> 400M TRN + 6,000 SOL<br />
                  <strong>Lock status:</strong> Permanently locked (cannot be removed by team)<br />
                  <strong>Liquidity depth increase:</strong> +20% from September
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Why We Increased Liquidity</h3>

                <p>
                  Deeper liquidity = Less price volatility. When someone buys or sells $10K of TRN, a deeper pool means smaller price impact. This protects both buyers and sellers.
                </p>

                <p>
                  <strong>Comparison:</strong> Most meme coins have under $50K liquidity. TRN has approximately $360K+ (at current SOL prices), making it one of the most liquid sub-$10M market cap tokens on Solana.
                </p>

                <h2 id="community" className="font-display text-3xl font-bold mt-12 mb-6">
                  Community Metrics: Beyond the Numbers
                </h2>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">FlowGuardian Installations</h3>

                <p>
                  <strong>Total deployed:</strong> 1,200 units (+30% from September)<br />
                  <strong>Average customer LTV:</strong> $850 (sensor purchase + 3-year subscription)<br />
                  <strong>Data quality:</strong> 98.7% uptime, 94.2% of sensors transmitting daily
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">LawnShift Operations</h3>

                <p>
                  <strong>Acres managed:</strong> 350 acres<br />
                  <strong>Active subscriptions:</strong> 87 properties<br />
                  <strong>Customer retention:</strong> 91% after 6 months
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">TerrainVision Beta</h3>

                <p>
                  <strong>Beta testers:</strong> 250 contractors and homeowners<br />
                  <strong>Satisfaction score:</strong> 87% (Net Promoter Score: +62)<br />
                  <strong>Properties analyzed:</strong> 1,840 scans completed
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Social Media & Community</h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Twitter:</strong> 8,500 followers (+45% MoM)</li>
                  <li><strong>Discord:</strong> 1,800 members (+50% MoM)</li>
                  <li><strong>Engagement rate:</strong> 6.2% (above industry avg of 2-3%)</li>
                </ul>

                <h2 id="development" className="font-display text-3xl font-bold mt-12 mb-6">
                  Development Updates: What We Shipped
                </h2>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">TerrainVision v0.9</h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Added reinforcement learning models for automated pump control</li>
                  <li>Improved prediction accuracy from 91.2% to 94.7%</li>
                  <li>New feature: Multi-property analysis for commercial clients</li>
                </ul>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Mobile App Launch</h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li>FlowGuardian app now available on iOS and Android</li>
                  <li>Real-time sensor data dashboard</li>
                  <li>Push alerts for heavy rain warnings</li>
                  <li>In-app TRN reward claiming</li>
                </ul>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Homebuilder Partnership</h3>

                <p>
                  Signed pilot agreement with regional homebuilder to integrate FlowGuardian sensors in 50 new construction homes. Builder earns TRN for each installation, homeowners get free sensors + 1 year monitoring.
                </p>

                <h2 id="spending" className="font-display text-3xl font-bold mt-12 mb-6">
                  What We're Spending On
                </h2>

                <p>
                  <strong>October expenses:</strong> $88,000 total
                </p>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Development (AI, app, infra)</span>
                      <span className="font-semibold">$45,000 (51%)</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Marketing (ads, content, influencers)</span>
                      <span className="font-semibold">$18,000 (20%)</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Operations (team, tools, services)</span>
                      <span className="font-semibold">$12,000 (14%)</span>
                    </li>
                    <li className="flex justify-between border-b border-primary/10 pb-2">
                      <span className="text-muted-foreground">Legal/compliance</span>
                      <span className="font-semibold">$8,000 (9%)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Miscellaneous</span>
                      <span className="font-semibold">$5,000 (6%)</span>
                    </li>
                  </ul>
                </div>

                <h2 id="december" className="font-display text-3xl font-bold mt-12 mb-6">
                  Looking Ahead: December Preview
                </h2>

                <p>
                  <strong>Expected revenue range:</strong> $170K-$190K (seasonal slowdown in construction)<br />
                  <strong>Major launches:</strong> TerrainVision v1.0 public release<br />
                  <strong>Marketing initiatives:</strong> Podcast tour, crypto media outreach<br />
                  <strong>Partnerships:</strong> Exploring integration with major home services platforms
                </p>

                <h2 id="wallets" className="font-display text-3xl font-bold mt-12 mb-6">
                  The Wallet Addresses: Full Transparency
                </h2>

                <p>
                  Verify everything yourself on Solscan:
                </p>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <ul className="space-y-4">
                    <li>
                      <div className="font-semibold mb-1">Treasury Wallet</div>
                      <a 
                        href="https://solscan.io/account/H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-mono break-all hover:underline"
                      >
                        H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu
                      </a>
                    </li>
                    <li>
                      <div className="font-semibold mb-1">Liquidity Pool</div>
                      <div className="text-sm text-muted-foreground font-mono break-all">
                        [Placeholder: Raydium LP address would go here]
                      </div>
                    </li>
                    <li>
                      <div className="font-semibold mb-1">Team Vesting</div>
                      <div className="text-sm text-muted-foreground font-mono break-all">
                        [Placeholder: Vesting contract address would go here]
                      </div>
                    </li>
                    <li>
                      <div className="font-semibold mb-1">Marketing Wallet</div>
                      <div className="text-sm text-muted-foreground font-mono break-all">
                        [Placeholder: Marketing wallet address would go here]
                      </div>
                    </li>
                  </ul>
                </div>

                <p className="text-center font-semibold mt-6">
                  <strong className="text-primary">Verify everything yourself.</strong> Don't trust, verify.
                </p>

                <h2 id="faq" className="font-display text-3xl font-bold mt-12 mb-6">
                  FAQ: Report Questions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">How do I verify these numbers?</h3>
                    <p>
                      All wallet addresses are listed above. Go to Solscan, paste the address, and see the exact holdings. For revenue verification, check Carolina Terrain's portfolio (80-120 projects annually at $3,500-15,000 avg = $1.2M+ baseline).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Why share so much detail?</h3>
                    <p>
                      Trust is earned through transparency. Crypto has a scam problem. The only way to combat it is radical openness. If we hide numbers, you should be suspicious. If we show everything, you can make informed decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">What if revenue drops in future months?</h3>
                    <p>
                      We'll report it honestly. Construction/landscaping is seasonal—December through February typically sees 30-40% lower revenue. That's why we maintain USDC reserves. Risk management is part of transparency.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Can I see past reports?</h3>
                    <p>
                      This is our inaugural report (November 2025). Future reports will be archived and accessible via /updates. We'll build a dedicated transparency hub in Q1 2026.
                    </p>
                  </div>
                </div>

                <CallToAction
                  title="Want to Understand TRN's Origin?"
                  description="Read the complete story of how two drainage contractors built a crypto ecosystem backed by real revenue and AI technology."
                  buttonText="Read Origin Story"
                  buttonLink="/blog/how-terrain-token-started"
                  variant="primary"
                />

              </div>
            </div>

            <TableOfContents headings={headings} />
          </div>

          <AuthorCard
            name="TRN Team"
            title="Transparency & Operations"
            bio="The TRN team is committed to radical transparency—publishing detailed monthly reports on financials, community metrics, and development progress. No secrets, no surprises, just facts."
            image="/terrain-mascot.png"
          />

          <RelatedArticles articles={relatedArticles} />
        </article>
      </main>

      <Footer />
    </>
  );
};

export default TransparencyReportNovember2025;
