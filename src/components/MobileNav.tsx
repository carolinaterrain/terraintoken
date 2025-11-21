import { Home, Trophy, FileText, Users, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    if (window.location.pathname !== "/") {
      // Navigate to home page if not already there
      navigate("/");
    } else {
      // Scroll to top if already on home page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Terrain Token (TRN)",
          text: "Born from the ground down 🌱⛏️ Join the meme contest!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-primary/20 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHomeClick}
          aria-label="Go to home page"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${location.pathname === '/' ? 'text-primary' : ''}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/earn-trn")}
          aria-label="Navigate to Earn TRN page"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${location.pathname === '/earn-trn' ? 'text-primary' : ''}`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-xs">Earn</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/whitepaper")}
          aria-label="View whitepaper"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${location.pathname === '/whitepaper' ? 'text-primary' : ''}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">Docs</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/team")}
          aria-label="View team page"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${location.pathname === '/team' ? 'text-primary' : ''}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">Team</span>
        </Button>
      </div>
    </nav>
  );
};

export default MobileNav;
