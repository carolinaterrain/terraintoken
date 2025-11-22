import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export const WaitlistExitIntent = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page (not scrolling)
      if (e.clientY <= 10 && !hasShown) {
        setShowModal(true);
        setHasShown(true);
        localStorage.setItem("exit_intent_shown", "true");
      }
    };

    // Check if already shown in this browser
    const alreadyShown = localStorage.getItem("exit_intent_shown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Wait 5 seconds before enabling (let them read first)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("join-waitlist", {
        body: { email, utm_source: "exit_intent" },
      });

      if (error) throw error;

      toast({
        title: "🎉 Welcome to the Waitlist!",
        description: `You're #${data.position} in line for TerrainScape!`,
      });

      setShowModal(false);
      setEmail("");
    } catch (error: any) {
      console.error("Waitlist error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setShowModal(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            Wait! Don't Leave Empty-Handed 🌱
          </DialogTitle>
          <DialogDescription className="text-base">
            Join <span className="font-bold text-foreground">1,000+</span> early adopters waiting for TerrainScape—the AI-powered drainage game where you earn TRN by analyzing real terrain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-base"
          />
          
          <Button 
            type="submit" 
            className="w-full font-semibold" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "🎮 Secure My Spot"}
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>✅ Beta access priority</p>
            <p>✅ Exclusive TRN rewards</p>
            <p>✅ Early game features</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
