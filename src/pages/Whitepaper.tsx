import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Copy, Check, ExternalLink, AlertTriangle, ShieldCheck, CheckCircle2, Hammer } from "lucide-react";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";
import { cn } from "@/lib/utils";

const CONTRACT = TRN_MINT_ADDRESS;
const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT}`;
const LAST_UPDATED = "May 6, 2026";
const VERSION = "3.0";

const TOC = [
  { id: "abstract", num: "1", title: "Abstract" },
  { id: "why-trn-exists", num: "2", title: "Why TRN Exists" },
  { id: "token-mechanics", num: "3", title: "Token Mechanics" },
  { id: "flywheel", num: "4", title: "Ecosystem Flywheel" },
  { id: "live-today", num: "5", title: "What's Live Today" },
  { id: "utility-burn", num: "6", title: "Utility & Burn" },
  { id: "directional-research", num: "7", title: "Directional Research" },
  { id: "risk-disclosures", num: "8", title: "Risk Disclosures" },
  { id: "verification", num: "9", title: "Verification & Resources" },
  { id: "appendix", num: "10", title: "Appendix" },
];

function ContractAddress({ withLink = false, className }: { withLink?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const copy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    toast({ title: "Contract address copied" });
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs md:text-sm bg-primary/5 border border-primary/20 rounded px-2 py-0.5 break-all", className)}>
      {withLink ? (
        <a href={SOLSCAN_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{CONTRACT}</a>
      ) : (
        <span className="text-foreground/90">{CONTRACT}</span>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy contract address"
        className="text-muted-foreground hover:text-primary transition-colors print:hidden"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
}

function StatusPill({ status }: { status: "live" | "building" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-primary font-mono text-xs uppercase tracking-wider">
        <CheckCircle2 className="h-4 w-4" /> Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-amber-500 font-mono text-xs uppercase tracking-wider">
      <Hammer className="h-4 w-4" /> In development
    </span>
  );
}

function H2({ id, num, children }: { id: string; num: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl md:text-3xl font-bold mt-12 mb-4 scroll-mt-32 flex items-baseline gap-3">
      <span className="font-mono text-primary text-base md:text-lg">{num}.</span>
      <span>{children}</span>
    </h2>
  );
}
function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h3 id={id} className="font-display text-lg md:text-xl font-semibold mt-8 mb-3 scroll-mt-32">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm md:text-base leading-relaxed text-foreground/85 mb-4">{children}</p>;
}

const Whitepaper = () => {
  const { trackWhitepaperDownload } = useFeatureAnalytics();
  const [activeId, setActiveId] = useState<string>(TOC[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    TOC.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Whitepaper — $TRN | The Incentive Layer of the Terrain Ecosystem</title>
        <meta
          name="description"
          content={`The Terrain Token v3 whitepaper. Solana Token-2022, 1.25B fixed supply, mint revoked, LP burned. An incentive layer tied to a licensed NC drainage contractor — not an investment, not a security. Contract: ${CONTRACT}.`}
        />
        <link rel="canonical" href="https://terraintoken.com/whitepaper" />
      </Helmet>

      <ScrollProgress />
      <div className="print:hidden">
        <DesktopNav />
      </div>

      <main id="main-content" className="min-h-screen bg-background pt-28 md:pt-32 pb-20 print:pt-0">
        <div className="print:hidden">
          <BackToHome />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <header className="mb-10 max-w-4xl">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-primary mb-4">
              Terrain Ecosystem · Whitepaper
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4">
              $TRN — The Incentive Layer of the <span className="text-primary">Terrain Ecosystem</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground italic mb-6">Proof over Promises.</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-mono mb-6">
              <span><span className="text-foreground font-semibold">Version {VERSION}</span></span>
              <span aria-hidden>·</span>
              <span>Last updated: <span className="text-foreground">{LAST_UPDATED}</span></span>
              <span aria-hidden>·</span>
              <span>Standard: Solana Token-2022</span>
            </div>
            <div className="flex flex-wrap gap-3 print:hidden">
              <Button asChild>
                <a
                  href="/Terrain_Token_TRN_Whitepaper.pdf"
                  download
                  onClick={() => trackWhitepaperDownload?.('download', 'whitepaper-page')}
                >
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={SOLSCAN_URL} target="_blank" rel="noopener noreferrer">
                  Verify on Solscan <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </header>

          {/* Two-column layout */}
          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10">
            <article className="prose-none max-w-3xl">
              {/* Proof callout */}
              <GlassCard className="p-5 md:p-6 mb-6 border-l-4 border-l-primary">
                <p className="font-semibold mb-1 text-foreground">Proof over Promises.</p>
                <p className="text-sm text-foreground/80 m-0">
                  Every claim in this document is grounded in either on-chain verifiable reality, licensed real-world
                  operations, or explicitly labeled as exploration / directional research. Nothing is committed beyond
                  what is currently deployed or what an operating contractor has the licensure to deliver.
                </p>
              </GlassCard>

              {/* Identity strip */}
              <GlassCard className="p-5 md:p-6 mb-6">
                <dl className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-2 text-sm">
                  <dt className="text-muted-foreground font-mono">Contract</dt>
                  <dd className="m-0"><ContractAddress withLink /></dd>
                  <dt className="text-muted-foreground font-mono">Standard</dt>
                  <dd className="m-0">Solana Token-2022 (Token Extensions)</dd>
                  <dt className="text-muted-foreground font-mono">Operator</dt>
                  <dd className="m-0">Carolina Terrain LLC · NC License #CL.1872 · Waxhaw, NC</dd>
                </dl>
              </GlassCard>

              {/* Naming collision */}
              <div className="mb-10 rounded-lg border-2 border-amber-500/50 bg-amber-500/10 p-5 md:p-6 flex gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-200 mb-1">Naming-collision notice</p>
                  <p className="text-sm text-foreground/85 m-0">
                    A separate, unrelated Solana token also trades under the symbol "TRN" (Trardun). The contract
                    address above is the only authoritative identifier for Terrain Token. Always verify by contract
                    address before any transaction. Symbol alone is insufficient.
                  </p>
                </div>
              </div>

              {/* TOC (mobile/inline) */}
              <GlassCard className="p-5 md:p-6 mb-12 lg:hidden">
                <p className="font-display text-lg font-semibold mb-3">Table of Contents</p>
                <ol className="space-y-1.5 text-sm">
                  {TOC.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-foreground/80 hover:text-primary transition-colors">
                        <span className="font-mono text-primary mr-2">{s.num}.</span>{s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </GlassCard>

              {/* 1. Abstract */}
              <H2 id="abstract" num="1">Abstract</H2>
              <P>
                $TRN is the incentive layer of the Terrain Ecosystem — a vertically integrated stormwater
                infrastructure protocol that merges licensed contracting work with on-chain verifiability. Backed by
                Carolina Terrain LLC, an NC-licensed (CL.1872) drainage contractor based in Waxhaw, NC, the ecosystem
                operates a six-stage flywheel — <strong>Plan, Build, Monitor, Comply, Train, Incentivize</strong> —
                with $TRN aligning rewards to verifiable physical actions and contributed terrain data.
              </P>
              <P>
                The token is deployed as a fixed-supply Solana Token-2022 with the native interest-bearing extension
                enabled (1500 BPS) — a technical property of the mint, not a promised yield or return. There is no
                mint authority, no presale, no VC allocation, and no ability for the operating team to mint additional
                supply. $TRN is a utility/incentive token. It is not an investment and not a security.
              </P>
              <P>
                This document describes the token mechanics, the ecosystem context, current operational state,
                long-range research directions (explicitly non-committed), risk disclosures, and verification
                procedures. It is intentionally tight. The team has consistently chosen to communicate less rather
                than promise more.
              </P>

              {/* 2. Why TRN Exists */}
              <H2 id="why-trn-exists" num="2">Why TRN Exists</H2>
              <P>
                The stormwater infrastructure sector has structural problems: assets are installed and forgotten,
                maintenance is reactive rather than proactive, compliance documentation is fragmented across paper
                trails and disparate systems, and accountability gaps cost communities money and create environmental
                harm. These problems are not solved by software alone, and they are not solved by crypto alone. They
                are solved by combining licensed field work with verifiable digital records.
              </P>
              <P>
                Terrain's thesis: <strong>align economic incentives with the actual work.</strong> Reward those who
                plan, install, monitor, document, and maintain — not those who speculate. Use the chain as a
                transparent, auditable layer; use the field crew as the source of ground truth. The token exists to
                circulate inside that loop, not as the loop's purpose.
              </P>
              <P>
                $TRN is not a memecoin. $TRN is not an investment. $TRN is the unit of account that ties this
                ecosystem together — a way to incentivize verified field actions, contributed terrain data, and
                community participation, while remaining fully transparent on-chain about what the token can and
                cannot do. Anyone holding $TRN with an expectation of profit is misunderstanding the project. Anyone
                holding $TRN as an aligned participant in a stormwater infrastructure protocol that happens to use a
                token for incentive coordination is reading this whitepaper correctly.
              </P>

              {/* 3. Token Mechanics */}
              <H2 id="token-mechanics" num="3">Token Mechanics — Fully Verifiable</H2>

              <H3>3.1 Token Identity</H3>
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 mb-6">
                <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                  <tbody>
                    {[
                      ["Name", "Terrain Token"],
                      ["Symbol", "$TRN"],
                      ["Blockchain", "Solana"],
                      ["Standard", "Token-2022 (Token Extensions)"],
                      ["Contract Address", <ContractAddress key="c" />],
                      ["Total Supply", "1,250,000,000 (fixed)"],
                      ["Mint Authority", "Revoked (no future minting possible)"],
                      ["Liquidity Pool", "Burned (LP cannot be withdrawn)"],
                      ["Metadata", "Locked"],
                      ["Founder Allocation", "Time-locked"],
                      ["Interest-Bearing Extension", "Enabled at 1500 BPS — technical property of the mint, not a promised yield or return"],
                      [
                        "Verification",
                        <a key="v" href={SOLSCAN_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                          solscan.io/token/{CONTRACT}
                        </a>,
                      ],
                    ].map(([k, v], i) => (
                      <tr key={String(k)} className={i % 2 ? "bg-muted/20" : ""}>
                        <th scope="row" className="text-left font-semibold text-foreground/90 px-4 py-2.5 border-b border-border align-top whitespace-nowrap w-1/3">{k}</th>
                        <td className="px-4 py-2.5 border-b border-border align-top">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <H3>3.2 Why Fixed Supply</H3>
              <P>
                There will never be more than 1,250,000,000 $TRN. The mint authority was revoked at deployment, which
                means no entity — not the founders, not the community, not future smart contracts — can ever mint
                additional tokens. This eliminates inflation risk by design and removes the most common vector by
                which token values are diluted in early-stage projects.
              </P>

              <H3>3.3 How the Interest-Bearing Extension Works</H3>
              <P>
                The mint uses the Token-2022 <strong>interest-bearing extension</strong> — a native on-chain
                mechanism, not a staking contract, not an emissions schedule, not a reward pool. This is a technical
                property of the mint, not a promise of yield, profit, or return. $TRN is a utility/incentive token,
                not an investment and not a security.
              </P>
              <P>This matters because:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>No dilution to non-stakers.</strong> Yield is paid in updated token amounts on the same supply, not minted from a separate pool.</li>
                <li><strong>No unlock cliff or vesting wall.</strong> Yield accrues continuously.</li>
                <li><strong>No claim transactions.</strong> Yield is reflected in account balances natively.</li>
                <li><strong>No staking contract risk.</strong> There is no third-party contract holding tokens hostage; yield is a property of the mint itself.</li>
              </ul>
              <P>This is the lowest-friction yield mechanism available on Solana, and it is fully verifiable on Solscan.</P>

              <H3>3.4 What "LP Burned" Means in Practice</H3>
              <P>The liquidity provider tokens — which represent ownership of the TRN/SOL liquidity pool — were destroyed at deployment. This means:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>The protocol cannot rug-pull the liquidity.</strong> No one holds the keys to the LP, including the founders.</li>
                <li><strong>Liquidity is permanent.</strong> The pool cannot be withdrawn, only traded into.</li>
                <li><strong>Verifiable on-chain.</strong> The LP wallet address is publicly known and the burn transaction is permanent.</li>
              </ul>
              <P>
                This is one of several deliberate steps to remove discretion from the operating team. The fewer
                levers the team controls, the fewer ways the project can deviate from the on-chain reality stated in
                this document.
              </P>

              <H3>3.5 Founder Allocation: Time-Locked</H3>
              <P>
                The founder allocation is held in a time-locked account. This is verifiable on-chain. The lock
                prevents any concentrated team selling pressure during the window when such selling would be most
                damaging to community participants.
              </P>

              <H3>3.6 The Naming Collision — Read This Carefully</H3>
              <P>
                A separate, unrelated Solana token also trades under the symbol "TRN" (Trardun).{" "}
                <strong>This is not the Terrain Token.</strong> Anyone purchasing or transferring tokens believing
                they are participating in the Terrain Ecosystem must verify the contract address{" "}
                <ContractAddress />. The symbol alone is insufficient. Always verify by contract address.
              </P>
              <P>
                Carolina Terrain LLC is not responsible for losses caused by transactions involving incorrect
                contract addresses, regardless of the symbol displayed.
              </P>

              {/* 4. Flywheel */}
              <H2 id="flywheel" num="4">The Terrain Ecosystem Flywheel</H2>
              <P>
                $TRN sits inside a six-stage operational loop. Each stage is a real component with a real status.
                Stages are listed with their current operational reality, not their aspirational reach.
              </P>

              {[
                {
                  emoji: "🧱", stage: "Plan", name: "TerrainVision AI", status: "live" as const,
                  url: "https://terrainvision-ai.com", urlLabel: "terrainvision-ai.com",
                  body: "AI-powered site analysis. Takes drone imagery or photos, returns evidence-ready scope packages including identified drainage problem areas, recommended interventions, and asset measurements where extractable from imagery. Built by Carolina Terrain to scope sites faster and more consistently — modeled on real installs in NC clay soils, not abstract data.",
                },
                {
                  emoji: "🚜", stage: "Build", name: "Carolina Terrain LLC", status: "live" as const,
                  url: "https://www.carolinaterrain.com/", urlLabel: "www.carolinaterrain.com",
                  body: "The licensed (NC #CL.1872) drainage and stormwater contractor. Real installs in NC clay soils — French drains, catch basins, retention ponds, swales, grading, hardscaping, landscape lighting, pressure washing, and the Carolina VIP Premier maintenance package. NDS-certified for drainage. Keystone-authorized for retaining walls. Twenty-mile service radius from Waxhaw covering Marvin, Weddington, Mineral Springs, Indian Trail, Matthews, Ballantyne, South Charlotte, Pineville, and Fort Mill (SC). This is the \"ground truth\" leg of the flywheel. The contracting business operates whether or not the token does.",
                },
                {
                  emoji: "🏔️", stage: "Monitor", name: "Terrain Guard", status: "building" as const,
                  body: "Immutable asset logging on the Internet Computer Protocol (ICP). Inspection records, maintenance history, and asset state are stored on tamper-evident infrastructure. Once recorded, an asset's history cannot be altered by the operating team, future contractors, or anyone else. When a regulator, board, or auditor asks for proof, the proof is verifiable.",
                  statusNote: "Core functionality operational for internal use and select pilot clients; public-access hardening in progress.",
                },
                {
                  emoji: "⛓️", stage: "Comply", name: "Stormwater SCM", status: "live" as const,
                  url: "https://stormwaterscm.com", urlLabel: "stormwaterscm.com",
                  body: "Automated regulatory reporting and compliance documentation for HOAs, property managers, and municipalities. SCM (Stormwater Control Measure) inspection scheduling, deficiency reports, audit packets. Property Memory Defense framing for boards under MS4 obligations and NCDEQ permit conditions.",
                },
                {
                  emoji: "📚", stage: "Train", name: "Drainage Academy", status: "building" as const,
                  body: "Standardized training and certification for drainage and stormwater work. Course modules in production covering installation guides (French drain installation, catch basin sizing), compliance basics (SCM types, NCDEQ standards), and field certification pathways for operators.",
                  statusNote: "Content production phase. Several course modules in draft with subject matter expert review underway.",
                },
                {
                  emoji: "🪙", stage: "Incentivize", name: "$TRN", status: "live" as const,
                  body: "The economic layer. Rewards verified field actions and contributed terrain data, reduces friction for premium feature access (e.g., advanced TerrainVision reports), and provides a transparent unit of account for community participation. The token does not gate essential compliance functionality — no licensed work is held behind a token paywall.",
                  statusNote: "This document.",
                },
              ].map((s) => (
                <GlassCard key={s.stage} className="p-5 md:p-6 mb-4">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-2xl" aria-hidden>{s.emoji}</span>
                    <h3 className="font-display text-lg md:text-xl font-semibold m-0">
                      {s.stage} — {s.name}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/85 mb-3">{s.body}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <StatusPill status={s.status} />
                    {s.statusNote && <span className="text-muted-foreground">{s.statusNote}</span>}
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        {s.urlLabel} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}

              <H3>Why the Order Matters</H3>
              <P>
                The flywheel is closed-loop: physical work feeds verifiable data; verifiable data feeds compliance
                documentation; compliance documentation feeds operator credibility; operator credibility feeds new
                work; new work earns and circulates rewards. The ecosystem is intentionally building from physical
                reality outward, not from speculation inward.
              </P>

              {/* 5. Live Today */}
              <H2 id="live-today" num="5">What's Live Today</H2>
              <P>
                A snapshot of operational state as of the date stamped on this document. For real-time status, see
                the "What's Live Today" section on terraintoken.com — the source of which is updated independently
                of whitepaper revisions.
              </P>
              <GlassCard className="p-5 md:p-6 mb-4">
                <ul className="space-y-2.5">
                  {[
                    { s: "live" as const, t: "Token deployed on Solana Token-2022. Contract verified, mint revoked, LP burned." },
                    { s: "live" as const, t: "Token-2022 interest-bearing extension enabled on the mint (1500 BPS)." },
                    { s: "live" as const, t: "Carolina Terrain LLC operating as licensed contractor (NC #CL.1872)." },
                    { s: "live" as const, t: "TerrainVision AI live for site analysis." },
                    { s: "live" as const, t: "Stormwater SCM live for compliance documentation." },
                    { s: "building" as const, t: "Terrain Guard (ICP-based asset registry) — in development." },
                    { s: "building" as const, t: "Drainage Academy — content production phase." },
                    { s: "building" as const, t: "Terrain Nexus API — unifying backend layer, scaffolded." },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                      {item.s === "live" ? (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <Hammer className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-foreground/90">{item.t}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <P>
                The team has consistently chosen to ship verifiable functionality before publishing it as live.
                Items marked 🔨 are in active development; items marked ✅ are operational and verifiable today.
              </P>

              {/* 6. Utility & Burn */}
              <H2 id="utility-burn" num="6">Token Utility & Burn Mechanics</H2>

              <H3>6.1 What $TRN Can Be Used For</H3>
              <P>Within the Terrain Ecosystem, $TRN supports several utility paths. None is gated behind speculation; each follows from real ecosystem use.</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>Premium feature access.</strong> Certain advanced or value-added ecosystem features may be unlocked using $TRN. For example, a basic TerrainVision analysis is available without token use; a more detailed AI-generated scope package may use $TRN for access. Essential compliance functions are never paywalled by the token.</li>
                <li><strong>Verified action rewards.</strong> Contributors who supply verifiable terrain data or complete verifiable field actions may receive $TRN as a coordination reward, structured to encourage real participation rather than speculation.</li>
                <li><strong>Community participation signaling.</strong> Holding and using $TRN can serve as a soft signal of ecosystem participation, subject to all the disclaimers in Section 8.</li>
              </ul>

              <H3>6.2 Automated Burn on Usage</H3>
              <P>
                A small amount of $TRN is automatically burned when certain ecosystem tools are used (for example,
                when an advanced TerrainVision analysis is processed). This couples token scarcity to real ecosystem
                usage rather than to market speculation. The burn rates are kept minimal so they do not create
                friction for users; the goal is alignment, not extraction.
              </P>

              <H3>6.3 What $TRN Is Not</H3>
              <P>
                $TRN is not a security. $TRN is not a profit-sharing instrument. $TRN does not entitle its holder to
                dividends, equity, governance over Carolina Terrain LLC, or any other rights beyond those native to
                a Solana Token-2022 account. Holding $TRN is not an investment in Carolina Terrain LLC.
              </P>

              {/* 7. Directional Research */}
              <H2 id="directional-research" num="7">Directional Research, Not Commitment</H2>
              <P>
                The directions below describe research and exploration paths the team has identified as potentially
                valuable to the Terrain Ecosystem. <strong>They are not committed milestones, not promises of
                delivery, and not guarantees of timeline or feasibility.</strong> Decisions about which directions
                to pursue — if any — will be made based on community input, operator capacity, regulatory
                environment, and on-chain reality at the time. Treat all forward-looking content in this section as
                exploration, not obligation.
              </P>

              <H3>7.1 Long-Range Research Direction (2027+)</H3>
              <P>
                Deeper integration between Terrain Guard's immutable asset registry and external systems used by
                municipalities and large property managers — specifically GIS platforms, work-order systems, and MS4
                permit reporting workflows. Goal: reduce the friction of submitting verifiable maintenance evidence
                to regulators.
              </P>
              <P>This is gated by regulator engagement, partner municipalities being willing to integrate, and the development of stable export formats. None of these are committed.</P>

              <H3>7.2 Long-Range Research Direction (2028+)</H3>
              <P>
                Exploration of how Terrain's verifiable maintenance record could intersect with insurance and
                reinsurance underwriting — particularly D&amp;O liability for HOA boards and flood-related property
                insurance premiums. Communities with immutable, third-party-verifiable compliance records may
                eventually be candidates for premium reductions or favorable D&amp;O policy terms.
              </P>
              <P>
                This direction is <strong>highly aspirational and underwriter-dependent.</strong> It is listed only
                as research interest. No insurance partnerships exist. No premium reduction commitments exist or are
                implied.
              </P>

              <H3>7.3 Environmental Impact Quantification</H3>
              <P>
                Methodologies to quantify environmental benefits of installed stormwater infrastructure — runoff
                volume mitigated, pollutant reduction, groundwater recharge contribution. Potential future
                intersection with environmental markets if methodology becomes credible and external validation is
                achieved.
              </P>
              <P>Heavy research lift. Currently unscoped. Listed only as a research interest.</P>

              <H3>7.4 Decentralized Field Network</H3>
              <P>
                Long-range exploration of how third-party contractors might use Terrain Ecosystem tools
                (TerrainVision, Stormwater SCM) for their own clients while contributing data and earning rewards.
                This would require a substantially different operational and governance structure than current
                state, including (but not limited to) contractor verification, quality standards, and dispute
                resolution mechanisms.
              </P>
              <P>Not on the immediate path. Listed for completeness.</P>

              <H3>7.5 The Terrain Nexus API</H3>
              <P>
                A unifying backend layer that would connect the currently-siloed ecosystem applications under a
                shared authentication and data pipeline. Scaffolded but currently paused under cost-control posture.
                Will resume when operational priorities allow.
              </P>

              {/* 8. Risk Disclosures */}
              <H2 id="risk-disclosures" num="8">Risk Disclosures</H2>

              <H3>8.1 Token Risk</H3>
              <P>
                $TRN is not an investment. Holding $TRN does not entitle the holder to profits, dividends, equity,
                or any rights other than those native to a Solana Token-2022 account. The token's market price, if
                any, is determined by open-market participants and is volatile. There is no guarantee of liquidity,
                listing, or future utility beyond what is implemented at any given time.
              </P>
              <p className="font-semibold text-amber-500 mb-4">Do not participate with money you cannot afford to lose.</p>

              <H3>8.2 Contract Verification Responsibility</H3>
              <P>
                Anyone interacting with the Terrain Ecosystem at the token layer is responsible for verifying the
                contract address <ContractAddress /> before any transaction. The naming collision with Trardun (an
                unrelated TRN token on Solana) means the symbol alone cannot be trusted. Carolina Terrain LLC is not
                responsible for losses caused by transactions to or from incorrect contract addresses.
              </P>

              <H3>8.3 No Guarantee of Future Development</H3>
              <P>
                While the team intends to continue building the ecosystem as described, no roadmap item — including
                those marked as "in progress" — is guaranteed to ship. Cost-control phases, regulatory developments,
                technical infeasibility, and community direction may delay or cancel any planned work. Anything
                labeled "directional research" or "long-range" should be considered exploratory and non-binding.
              </P>

              <H3>8.4 Operating Entity</H3>
              <P>
                The Terrain Ecosystem is operated by Carolina Terrain LLC, a North Carolina limited liability
                company (NC License #CL.1872). The operating entity is responsible for the licensed field work and
                the operational infrastructure of the ecosystem. <strong>The token itself is a permissionless Solana
                asset and is not a security, share, or financial instrument issued by the operating entity.</strong>{" "}
                Carolina Terrain LLC has not registered $TRN as a security with any regulator and does not consider
                it to be one; this position has not been validated by any regulator and may be subject to challenge.
              </P>

              <H3>8.5 Community Communications</H3>
              <P>
                Only information disseminated through official channels — the official websites listed in Section 9,
                and verified social accounts — should be considered reliable. Third-party statements, influencers, or
                rumors are not endorsed by the project team and should be treated with appropriate skepticism. If a
                claim about $TRN's future utility or value seems too good to be true, it almost certainly is.
              </P>

              <H3>8.6 No Financial Advice</H3>
              <P>
                This document is not financial advice. It is not a solicitation to purchase any token, security, or
                financial instrument. Readers should consult qualified legal, tax, and financial advisors before
                making any decisions related to the Terrain Ecosystem or $TRN.
              </P>

              <H3>8.7 Forward-Looking Statements</H3>
              <P>
                Statements in this document about future plans, directions, or possibilities are forward-looking
                statements and are subject to risks and uncertainties. Actual outcomes may differ materially from
                those described. The team makes no representation that any forward-looking statement will be
                realized.
              </P>

              <H3>8.8 Token Loss Risk</H3>
              <P>
                Tokens held in self-custody wallets are the responsibility of the wallet holder. Lost private keys,
                phishing attacks, smart-contract interactions with malicious dApps, and other self-custody risks are
                outside the operating team's control.
              </P>

              {/* 9. Verification & Resources */}
              <H2 id="verification" num="9">Verification &amp; Resources</H2>

              <H3>9.1 On-Chain Verification</H3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li>
                  <strong>Solscan token page:</strong>{" "}
                  <a href={SOLSCAN_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                    solscan.io/token/{CONTRACT}
                  </a>
                </li>
                <li>
                  <strong>Solana Explorer:</strong>{" "}
                  <a href={`https://explorer.solana.com/address/${CONTRACT}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                    explorer.solana.com/address/{CONTRACT}
                  </a>
                </li>
                <li><strong>Verify on-chain that:</strong> mint authority is disabled, supply is 1,250,000,000, Token-2022 program is in use, interest-bearing extension is enabled.</li>
              </ul>

              <H3>9.2 Operating Entity Verification</H3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>Carolina Terrain LLC:</strong>{" "}
                  <a href="https://www.carolinaterrain.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.carolinaterrain.com</a>
                </li>
                <li><strong>NC License:</strong> CL.1872 (verifiable through North Carolina state contractor licensing systems)</li>
                <li><strong>Address:</strong> 1515 Waxhaw Indian Trail Rd S, Waxhaw, NC 28173, USA</li>
                <li><strong>Phone:</strong> (980) 280-7638</li>
                <li><strong>Email:</strong> <a href="mailto:info@carolinaterrain.com" className="text-primary hover:underline">info@carolinaterrain.com</a></li>
              </ul>

              <H3>9.3 Ecosystem Sites</H3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>Token:</strong> <a href="https://terraintoken.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">terraintoken.com</a></li>
                <li><strong>Plan stage:</strong> <a href="https://terrainvision-ai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">terrainvision-ai.com</a></li>
                <li><strong>Comply stage:</strong> <a href="https://stormwaterscm.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stormwaterscm.com</a></li>
                <li><strong>Build stage:</strong> <a href="https://www.carolinaterrain.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.carolinaterrain.com</a></li>
              </ul>

              <H3>9.4 Official Social</H3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>X / Twitter:</strong>{" "}
                  <a href="https://x.com/carolinaterrain" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@carolinaterrain</a>
                </li>
              </ul>
              <P>
                Other community channels may be added over time. The websites above are the canonical place to
                verify any newly announced channel before trusting it.
              </P>

              {/* 10. Appendix */}
              <H2 id="appendix" num="10">Appendix</H2>

              <H3>10.1 Document Identifier</H3>
              <ul className="list-disc pl-6 space-y-1.5 mb-4 text-sm md:text-base text-foreground/85">
                <li><strong>Title:</strong> $TRN Whitepaper — The Incentive Layer of the Terrain Ecosystem</li>
                <li><strong>Version:</strong> 3.0</li>
                <li><strong>Last Updated:</strong> {LAST_UPDATED}</li>
                <li><strong>Founder:</strong> Alex Purdy</li>
                <li><strong>Operating Entity:</strong> Carolina Terrain LLC</li>
                <li><strong>License:</strong> NC #CL.1872</li>
              </ul>

              <H3>10.2 Reader Verification Checklist</H3>
              <P>Before treating this document as authoritative, a reader should be able to confirm each of the following independently:</P>
              <ul className="space-y-2 mb-4 text-sm md:text-base text-foreground/85">
                {[
                  <>Contract address matches <ContractAddress /> on Solscan</>,
                  "Total supply equals 1,250,000,000 on Solscan",
                  "Mint authority is disabled on Solscan",
                  "Token-2022 program is in use on Solscan",
                  "Interest-bearing extension is enabled on the mint",
                  "LP burn transaction is verifiable on Solana",
                  "Carolina Terrain LLC is licensed under NC #CL.1872 (verifiable through state systems)",
                  "At least one operational ecosystem site (terrainvision-ai.com, stormwaterscm.com, or www.carolinaterrain.com) resolves correctly",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <P>If any of the above checks fail, this document should not be considered authoritative.</P>

              <H3>10.3 Versioning</H3>
              <P>
                This is whitepaper version 3.0. Prior versions described an earlier deployment of the project under
                a different token contract and standard. Material changes between versions are documented in the
                project's public communication channels. The current contract address <ContractAddress /> is the
                only address authoritative for the Terrain Token as of this version.
              </P>

              <hr className="my-10 border-border" />
              <p className="text-center text-base font-semibold text-foreground mb-2">🏔️ Proof over Promises.</p>
              <p className="text-center text-sm text-muted-foreground italic">
                This whitepaper is a living document. Material changes to ecosystem mechanics, operational state, or
                risk disclosures will be reflected in future versions. No commitment is made to the timing or content
                of those revisions.
              </p>
            </article>

            {/* Sticky desktop TOC */}
            <aside className="hidden lg:block print:hidden">
              <nav className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-auto pr-2" aria-label="Table of contents">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">On this page</p>
                <ol className="space-y-1.5 text-sm border-l border-border">
                  {TOC.map((s) => {
                    const active = activeId === s.id;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={cn(
                            "block pl-3 -ml-px border-l-2 py-1 transition-colors",
                            active
                              ? "border-primary text-primary font-semibold"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="font-mono text-xs mr-2">{s.num}.</span>{s.title}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </aside>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      {/* Print stylesheet */}
      <style>{`
        @media print {
          @page { margin: 0.75in; }
          html, body { background: #ffffff !important; color: #000000 !important; }
          main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          aside, header button, nav { display: none !important; }
          a { color: #0e7490 !important; text-decoration: none; }
          h1, h2, h3 { color: #000 !important; page-break-after: avoid; }
          h2 { page-break-before: auto; margin-top: 1.5em !important; }
          p, li { color: #111 !important; }
          .lg\\:grid { display: block !important; }
          table, figure, ul, ol { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
};

export default Whitepaper;
