import { Helmet } from "react-helmet-async";
import { CheckCircle, ExternalLink, Copy, Shield, Database, Cpu } from "lucide-react";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";

const TokenMetadata = () => {
  const { toast } = useToast();

  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  const metadataUri = "https://terrainvision-ai.com/token-metadata.json";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const verificationSteps = [
    {
      icon: Database,
      title: "On-Chain Metadata",
      description: "Token metadata is stored permanently on the Solana blockchain using the Metaplex Token Metadata Program.",
      details: "This ensures wallet compatibility and proper display across all Solana applications."
    },
    {
      icon: Shield,
      title: "Immutable & Verifiable",
      description: "All metadata is cryptographically secured and publicly verifiable on-chain.",
      details: "Anyone can verify the authenticity of our token information through blockchain explorers."
    },
    {
      icon: Cpu,
      title: "Standard Compliance",
      description: "Follows Metaplex Token Metadata standards for maximum compatibility.",
      details: "Compatible with Phantom, Solflare, and all major Solana wallets and explorers."
    }
  ];

  const metadataFields = [
    { label: "Token Name", value: "Terrain Token" },
    { label: "Symbol", value: "TRN" },
    { label: "Decimals", value: "6" },
    { label: "Supply", value: "1,000,000,000 TRN" },
    { label: "Standard", value: "SPL Token (Solana)" },
    { label: "Metadata Program", value: "Metaplex Token Metadata" }
  ];

  const socialLinks = [
    { label: "Website", url: "https://terrainvision-ai.com/" },
    { label: "Twitter/X", url: "https://x.com/carolinaterrain" },
    { label: "Discord", url: "https://discord.gg/BmUmr2Kx" },
    { label: "Whitepaper", url: "https://terrainvision-ai.com/whitepaper" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Token Metadata | Terrain Token (TRN) - Verified On-Chain</title>
        <meta name="description" content="Official Terrain Token (TRN) metadata documentation. Verify our on-chain token information, social links, and Metaplex standard compliance on Solana blockchain." />
        <meta name="keywords" content="TRN token metadata, Solana token verification, Metaplex metadata, SPL token verification, on-chain verification" />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <BackToHome />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Verified On-Chain</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Token Metadata Documentation
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Official Terrain Token (TRN) metadata stored permanently on the Solana blockchain.
              Verified, transparent, and compliant with Metaplex standards.
            </p>
          </div>

          {/* Contract Address Card */}
          <GlassCard className="p-6 mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contract Address</h3>
                <code className="text-sm md:text-base font-mono text-foreground break-all">
                  {contractAddress}
                </code>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(contractAddress, "Contract address")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://solscan.io/token/${contractAddress}#metadata`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Solscan
                  </a>
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Metadata URI Card */}
          <GlassCard className="p-6 mb-12">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Metadata URI</h3>
                <code className="text-sm font-mono text-foreground break-all block">
                  {metadataUri}
                </code>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(metadataUri, "Metadata URI")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={metadataUri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View JSON
                  </a>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Verification Steps */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How We Ensure Transparency</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {verificationSteps.map((step, index) => (
              <GlassCard key={index} className="p-6">
                <step.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-3">{step.description}</p>
                <p className="text-sm text-muted-foreground/80">{step.details}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Metadata Fields */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Token Information</h2>
          
          <GlassCard className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {metadataFields.map((field, index) => (
                <div key={index} className="border-b border-border/30 pb-4 last:border-0">
                  <div className="text-sm text-muted-foreground mb-1">{field.label}</div>
                  <div className="font-medium">{field.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Verified Social Links</h2>
          
          <GlassCard className="p-8">
            <p className="text-muted-foreground mb-6 text-center">
              All social links are embedded in our on-chain metadata for maximum transparency.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-between"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How to Verify */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How to Verify Our Token</h2>
          
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-2">Visit Solscan</h3>
                  <p className="text-muted-foreground mb-3">
                    Go to our token page on Solscan and navigate to the "Metadata" tab.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://solscan.io/token/${contractAddress}#metadata`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Solscan <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-2">Check Metadata URI</h3>
                  <p className="text-muted-foreground mb-3">
                    Verify the URI points to our official metadata JSON file.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View JSON <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-2">Verify in Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Import our token in Phantom or any Solana wallet. The logo, name, and symbol should display correctly with verified metadata.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TokenMetadata;
