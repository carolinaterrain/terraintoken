import { VideoUpdate, categoryColors, categoryLabels } from "@/types/video";
import { GlassCard } from "./ui/glass-card";
import { Badge } from "./ui/badge";
import { Play, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: VideoUpdate;
  onClick: () => void;
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD format explicitly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <GlassCard
      hover
      onClick={onClick}
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-glow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <video
          src={video.videoUrl}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          preload="metadata"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/90 text-xs font-medium">
          {formatDuration(video.duration)}
        </div>

        {/* Featured Badge */}
        {video.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              ⭐ Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        {/* Category Badge */}
        <Badge 
          variant="outline" 
          className={cn(
            "bg-gradient-to-r text-white border-0",
            categoryColors[video.category]
          )}
        >
          {categoryLabels[video.category]}
        </Badge>

        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>{video.author}</span>
          <div className="flex items-center gap-3">
            {video.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {video.views}
              </span>
            )}
            <span>{formatDate(video.date)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
