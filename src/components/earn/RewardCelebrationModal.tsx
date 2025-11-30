import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import CountUp from "react-countup";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter, Copy, Upload, Share2, Trophy, Flame } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RewardCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedTRN: number;
  goblinMessage: string;
  achievements?: Array<{ id: string; name: string; bonus: number }>;
  streakInfo?: { current: number; multiplier: number };
}

export const RewardCelebrationModal = ({
  isOpen,
  onClose,
  earnedTRN,
  goblinMessage,
  achievements = [],
  streakInfo
}: RewardCelebrationModalProps) => {
  const navigate = useNavigate();
  const hasConfettiFired = useRef(false);

  useEffect(() => {
    if (isOpen && !hasConfettiFired.current) {
      hasConfettiFired.current = true;
      
      // Fire confetti burst
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#22c55e', '#10b981', '#34d399', '#6ee7b7'];
      
      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Big burst in the middle
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors
        });
      }, 500);
    }

    if (!isOpen) {
      hasConfettiFired.current = false;
    }
  }, [isOpen]);

  const shareToTwitter = () => {
    const tweetText = `🌱 Just earned ${earnedTRN} $TRN by contributing terrain data to @TerrainToken!\n\n${achievements.length > 0 ? `🏆 Unlocked: ${achievements[0].name}\n\n` : ''}Help train AI and earn crypto 👇\nhttps://terraintoken.com/upload`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`I just earned ${earnedTRN} TRN on Terrain Token! Join me: https://terraintoken.com/upload`);
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
  };

  const handleUploadAnother = () => {
    onClose();
    // Reset the page for new upload
    window.location.reload();
  };

  const handleGoHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-primary/30 bg-gradient-to-b from-background to-primary/5">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display">
            🎉 TRN Earned!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6 py-4">
          {/* TRN Amount with Animation */}
          <div className="relative">
            <div className="text-6xl font-bold text-primary font-display">
              <CountUp end={earnedTRN} duration={2} />
              <span className="text-3xl ml-2">TRN</span>
            </div>
            
            {/* Streak Badge */}
            {streakInfo && streakInfo.current > 1 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-500">
                  {streakInfo.current}-day streak! {streakInfo.multiplier}x bonus
                </span>
              </div>
            )}
          </div>

          {/* Achievement Badge */}
          {achievements.length > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-yellow-500">
                Achievement Unlocked: {achievements[0].name}!
              </span>
            </div>
          )}

          {/* Goblin Message */}
          <p className="text-muted-foreground px-4 italic">
            "{goblinMessage}"
          </p>

          {/* Share Buttons */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Share your achievement:</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={shareToTwitter}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Share on X
              </Button>
              <Button
                variant="outline"
                onClick={copyShareLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleUploadAnother}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Another
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>

          {/* Helpful tip */}
          <p className="text-xs text-muted-foreground">
            💡 Upload daily to build streaks and earn bonus TRN!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};