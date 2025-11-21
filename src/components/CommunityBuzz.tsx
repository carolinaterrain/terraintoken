import { useEffect, useState } from "react";
import { socialComments } from "@/data/socialProof";
import { cn } from "@/lib/utils";

export const CommunityBuzz = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate comments for seamless loop
  const allComments = [...socialComments, ...socialComments];

  return (
    <div className="w-full overflow-hidden bg-primary/5 border-y border-primary/10 py-3">
      <div className="container">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Live Community Buzz
          </span>
          <div className="flex gap-1">
            <span className="animate-pulse w-2 h-2 rounded-full bg-primary"></span>
            <span className="animate-pulse w-2 h-2 rounded-full bg-primary delay-150"></span>
            <span className="animate-pulse w-2 h-2 rounded-full bg-primary delay-300"></span>
          </div>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={cn(
              "flex gap-6 animate-scroll-left",
              isPaused && "pause-animation"
            )}
            style={{
              animationDuration: "60s"
            }}
          >
            {allComments.map((comment, index) => (
              <div
                key={`${comment.id}-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg whitespace-nowrap min-w-fit"
              >
                <span className="text-xs font-semibold text-primary">
                  @{comment.username}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-foreground">
                  {comment.text}
                </span>
                <span className="text-xs text-muted-foreground">
                  {comment.timestamp}
                </span>
                {comment.upvotes && comment.upvotes > 0 && (
                  <span className="text-xs text-primary">
                    ↑ {comment.upvotes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
