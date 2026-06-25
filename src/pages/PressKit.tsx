import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, FileText, Palette, Newspaper } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import trnCoin from "@/assets/trn-coin.png";
import { useTokenSupply, formatSupply } from "@/hooks/useTokenSupply";
import { Skeleton } from "@/components/ui/skeleton";

const PressKit = () => {
  const { data: supplyData, isLoading } = useTokenSupply();
  
  const brandColors = [
    { name: "Goblin Green", hex: "#00C46A", hsl: "142 76% 39%" },
    { name: "Emerald Glow", hex: "#06FF8C", hsl: "142 84% 47%" },
    { name: "Deep Soil", hex: "#0B0F12", hsl: "0 0% 4%" },
    { name: "Earth Brown", hex: "#7A5C3E", hsl: "25 50% 35%" }
  ];

  const factSheet = [
    { label: "Token Name", value: "Terrain Token" },
    { label: "Symbol", value: "TRN" },
    { label: "Blockchain", value: "Solana" },
    { 
      label: "Total Supply", 
      value: isLoading ? "..." : supplyData ? `${formatSupply(supplyData.totalSupply, supplyData.decimals)} TRN` : "—"
    },
    { label: "Contract Address", value: "Dm7FAc…wtDR8m (Token-2022)" },
    { label: "Launch Date", value: "Mid-2025" },
    { label: "Launch Platform", value: "Fair Launch (community)" },
    { label: "Operating Company", value: "Carolina Terrain LLC" },
    { label: "Company Status", value: "Active · Licensed" },
    { label: "License", value: "NC CL.1872" }
  ];

  return (
    <>
      <Helmet>
        <title>Press Kit & Media Resources | Terrain Token (TRN)</title>
        <meta name="description" content="Download Terrain Token logos, brand guidelines, whitepaper, fact sheets, and media resources. Everything journalists and creators need." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Press <span className="text-primary">Kit</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to write about Terrain Token. Logos, brand guidelines, fact sheets, and more.
            </p>
          </div>

          {/* Quick Download Section */}
          <div className="mb-16">
            <GlassCard className="p-8 bg-gradient-to-br from-primary/20 to-primary/5">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">
                📦 Quick Downloads
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button size="lg" className="font-display h-auto py-4" asChild>
                  <a href="/Terrain_Token_TRN_Whitepaper.pdf" download>
                    <FileText className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold">Whitepaper</div>
                      <div className="text-xs opacity-80">PDF • 2.1 MB</div>
                    </div>
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="font-display h-auto py-4 border-primary" asChild>
                  <a href={trnCoin} download="TRN_Logo.png">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold">Logo Pack</div>
                      <div className="text-xs opacity-80">PNG • High-Res</div>
                    </div>
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="font-display h-auto py-4 border-primary" asChild>
                  <a href={trnCoin} download="TRN_Mascot.png">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold">Mascot</div>
                      <div className="text-xs opacity-80">PNG • High-Res</div>
                    </div>
                  </a>
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Logos & Assets */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8">
              <ImageIcon className="inline w-8 h-8 mr-2 text-primary" />
              Logos & Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-8 text-center">
                <div className="bg-background/50 rounded-lg p-8 mb-4">
                  <img src={trnCoin} alt="TRN Logo" className="w-32 h-32 mx-auto" />
                </div>
                <h3 className="font-display font-bold mb-2">TRN Coin Logo</h3>
                <p className="text-sm text-muted-foreground mb-4">Primary logo • 512x512 PNG</p>
                <Button size="sm" variant="outline" asChild>
                  <a href={trnCoin} download="TRN_Logo.png">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="bg-background/50 rounded-lg p-8 mb-4">
                  <img src={trnCoin} alt="Terrain Goblin Mascot" className="w-32 h-32 mx-auto" />
                </div>
                <h3 className="font-display font-bold mb-2">Terrain Goblin</h3>
                <p className="text-sm text-muted-foreground mb-4">Official mascot • High-res PNG</p>
                <Button size="sm" variant="outline" asChild>
                  <a href={trnCoin} download="TRN_Mascot.png">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </GlassCard>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8">
              <Palette className="inline w-8 h-8 mr-2 text-primary" />
              Brand Colors
            </h2>
            <GlassCard className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {brandColors.map((color, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-full h-24 rounded-lg mb-3 border-2 border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="font-display font-bold mb-1">{color.name}</p>
                    <p className="text-xs text-muted-foreground mb-1">{color.hex}</p>
                    <p className="text-xs text-muted-foreground">HSL: {color.hsl}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Fact Sheet */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8">
              <Newspaper className="inline w-8 h-8 mr-2 text-primary" />
              Quick Facts
            </h2>
            <GlassCard className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factSheet.map((fact, index) => (
                  <div key={index} className="flex justify-between p-3 bg-background/30 rounded-lg">
                    <span className="font-semibold text-muted-foreground">{fact.label}:</span>
                    <span className="text-primary font-bold">{fact.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Boilerplate */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8">
              <FileText className="inline w-8 h-8 mr-2 text-primary" />
              Company Boilerplate
            </h2>
            <GlassCard className="p-8">
              <div className="space-y-4 text-muted-foreground">
                <p className="font-bold text-foreground">Short Version (50 words):</p>
                <p className="italic bg-background/30 p-4 rounded-lg">
                  "Terrain Token (TRN) is a Solana Token-2022 utility/incentive token powering platform access within the Terrain ecosystem. Built by Carolina Terrain LLC — a licensed NC drainage contractor — TRN connects on-chain coordination to traditional landscaping and stormwater work through AI-powered terrain analysis. $TRN is not an investment or security and carries no promise of profit, yield, or return."
                </p>

                <p className="font-bold text-foreground mt-6">Long Version (100 words):</p>
                <p className="italic bg-background/30 p-4 rounded-lg">
                  "Terrain Token (TRN) launched in 2025 as a community-driven utility/incentive token built by Carolina Terrain LLC, a North Carolina-based licensed landscaping and drainage company. Unlike typical community tokens built on speculation alone, TRN is connected to real-world services and field expertise. The project integrates Solana Token-2022 with traditional landscaping through TerrainVision AI, a contribution platform where users provide verified field data and earn TRN for verified actions. With transparent tokenomics and a commitment to community governance, TRN represents a new category of data-contribution tokens. $TRN is not an investment or security and carries no promise of profit, yield, or return."
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Media Contact */}
          <div>
            <GlassCard className="p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5">
              <h2 className="font-display text-2xl font-bold mb-4">
                Media Inquiries
              </h2>
              <p className="text-muted-foreground mb-6">
                For interviews, press releases, or additional information, please contact:
              </p>
              <div className="space-y-2">
                <p className="font-bold">Email: <a href="mailto:info@carolinaterrain.com" className="text-primary hover:underline">info@carolinaterrain.com</a></p>
                <p className="font-bold">Twitter: <a href="https://x.com/carolinaterrain" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@carolinaterrain</a></p>
                <p className="font-bold">Discord: <a href="https://discord.gg/rM8b6V5Ce" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join our Discord</a></p>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PressKit;
