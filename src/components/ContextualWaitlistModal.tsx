import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useModalQueue } from "@/hooks/useModalQueue";
import type { ModalType } from "@/hooks/useModalQueue";

interface ContextualWaitlistModalProps {
  modalType: ModalType;
  title: string;
  description: string;
  emoji?: string;
}

export const ContextualWaitlistModal = ({ modalType, title, description, emoji = "🌱" }: ContextualWaitlistModalProps) => {
  const { activeModal, dismissModal } = useModalQueue();
  const showModal = activeModal === modalType;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        body: { email, utm_source: modalType.replace('waitlist-', '') },
      });

      if (error) throw error;

      toast({
        title: "🎉 Welcome to the Waitlist!",
        description: `You're #${data.position} in line for TerrainScape!`,
      });

      dismissModal(modalType, true);
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
    <Dialog open={showModal} onOpenChange={(open) => !open && dismissModal(modalType, false)}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20 z-[95]">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2 text-2xl text-center font-display">
            <span className="text-5xl">{emoji}</span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            {description}
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
            {isSubmitting ? "Joining..." : "🎮 Join TerrainScape Waitlist"}
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
