import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import trnCoin from "@/assets/trn-coin.png";

const DesktopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "how-to-buy", label: "Mint" },
    { id: "roadmap", label: "Roadmap" },
    { id: "tokenomics", label: "Token Info" },
    { id: "community", label: "Community" },
  ];

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-in-down ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 group"
          >
            <img src={trnCoin} alt="TRN" className="h-8 w-8 animate-float" />
            <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              TRN
            </span>
          </button>

          {/* Center Nav */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
            <button
              className="px-4 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
              disabled
            >
              AI <span className="text-xs ml-1">(Soon)</span>
            </button>
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="font-display font-semibold animate-glow-pulse"
              asChild
            >
              <a
                href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mint on Pump.fun
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://t.me/terraintoken"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
