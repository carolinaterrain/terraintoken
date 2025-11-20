import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ADMIN_PASSWORD = "erosionneverdies";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "🔓 Welcome to the Goblin Cave!",
        description: "The sacred grounds are now open to you.",
      });
    } else {
      toast({
        title: "❌ Wrong Password!",
        description: "The goblins refuse your entry. Try again!",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border-2 border-primary/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🔐</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Secret Goblin Cave
            </h1>
            <p className="text-muted-foreground">
              Only true erosion masters may enter...
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                🗝️ Enter Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="erosion..."
                className="bg-background border-primary/20"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Unlock the Cave
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🌱 Hint: What never stops? 💎
            </p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Lost? <a href="/" className="text-primary hover:underline">Return to surface</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
