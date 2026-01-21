import { Users, Twitter, Shield, ExternalLink, Check, Copy, Hexagon, Database, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
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
    <footer className="border-t border-slate-800 bg-slate-950">
      {/* Stats Bar */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={<Hexagon className="h-4 w-4 text-safety-green" />}
              label="Total Supply"
              value={isLoading ? null : (supply?.formatted.total || '1B TRN')}
            />
            <StatCard 
              icon={<Database className="h-4 w-4 text-solana-purple" />}
              label="Circulating"
              value={isLoading ? null : (supply?.formatted.circulating || '—')}
            />
            <StatCard 
              icon={<Shield className="h-4 w-4 text-safety-green" />}
              label="Dev Holdings"
              value="~1%"
            />
            <StatCard 
              icon={<Flame className="h-4 w-4 text-orange-500" />}
              label="Liquidity"
              value="Community"
            />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/trn-coin.png" alt="TRN" className="h-8 w-8" />
              <span className="font-mono font-bold text-lg">Terrain Token</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 font-mono">
              Industrial DePIN for Earth's critical infrastructure
            </p>
            
            {/* Contract Address */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Contract Address</p>
              <button
                onClick={handleCopyContract}
                className="font-mono text-xs text-foreground/70 hover:text-safety-green transition-colors flex items-center gap-2"
              >
                {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
                {copied ? (
                  <Check className="w-3 h-3 text-safety-green" />
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
                href="https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-safety-green transition-colors"
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
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} Terrain Token • All rights reserved
            </p>
            <Badge variant="outline" className="text-xs font-mono border-amber-500/30 text-amber-500">
              ⚠️ TRN is an optional utility credit, not an investment
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
            TRN is not required to use Terrain services. All platforms function without TRN. 
            Cryptocurrency involves risk. Not financial advice.
          </p>
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
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
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
      className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-muted-foreground hover:text-safety-green hover:border-safety-green/50 transition-colors"
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
              className="text-sm text-muted-foreground hover:text-safety-green transition-colors font-mono"
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
