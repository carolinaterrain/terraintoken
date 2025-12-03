import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Heart, FileText, Shield, Newspaper, BookOpen, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use public folder path directly for performance - matches index.html preload
const trnCoin = "/trn-coin.png";

const DesktopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const navigate = useNavigate();
  const location = useLocation();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle with requestAnimationFrame for 60fps
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafRef.current = null;
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "hero", label: "Home", isRoute: false },
    { id: "market", label: "Market", isRoute: true },
    { id: "earn-trn", label: "Earn", isRoute: true },
    { id: "investors", label: "Invest", isRoute: true },
    { id: "team", label: "About", isRoute: true },
  ];

  const moreItems = [
    { path: "/philanthropic-fund", label: "Philanthropic Fund", icon: Heart },
    { path: "/whitepaper", label: "Whitepaper", icon: FileText },
    { path: "/transparency", label: "Transparency Hub", icon: Shield },
    { path: "/press-kit", label: "Press Kit", icon: Newspaper },
    { path: "/updates", label: "Blog", icon: BookOpen },
    { path: "/referral", label: "Refer & Earn", icon: Users },
  ];

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <nav
      className={`hidden md:block relative z-[90] transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                scrollToSection("hero");
              }
            }}
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
                className={`px-4 py-2 text-sm font-medium transition-all relative hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded ${
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

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 text-sm font-medium transition-all relative hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded flex items-center gap-1 ${
                    isMoreActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  More
                  <ChevronDown className="h-3 w-3" />
                  {isMoreActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`cursor-pointer ${
                        location.pathname === item.path ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
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
                href="https://raydium.io/swap/?inputMint=sol&outputMint=2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buy TRN tokens on Raydium"
              >
                Buy TRN
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://discord.gg/nX5u8ZaH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Terrain Token Discord community"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
