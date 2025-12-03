import { socialComments, platformColors } from "@/data/socialProof";
import { GlassCard } from "./ui/glass-card";
import { MessageSquare, TrendingUp } from "lucide-react";
import { typography } from "@/lib/spacing";
import { cn } from "@/lib/utils";

export const SocialProofWall = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real Conversations</span>
          </div>
          <h2 className={cn(typography.h2, "font-bold mb-4")}>
            What Early Adopters Are Saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unfiltered reactions from the community. No bots, no paid shills—just genuine voices discovering something different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialComments.map((comment, index) => (
            <GlassCard 
              key={comment.id} 
              hover
              className="p-5 group animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platformColors[comment.platform] }}
                  />
                  <span className="text-xs font-semibold text-foreground">
                    @{comment.username}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {comment.timestamp}
                </span>
              </div>

              <p className="text-sm text-foreground/90 mb-3 leading-relaxed">
                "{comment.text}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                <div className="flex items-center gap-2">
                  {comment.upvotes !== undefined && comment.upvotes > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-medium">{comment.upvotes}</span>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  comment.sentiment === 'excited' && "bg-primary/20 text-primary",
                  comment.sentiment === 'positive' && "bg-green-500/20 text-green-500",
                  comment.sentiment === 'neutral' && "bg-muted text-muted-foreground"
                )}>
                  {comment.sentiment === 'excited' ? '🔥' : comment.sentiment === 'positive' ? '✓' : '·'}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic">
            Selected community reactions from social platforms.
          </p>
        </div>
      </div>
    </section>
  );
};
