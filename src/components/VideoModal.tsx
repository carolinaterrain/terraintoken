import { VideoUpdate, categoryColors, categoryLabels } from "@/types/video";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Share2, Twitter, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface VideoModalProps {
  video: VideoUpdate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  if (!video) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleShare = (platform: 'twitter' | 'copy') => {
    const url = `${window.location.origin}/video-updates?v=${video.id}`;
    const text = `Check out this TRN update: ${video.title} @carolinaterrain #TRN`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Video link copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-gradient-to-r text-white border-0",
                  categoryColors[video.category]
                )}
              >
                {categoryLabels[video.category]}
              </Badge>
              <DialogTitle className="text-2xl">{video.title}</DialogTitle>
              <DialogDescription className="text-base">
                {video.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Video Player */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            className="w-full h-full"
            autoPlay
          />
        </div>

        {/* Video Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium">{video.author}</span>
            <span>{formatDate(video.date)}</span>
            {video.views !== undefined && <span>{video.views} views</span>}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <span className="text-sm font-medium flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('copy')}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="https://t.me/terraintoken" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Discuss on Telegram
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
