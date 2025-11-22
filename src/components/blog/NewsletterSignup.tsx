import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export const NewsletterSignup = () => {
  return (
    <GlassCard className="p-8 my-12 text-center bg-gradient-to-br from-primary/10 to-primary/5">
      <h3 className="font-display text-2xl font-bold mb-4">
        Stay <span className="text-primary">Updated</span>
      </h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Join our Telegram and Discord to get instant updates on new blog posts, transparency reports, and major announcements.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
          <a href="https://t.me/+s6385WFOp21lOGZh" target="_blank" rel="noopener noreferrer">
            Join Telegram 📱
          </a>
        </Button>
        <Button size="lg" variant="outline" className="border-primary" asChild>
          <a href="https://discord.gg/terraintoken" target="_blank" rel="noopener noreferrer">
            Join Discord 💬
          </a>
        </Button>
      </div>
    </GlassCard>
  );
};
