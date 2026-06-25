import { Users, Twitter, Shield, ExternalLink, Check, Copy, Hexagon, Database, Flame, Radio, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

const Footer = () => {
  const contractAddress = TRN_MINT_ADDRESS;
  const { supply, isLoading } = useTokenData();
  const [copied, setCopied] = useState(false);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast.success("Contract address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const footerLinks = {
    platform: [
      { label: "Flywheel", path: "/flywheel" },
      { label: "Products", path: "/products" },
      { label: "Proof", path: "/proof" },
      { label: "Roadmap", path: "/roadmap" },
      { label: "Pricing", path: "/pricing" },
    ],
    token: [
      { label: "Token", path: "/token" },
      { label: "Ecosystem", path: "/ecosystem" },
      { label: "Whitepaper", path: "/whitepaper" },
      { label: "Transparency", path: "/transparency" },
    ],
    company: [
      { label: "About", path: "/about" },
      { label: "Team", path: "/team" },
      { label: "Press", path: "/press" },
      { label: "Blog", path: "/updates" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Risk Disclosure", path: "/risk-disclosure" },
      { label: "Token Metadata", path: "/token-metadata" },
    ],
  };

  return (
    <footer className="border-t border-border bg-background">
      {/* Stats Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={<Hexagon className="h-4 w-4 text-primary" />}
              label="Total Supply"
              value={isLoading ? null : (supply?.formatted?.total && !supply.formatted.total.includes('NaN') ? supply.formatted.total : '1.25B TRN')}
            />
            <StatCard 
              icon={<Database className="h-4 w-4 text-accent" />}
              label="Standard"
              value="Token-2022"
            />
            <StatCard 
              icon={<Shield className="h-4 w-4 text-primary" />}
              label="Mint Authority"
              value="Revoked"
            />
            <StatCard 
              icon={<Flame className="h-4 w-4 text-orange-500" />}
              label="Liquidity"
              value="LP Burned"
            />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <img src="/trn-coin.png" alt="TRN" className="h-8 w-8" />
              <div className="flex flex-col">
                <span className="font-mono font-bold text-xs text-muted-foreground uppercase tracking-widest">Terrain Ecosystem</span>
                <span className="font-mono font-bold text-lg text-primary">Terrain Token</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 font-mono">
              The Financial Protocol of the Terrain Ecosystem Intelligence Network
            </p>
            
            {/* Powered By */}
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground font-mono">
              <Radio className="h-3 w-3 text-primary" />
              <span>Powered by Terrain Vision AI</span>
            </div>
            
            {/* Contract Address */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Contract Address</p>
              <button
                onClick={handleCopyContract}
                className="font-mono text-xs text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
              >
                {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
                {copied ? (
                  <Check className="w-3 h-3 text-primary" />
                ) : (
                  <Copy className="w-3 h-3 opacity-50" />
                )}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <SocialLink href="https://discord.gg/rM8b6V5Ce" icon={<Users className="h-4 w-4" />} label="Discord" />
              <SocialLink href="https://x.com/carolinaterrain" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <a
                href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="View on Solscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <FooterLinkColumn title="Platform" links={footerLinks.platform} />
          <FooterLinkColumn title="Token" links={footerLinks.token} />
          <FooterLinkColumn title="Company" links={footerLinks.company} />
          <FooterLinkColumn title="Legal" links={footerLinks.legal} />
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} Terrain Ecosystem. All rights reserved.
            </p>
            <Badge variant="outline" className="text-xs font-mono border-amber-500/30 text-amber-500">
              ⚠️ $TRN is a utility/incentive token — not an investment, not a security
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 max-w-4xl mx-auto font-mono">
            Operated by <span className="text-foreground">Carolina Terrain LLC · NC License #CL.1872 · Waxhaw, NC</span>.
            $TRN is a utility/incentive token, not an investment or security. It carries no promise of profit, yield, or return.
            Nothing on this site is financial advice. Always verify the contract address before interacting.
          </p>
          <div className="mt-3 flex items-start gap-2 max-w-4xl mx-auto p-3 rounded-md border border-amber-500/30 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground font-mono">
              <span className="text-amber-500 font-semibold">Naming collision notice:</span> An unrelated Solana token (Trardun) also trades as "TRN".
              Always verify the contract address: <span className="text-foreground break-all">{TRN_MINT_ADDRESS}</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

function StatCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | null;
}) {
  return (
    <div className="bg-card/50 border border-border rounded-lg p-4 text-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</span>
      </div>
      {value === null ? (
        <Skeleton className="h-5 w-20 mx-auto" />
      ) : (
        <p className="font-mono text-sm font-bold text-foreground">{value}</p>
      )}
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg bg-card/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
      title={label}
    >
      {icon}
    </a>
  );
}

function FooterLinkColumn({ 
  title, 
  links 
}: { 
  title: string; 
  links: { label: string; path: string }[];
}) {
  return (
    <div>
      <h4 className="font-mono font-semibold text-sm mb-4 text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
