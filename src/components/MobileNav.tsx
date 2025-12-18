import { Home, Briefcase, Gift, TrendingUp, MoreHorizontal, Heart, FileText, Shield, Newspaper, BookOpen, Users, Coins, RotateCcw, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const handleHomeClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (action: () => void) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    action();
  };

  // Phase 4.3: Added Invest to main nav, kept core 4 items + More
  const navItems = [
    { path: "/", label: "Home", icon: Home, onClick: handleHomeClick },
    { path: "/earn-trn", label: "Earn", icon: Gift },
    { path: "/market", label: "Market", icon: TrendingUp },
    { path: "/investors", label: "Invest", icon: Briefcase },
  ];

  const moreItems = [
    { path: "/whitepaper", label: "Whitepaper", icon: FileText },
    { path: "/drops", label: "Drops", icon: Shirt },
    { path: "/team", label: "About Us", icon: Users },
    { path: "/philanthropic-fund", label: "Philanthropic Fund", icon: Heart },
    { path: "/transparency", label: "Transparency Hub", icon: Shield },
    { path: "/press", label: "Press Kit", icon: Newspaper },
    { path: "/updates", label: "Blog", icon: BookOpen },
    { path: "/redeem-trn", label: "Redeem TRN", icon: Coins },
  ];

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-background/95 backdrop-blur-lg border-t border-primary/20 shadow-lg safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(item.onClick || (() => navigate(item.path)))}
              aria-label={`Navigate to ${item.label}`}
              className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[52px] min-w-[52px] transition-all touch-manipulation ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}

        {/* More Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="More options"
              className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[52px] min-w-[52px] transition-all touch-manipulation ${
                isMoreActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="font-display">More Pages</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 pb-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2 min-h-[64px] touch-manipulation"
                    onClick={() => {
                      handleNavClick(() => navigate(item.path));
                      setOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
            {/* Settings row */}
            <div className="flex items-center justify-between border-t border-border pt-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground min-h-[44px] touch-manipulation"
                onClick={() => {
                  localStorage.removeItem('trn-onboarding-completed');
                  window.location.reload();
                }}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Restart Tour
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNav;