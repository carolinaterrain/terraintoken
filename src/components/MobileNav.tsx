import { Home, Trophy, DollarSign, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      <div className="flex items-center justify-around py-2 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollToSection("hero")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollToSection("roadmap")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Map className="w-5 h-5" />
          <span className="text-xs">Roadmap</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollToSection("contest")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs">Contest</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollToSection("how-to-buy")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-xs">Buy</span>
        </Button>
      </div>
    </nav>
  );
};

export default MobileNav;
