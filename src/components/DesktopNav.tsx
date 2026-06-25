import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Wallet, Menu, X, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

// Use public folder path directly for performance
const trnCoin = "/trn-coin.png";

const DesktopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
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
    setMobileMenuOpen(false);
  };

  // Streamlined nav for Industrial DePIN
  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "ecosystem", label: "Ecosystem", path: "/ecosystem" },
    { id: "whitepaper", label: "Whitepaper", path: "/whitepaper" },
    { id: "transparency", label: "Transparency", path: "/transparency" },
    { id: "drops", label: "Drops", path: "/drops" },
    { id: "more", label: "More", isDropdown: true },
  ];

  const moreItems = [
    { path: "/products", label: "Products", section: "Platform" },
    { path: "/flywheel", label: "Flywheel", section: "Platform" },
    { path: "/proof", label: "Proof", section: "Platform" },
    { path: "/pricing", label: "Pricing", section: "Platform" },
    { path: "/token", label: "Token", section: "Token" },
    { path: "/investors", label: "For Investors", section: "Token" },
    { path: "/about", label: "About", section: "Company" },
    { path: "/team", label: "Team", section: "Company" },
    { path: "/press", label: "Press", section: "Company" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <>
      <nav
        className={cn(
          "hidden md:block relative z-[90] transition-all duration-300",
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group"
            >
              <img src={trnCoin} alt="TRN" className="h-8 w-8" />
              <div className="flex flex-col leading-none">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Terrain Ecosystem</span>
                <span className="font-mono font-bold text-lg text-primary group-hover:text-primary/80 transition-colors">
                  TRN
                </span>
              </div>
            </button>

            {/* Center Nav */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                item.isDropdown ? (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "px-3 py-2 text-sm font-medium transition-all relative rounded flex items-center gap-1",
                          "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-safety-green focus:ring-offset-2 focus:ring-offset-slate-950",
                          isMoreActive ? "text-safety-green" : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800">
                      {moreItems.map((subItem, idx) => (
                        <DropdownMenuItem
                          key={subItem.path}
                          onClick={() => navigate(subItem.path)}
                          className={cn(
                            "cursor-pointer font-mono text-sm",
                            isActive(subItem.path) && "bg-safety-green/10 text-safety-green"
                          )}
                        >
                          {subItem.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => item.path ? navigate(item.path) : scrollToSection(item.id)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-all relative rounded",
                      "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-safety-green focus:ring-offset-2 focus:ring-offset-slate-950",
                      isActive(item.path || '') ? "text-safety-green" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                    {isActive(item.path || '') && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-safety-green rounded-full" />
                    )}
                  </button>
                )
              ))}
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Connect Wallet - Solana Standard */}
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-sm border-solana-purple/50 text-solana-purple hover:bg-solana-purple/10 gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect
              </Button>
              
              {/* Acquire TRN */}
              <Button
                size="sm"
                className="font-mono text-sm bg-safety-green hover:bg-safety-green/90 text-slate-950 gap-1"
                asChild
              >
                <a
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acquire TRN
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <img src={trnCoin} alt="TRN" className="h-7 w-7" />
              <div className="flex flex-col leading-none">
                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">Ecosystem</span>
                <span className="font-mono font-bold text-primary">TRN</span>
              </div>
            </button>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 space-y-2">
            {navItems.filter(i => !i.isDropdown).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors",
                  isActive(item.path || '') 
                    ? "bg-safety-green/10 text-safety-green" 
                    : "text-muted-foreground hover:bg-slate-800"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Button
                variant="outline"
                className="w-full font-mono border-solana-purple/50 text-solana-purple gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
              <Button
                className="w-full font-mono bg-safety-green hover:bg-safety-green/90 text-slate-950"
                asChild
              >
                <a
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acquire TRN
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default DesktopNav;
