import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle, ChevronDown } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavigate, useLocation } from "react-router-dom";
import trnCoin from "@/assets/trn-coin.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DesktopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const navigate = useNavigate();
  const location = useLocation();

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

  const primaryNavItems = [
    { id: "hero", label: "Home" },
    { id: "market", label: "🟢 Market", isRoute: true },
    { id: "investors", label: "💼 Invest", isRoute: true },
    { id: "earn-trn", label: "Earn", isRoute: true },
  ];

  const aboutDropdownItems = [
    { id: "about", label: "About", isTab: true, tab: "token-details" },
    { id: "tokenomics", label: "Tokenomics", isTab: true, tab: "token-details" },
    { id: "transparency-hub", label: "Transparency", isRoute: true },
    { id: "team", label: "Team", isRoute: true },
  ];

  const moreDropdownItems = [
    { id: "video-updates", label: "Videos", isRoute: true },
    { id: "updates", label: "Blog", isRoute: true },
    { id: "redeem-trn", label: "Redeem TRN", isRoute: true },
    { id: "whitepaper", label: "Whitepaper", isRoute: true },
  ];

  return (
    <nav
      className={`hidden md:block fixed top-12 left-0 right-0 z-[90] transition-all duration-300 animate-slide-in-down ${
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
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isRoute) {
                    navigate(`/${item.id}`);
                  } else {
                    if (location.pathname !== '/') {
                      navigate('/', { state: { scrollTo: item.id } });
                    } else {
                      scrollToSection(item.id);
                    }
                  }
                }}
                aria-label={`Navigate to ${item.label}`}
                className={`px-3 py-2 text-sm font-medium transition-all relative hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded ${
                  activeSection === item.id || location.pathname === `/${item.id}`
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                {(activeSection === item.id || location.pathname === `/${item.id}`) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}

            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-3 py-2 text-sm font-medium transition-all hover:text-foreground text-muted-foreground rounded flex items-center gap-1"
                  aria-label="About menu"
                >
                  About
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {aboutDropdownItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => {
                      if (item.isRoute) {
                        navigate(`/${item.id}`);
                      } else if (item.isTab) {
                        if (location.pathname !== '/') {
                          navigate('/', { state: { activeTab: item.tab, scrollTo: item.id } });
                        } else {
                          const event = new CustomEvent('changeTab', { detail: { tab: item.tab } });
                          window.dispatchEvent(event);
                          setTimeout(() => scrollToSection(item.id), 100);
                        }
                      }
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-3 py-2 text-sm font-medium transition-all hover:text-foreground text-muted-foreground rounded flex items-center gap-1"
                  aria-label="More menu"
                >
                  More
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {moreDropdownItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => navigate(`/${item.id}`)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="font-display font-semibold"
              asChild
            >
              <a
                href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mint TRN tokens on Pump.fun"
              >
                Mint TRN
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://t.me/+s6385WFOp21lOGZh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Terrain Token Telegram community"
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
