import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sparkles, ExternalLink, Mail, FileText, Scale, Shield } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Flywheel", href: "/flywheel" },
    { label: "Products", href: "/products" },
    { label: "Proof", href: "/proof" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Pricing", href: "/pricing" },
  ],
  products: [
    { label: "Carolina Terrain", href: "/products/carolina-terrain" },
    { label: "Terrain Vision", href: "/products/terrain-vision" },
    { label: "Terrain Guard", href: "/products/terrain-guard" },
    { label: "Stormwater SCM", href: "/products/stormwater-scm" },
    { label: "Drainage Academy", href: "/products/drainage-academy" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "Contribute", href: "/contribute" },
    { label: "Press", href: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal#privacy" },
    { label: "Terms of Service", href: "/legal#terms" },
    { label: "Risk Disclosure", href: "/legal#risk" },
    { label: "Token Disclaimer", href: "/legal#token" },
  ],
};

export function InstitutionalFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl">Terrain</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Stormwater compliance ecosystem built on data integrity and transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Compliance-grade infrastructure</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products/trn"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-violet-500" />
                  TRN (Optional)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Token Disclaimer */}
        <div className="mt-12 pt-8 border-t">
          <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/10">
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">TRN Utility Credit Disclosure</p>
                <p>
                  TRN is an optional utility credit within the Terrain ecosystem. It is not an investment, 
                  has no guaranteed value, and is not required to use any platform features. TRN holders 
                  should not expect profits. Subject to market volatility. Consult a financial advisor before acquiring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Terrain. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://stormwaterscm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Stormwater SCM
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://terrainvision-ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Terrain Vision
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
