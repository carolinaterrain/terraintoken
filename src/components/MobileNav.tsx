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

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-background/95 backdrop-blur-lg border-t border-primary/20 shadow-lg safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick(handleHomeClick)}
          aria-label="Go to home page"
          className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
            location.pathname === '/' 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick(() => navigate("/earn-trn"))}
          aria-label="Navigate to Earn TRN page"
          className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
            location.pathname === '/earn-trn' 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-xs font-medium">Earn</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick(() => navigate("/market"))}
          aria-label="View Goblin Market"
          className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
            location.pathname === '/market' 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs font-medium">Market</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick(() => navigate("/video-updates"))}
          aria-label="View video updates"
          className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
            location.pathname === '/video-updates' 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-xs font-medium">Videos</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick(() => navigate("/investors"))}
          aria-label="View investor opportunities"
          className={`flex flex-col items-center gap-1 h-auto py-3 px-3 min-h-[48px] min-w-[48px] transition-all ${
            location.pathname === '/investors' 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-xs font-medium">Invest</span>
        </Button>
      </div>
    </nav>
  );
};

export default MobileNav;
