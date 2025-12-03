import { Home, Video, Briefcase, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const navItems = [
    { path: "/", label: "Home", icon: Home, onClick: handleHomeClick },
    { path: "/earn-trn", label: "Earn", icon: Gift },
    { path: "/market", label: "Market", icon: TrendingUp },
    { path: "/video-updates", label: "Updates", icon: Video },
    { path: "/investors", label: "Invest", icon: Briefcase },
  ];

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
              className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
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
      </div>
    </nav>
  );
};

export default MobileNav;
