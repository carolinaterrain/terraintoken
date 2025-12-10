import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export const NewsletterSignup = () => {
  return (
    <GlassCard className="p-8 my-12 text-center bg-gradient-to-br from-primary/10 to-primary/5">
      <h3 className="font-display text-2xl font-bold mb-4">
        Stay <span className="text-primary">Updated</span>
      </h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Join our Discord to get instant updates on new blog posts, transparency reports, and major announcements.
      </p>
      <div className="flex justify-center">
        <Button size="lg" asChild>
          <a href="https://discord.gg/rM8b6V5Ce" target="_blank" rel="noopener noreferrer">
            Join Discord 💬
          </a>
        </Button>
      </div>
    </GlassCard>
  );
};
