import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass, Home, ArrowLeft, TrendingUp, Gift, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <div className="text-center max-w-md px-6">
        {/* Terro Mascot */}
        <img 
          src="/terrain-mascot.png" 
          alt="Terro the Terrain Goblin" 
          className="w-32 h-32 mx-auto mb-6 opacity-75 animate-pulse" 
        />
        
        {/* 404 Title */}
        <h1 className="text-7xl font-bold font-display bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Lost in the Terrain!
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Terro couldn't find this page. It may have moved, or the goblins got to it first.
        </p>
        
        {/* Main Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        
        {/* Quick Navigation Links */}
        <div className="flex justify-center gap-6 text-sm">
          <Link 
            to="/market" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Market
          </Link>
          <Link 
            to="/earn-trn" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Gift className="w-4 h-4" />
            Earn
          </Link>
          <Link 
            to="/shop" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Link>
        </div>
        
        {/* Subtle Branding */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Terrain Token • Real-World Roots, Digital Future
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;