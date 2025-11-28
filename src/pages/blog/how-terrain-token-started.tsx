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
import { Calendar, User, Clock } from "lucide-react";

const HowTerrainTokenStarted = () => {
  const title = "How Terrain Token Started – From Drainage Ditches to Digital Revolution";
  const description = "Discover how two NC drainage contractors built Terrain Token (TRN)—a utility token backed by established revenue streams, AI technology, and real-world utility. No hype, just French drains and blockchain.";
  const url = "https://terraintoken.com/blog/how-terrain-token-started";
  const publishDate = "2025-11-15T09:00:00-05:00";
  const modifiedDate = "2025-11-15T09:00:00-05:00";

  const headings = [
    { id: "spark", text: "The Spark: A Drainage Ditch Epiphany", level: 2 },
    { id: "graveyard", text: "The Meme Coin Graveyard: Learning from Failures", level: 2 },
    { id: "business-model", text: "From LawnShift to Token Shift: The Business Model", level: 2 },
    { id: "goblin-factor", text: "The Goblin Factor: Why Memes Matter", level: 2 },
    { id: "technical-launch", text: "Technical Launch Details", level: 2 },
    { id: "first-100-days", text: "The First 100 Days: Metrics & Milestones", level: 2 },
    { id: "faq", text: "Frequently Asked Questions", level: 2 }
  ];

  const relatedArticles = [
    {
      slug: "why-meme-coins-need-real-world-backing",
      title: "Why Every Meme Coin Needs Real-World Backing",
      excerpt: "The BEER collapse showed us what happens when meme coins have nothing behind them. TRN is different — here's why backing matters.",
      category: "Analysis",
      date: "November 10, 2025",
      author: "TRN Team",
      readTime: "8 min"
    },
    {
      slug: "ai-powered-drainage-analysis-future",
      title: "The Future of AI-Powered Drainage Analysis",
      excerpt: "TerrainVision AI is just the beginning. Here's how we're revolutionizing the landscaping industry with machine learning.",
      category: "Technology",
      date: "November 5, 2025",
      author: "TRN Development Team",
      readTime: "12 min"
    },
    {
      slug: "transparency-report-november-2025",
      title: "TRN Transparency Report – November 2025",
      excerpt: "Our first monthly transparency report covering wallet holdings, treasury activity, and community growth metrics.",
      category: "Transparency",
      date: "November 1, 2025",
      author: "TRN Team",
      readTime: "10 min"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{title} | Terrain Token Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://terraintoken.com/og-terrain.png" />
        <meta property="og:url" content={url} />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content="Alex Purdy & Zac Hyman" />
        <meta property="article:section" content="Origin Story" />
        <meta property="article:tag" content="Terrain Token" />
        <meta property="article:tag" content="TRN" />
        <meta property="article:tag" content="Cryptocurrency" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://terraintoken.com/og-terrain.png" />
        <meta name="twitter:site" content="@carolinaterrain" />
      </Helmet>

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "image": "https://terraintoken.com/og-terrain.png",
          "author": {
            "@type": "Person",
            "name": "Alex Purdy & Zac Hyman",
            "url": "https://terraintoken.com/team"
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
          "description": description,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
          }
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://terraintoken.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://terraintoken.com/updates"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "How Terrain Token Started",
              "item": url
            }
          ]
        })}
      </script>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        
        <article className="container mx-auto px-4 max-w-5xl">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-primary/20 rounded-full text-sm font-bold text-primary">
                ORIGIN STORY
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              How Terrain Token Started – From Drainage Ditches to <span className="text-primary">Digital Revolution</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Alex Purdy & Zac Hyman</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">November 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">10 min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              When Terrain Token (TRN) launched in late 2025, it looked like just another Solana memecoin. In reality, it was the by-product of a much longer journey—one that began in the muddy trenches of Waxhaw, North Carolina.
            </p>
          </header>

          <ShareButtons title={title} description={description} url={url} />

          <div className="flex gap-8">
            <div className="flex-1 max-w-3xl">
              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                
                <h2 id="spark" className="font-display text-3xl font-bold mt-12 mb-6">
                  The Spark: A Drainage Ditch Epiphany
                </h2>

                <p>
                  Picture this: It's a humid summer afternoon in 2024. Alex Purdy is standing knee-deep in Carolina clay, installing a French drain system for a homeowner whose basement had flooded three times that year. His phone buzzes in his pocket—another notification from the crypto markets. Dogecoin just hit a new high.
                </p>

                <p>
                  "While my hands were deep in Carolina clay, my mind was in the clouds—digital clouds," Alex recalls. "I was literally digging drainage ditches by day and watching digital economies explode by night. The contrast was jarring but fascinating."
                </p>

                <p>
                  That moment crystallized something Alex had been thinking about for months: <strong>What if you could combine the energy and community of meme coins with real, measurable value?</strong> What if a token could be backed not by hype or celebrity endorsements, but by actual revenue-generating businesses solving real-world problems?
                </p>

                <GoblinWisdomBox>
                  Most people see drainage work and crypto as worlds apart. We saw them as two sides of the same coin—both about moving value from where it's not needed to where it is. Water flows downhill. So does capital... if you build the right channels.
                </GoblinWisdomBox>

                <p>
                  Zac Hyman, Alex's co-founder at Carolina Terrain, was initially skeptical. "I thought he was crazy," Zac admits. "We're contractors. We dig ditches, install hardscapes, and manage properties. What business did we have launching a cryptocurrency?"
                </p>

                <p>
                  But Alex had a compelling argument: Carolina Terrain was already generating <strong>established revenue streams</strong> through drainage projects, their LawnShift robotic mowing division, and FlowGuardian smart sensors. They weren't some anonymous dev team promising the moon. They had licenses (Licensed NC Landscape Contractor CL.1872), real equipment, actual clients, and verifiable work.
                </p>

                <h2 id="graveyard" className="font-display text-3xl font-bold mt-12 mb-6">
                  The Meme Coin Graveyard: Learning from Failures
                </h2>

                <p>
                  Before launching TRN, Alex and Zac did their homework. They studied the wreckage of failed meme coins—and there was a lot of wreckage.
                </p>

                <p>
                  <strong>The stats are brutal:</strong> According to CoinGecko, over 5.3 million meme coins launched on platforms like Pump.fun between January 2024 and January 2025. An estimated <strong>99.2% are now worth zero</strong>. Billions of dollars evaporated.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Case Study: The BEER Token Collapse</h3>

                <p>
                  Perhaps the most instructive failure was BEER token. Launched with viral memes and influencer hype, BEER rocketed to a $100 million market cap in its first week. The team promised "revolutionary utility" but never delivered specifics. Within three weeks, insider wallets dumped massive holdings, the liquidity pool was drained, and the token crashed 99.8%.
                </p>

                <p>
                  Thousands of retail investors lost life savings. The aftermath revealed that BEER had:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>No actual business or revenue</li>
                  <li>Anonymous team with no verifiable credentials</li>
                  <li>No locked liquidity or vesting schedules</li>
                  <li>Marketing budget funded by selling tokens, creating a death spiral</li>
                  <li>Zero transparency on tokenomics or fund usage</li>
                </ul>

                <p>
                  "We looked at BEER and similar disasters and made a list of what NOT to do," Alex explains. "Every decision we made with TRN was designed to avoid those pitfalls."
                </p>

                <GoblinWisdomBox>
                  We studied the corpses so we wouldn't become one. The crypto graveyard is full of projects that promised the moon but delivered nothing. TRN promises French drains—and we've already delivered thousands of them.
                </GoblinWisdomBox>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <h4 className="font-display text-xl font-bold mb-4">TRN vs. Typical Meme Coins</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/20">
                          <th className="text-left p-3">Feature</th>
                          <th className="text-left p-3">Typical Meme Coin</th>
                          <th className="text-left p-3">Terrain Token (TRN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/10">
                          <td className="p-3 font-semibold">Revenue Backing</td>
                          <td className="p-3 text-muted-foreground">❌ None</td>
                          <td className="p-3 text-primary">✅ Established revenue from real business</td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="p-3 font-semibold">Team Identity</td>
                          <td className="p-3 text-muted-foreground">❌ Anonymous or fake</td>
                          <td className="p-3 text-primary">✅ Licensed contractors, public profiles</td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="p-3 font-semibold">Utility</td>
                          <td className="p-3 text-muted-foreground">❌ Promised, never delivered</td>
                          <td className="p-3 text-primary">✅ Service discounts, AI access, governance</td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="p-3 font-semibold">Transparency</td>
                          <td className="p-3 text-muted-foreground">❌ Opaque finances</td>
                          <td className="p-3 text-primary">✅ Monthly reports, public wallets</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">Longevity</td>
                          <td className="p-3 text-muted-foreground">❌ Weeks to months</td>
                          <td className="p-3 text-primary">✅ Built for years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h2 id="business-model" className="font-display text-3xl font-bold mt-12 mb-6">
                  From LawnShift to Token Shift: The Business Model
                </h2>

                <p>
                  Understanding TRN requires understanding the ecosystem it's built on. Carolina Terrain isn't just a side hustle—it's a legitimate, growing multi-service company.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Revenue Stream #1: Core Drainage & Landscaping</h3>

                <p>
                  The foundation: French drain installation, erosion control, grading, and hardscaping. Average project value: $3,500-$15,000. With 80-120 projects annually, this generates approximately <strong>$1.2-1.5 million in revenue</strong>.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Revenue Stream #2: LawnShift Robotic Mowing</h3>

                <p>
                  Launched in 2024, LawnShift deploys commercial-grade robotic mowers for residential and commercial properties. Subscription model: $99-299/month depending on property size. With 350+ acres under management and growing, LawnShift adds <strong>$300,000-500,000 annually</strong> in recurring revenue.
                </p>

                <p>
                  The genius of LawnShift: It turns one-time clients into ongoing subscribers, creating predictable cash flow.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Revenue Stream #3: FlowGuardian Smart Sensors</h3>

                <p>
                  FlowGuardian is where Carolina Terrain enters the IoT space. These sensors monitor soil moisture, water levels, and drainage performance in real-time. Homeowners receive alerts about potential flooding, clogged drains, or irrigation issues before they become disasters.
                </p>

                <p>
                  Pricing: $240 per sensor + $9.99/month monitoring fee. With 1,200+ installations, FlowGuardian generates approximately <strong>$400,000+ annually</strong> and growing.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">The TRN Connection: Revenue → Treasury → Buybacks</h3>

                <p>
                  Here's where crypto meets Carolina clay: <strong>20% of Carolina Terrain's net profits flow into the TRN treasury</strong>. This isn't marketing fluff—it's in the smart contract.
                </p>

                <p>
                  That treasury funds:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Token buybacks:</strong> Reducing circulating supply and supporting price</li>
                  <li><strong>Community rewards:</strong> Airdrops for data contributors, referrals, and milestones</li>
                  <li><strong>Product development:</strong> Funding TerrainVision AI and future innovations</li>
                  <li><strong>Liquidity depth:</strong> Ensuring smooth trading on Raydium and other DEXs</li>
                </ul>

                <GoblinWisdomBox>
                  While other meme coins promise lambos, we promise drainage. And we've already delivered over 2,000 drainage systems. The revenue is real. The backing is real. The ditches are VERY real.
                </GoblinWisdomBox>

                <h2 id="goblin-factor" className="font-display text-3xl font-bold mt-12 mb-6">
                  The Goblin Factor: Why Memes Matter
                </h2>

                <p>
                  Despite the serious business backing, TRN embraced its meme coin roots. Enter <strong>Terro the Terrain Goblin</strong>—the mascot that became a movement.
                </p>

                <p>
                  "We needed a way to make drainage sexy," Zac laughs. "Turns out, goblins are perfect for that. They're underground creatures, they're resourceful, they hoard treasure, and they don't give a damn about being pretty. Just like good drainage work."
                </p>

                <p>
                  The community ran with it. Goblin-themed memes flooded Twitter and Discord:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>"Goblins stack drains, not just coins"</li>
                  <li>"Underground gang—literally and figuratively"</li>
                  <li>"When lambo? When your basement stops flooding."</li>
                </ul>

                <p>
                  The psychology worked. In crypto, especially with meme coins, <strong>community is everything</strong>. Memes are the language of trust. They're how people signal they're part of the tribe, that they get the joke, that they believe in the mission.
                </p>

                <p>
                  But TRN's memes had something most don't: <strong>authenticity</strong>. Every goblin meme celebrating a drainage project featured a real project—before/after photos, customer testimonials, GPS coordinates. The memes were funny because they were true.
                </p>

                <h2 id="technical-launch" className="font-display text-3xl font-bold mt-12 mb-6">
                  Technical Launch Details
                </h2>

                <p>
                  On October 1, 2025, TRN launched on Pump.fun, Solana's popular token launchpad. Initial supply: 1 billion tokens.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">Why Solana?</h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Speed:</strong> Near-instant transactions perfect for micro-rewards</li>
                  <li><strong>Low fees:</strong> Enables small token distributions without punishing gas costs</li>
                  <li><strong>Ecosystem:</strong> Strong DeFi infrastructure and growing meme coin culture</li>
                  <li><strong>Mobile-first:</strong> Phantom and other wallets make Solana accessible to non-technical users</li>
                </ul>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">The Migration to Raydium</h3>

                <p>
                  After building initial community on Pump.fun, TRN graduated to Raydium (Solana's leading DEX) in late October. This required:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating a deep liquidity pool (400M TRN + 6,000 SOL)</li>
                  <li>Permanently locking liquidity to prevent rug pulls</li>
                  <li>Implementing token vesting for team allocations (100M TRN locked 12 months)</li>
                  <li>Setting up multi-sig wallet controls (3-of-5 signatures required for treasury moves)</li>
                </ul>

                <h2 id="first-100-days" className="font-display text-3xl font-bold mt-12 mb-6">
                  The First 100 Days: Metrics & Milestones
                </h2>

                <p>
                  Numbers don't lie. Here's how TRN performed in its first three months:
                </p>

                <div className="my-8 p-6 bg-card/40 rounded-lg border border-primary/20">
                  <h4 className="font-display text-xl font-bold mb-4">Growth Timeline</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Day 1:</span>
                      <span>Launch on Pump.fun → 200 holders by EOD</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Week 1:</span>
                      <span>First FlowGuardian integration → Holders earn TRN for sensor data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Week 2:</span>
                      <span>500 holders milestone → First community airdrop (50,000 TRN distributed)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Month 1:</span>
                      <span>1,000 holders → Migration to Raydium announced</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Month 2:</span>
                      <span>Raydium launch → Liquidity locked → 1,500 holders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-primary">Month 3:</span>
                      <span>TerrainVision AI beta launch → 2,100+ holders</span>
                    </li>
                  </ul>
                </div>

                <p>
                  <strong>Retention rate:</strong> 87% month-over-month. For context, most meme coins see 50-70% churn as speculators rotate to the next shiny object. TRN's high retention reflects the sticky utility—holders aren't just gambling, they're participating in a real ecosystem.
                </p>

                <h3 className="font-display text-2xl font-bold mt-8 mb-4">What We Got Wrong</h3>

                <p>
                  Transparency means admitting mistakes. Here's what didn't go as planned:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Initial communication gaps:</strong> We underestimated how much education was needed. Many holders didn't understand the revenue-to-treasury model at first.</li>
                  <li><strong>Technical bugs:</strong> The FlowGuardian reward distribution had issues in week 2, causing a 3-day delay in token distributions.</li>
                  <li><strong>Market timing:</strong> Launching during a broader crypto downturn meant less organic discovery than anticipated.</li>
                </ul>

                <p>
                  But we learned, adapted, and communicated through each hiccup. The community appreciated the honesty.
                </p>

                <h2 id="faq" className="font-display text-3xl font-bold mt-12 mb-6">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Who created Terrain Token?</h3>
                    <p>
                      Alex Purdy (CEO & Creator) and Zac Hyman (COO) are the founders. Alex is a Licensed NC Landscape Contractor (CL.1872), NDS Certified Drainage Contractor, and the architect behind TRN's digital ecosystem including TerrainVision AI. Zac oversees daily operations at Carolina Terrain and ensures field execution aligns with the token utility model.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Is this a rug pull?</h3>
                    <p>
                      No. Rug pulls happen when anonymous teams drain liquidity and disappear. TRN's liquidity is permanently locked on Raydium. Team tokens are vested over 12 months. We're real people with real businesses, licenses, and reputations at stake. You can verify our contractor license with the North Carolina Licensing Board.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">How can a drainage company run a token?</h3>
                    <p>
                      The same way any business can tokenize its ecosystem. We're not trying to be a tech startup posing as a business—we're a real business using crypto to reward community participation and fund innovation. Our competitive advantage is that we actually generate revenue, unlike 99% of meme coins.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">What makes TRN different from other meme coins?</h3>
                    <p>
                      Three things: (1) Real revenue backing from an established business, (2) Tangible utility through service discounts, AI access, and data rewards, (3) Radical transparency with monthly reports and public wallet addresses. Most meme coins have none of these.
                    </p>
                  </div>
                </div>

                <CallToAction
                  title="Ready to Dig Deeper?"
                  description="Read our comprehensive whitepaper to understand TRN's tokenomics, roadmap, and vision for the future of utility-backed meme coins."
                  buttonText="Read Full Whitepaper"
                  buttonLink="/whitepaper"
                  variant="primary"
                />

              </div>
            </div>

            <TableOfContents headings={headings} />
          </div>

          <AuthorCard
            name="Alex Purdy & Zac Hyman"
            title="Founders of Terrain Token"
            bio="Licensed NC drainage contractors who decided to merge meme culture with real-world utility. Alex (CEO) created the TerrainVision AI ecosystem, while Zac (COO) oversees field operations. Together they're proving that crypto can be backed by actual work, not just hype."
            image="/founders-together.jpg"
            linkedin="https://www.linkedin.com/in/jamesapurdy/"
          />

          <RelatedArticles articles={relatedArticles} />
        </article>
      </main>

      <Footer />
    </>
  );
};

export default HowTerrainTokenStarted;
