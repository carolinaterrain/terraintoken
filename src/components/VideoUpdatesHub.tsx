import { useState, useMemo } from "react";
import { VideoUpdate } from "@/types/video";
import { videoUpdates } from "@/data/videoUpdates";
import { VideoCard } from "./VideoCard";
import { VideoModal } from "./VideoModal";
import { VideoFilters } from "./VideoFilters";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoUpdatesHubProps {
  limit?: number;
  showViewAll?: boolean;
  showFilters?: boolean;
}

export const VideoUpdatesHub = ({ 
  limit, 
  showViewAll = false,
  showFilters = true 
}: VideoUpdatesHubProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoUpdate | null>(null);
  const navigate = useNavigate();

  const filteredVideos = useMemo(() => {
    let filtered = activeCategory === 'all' 
      ? videoUpdates 
      : videoUpdates.filter(v => v.category === activeCategory);
    
    // Sort by featured first, then by date
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return limit ? filtered.slice(0, limit) : filtered;
  }, [activeCategory, limit]);

  const videoCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: videoUpdates.length,
    };
    videoUpdates.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            🎬 Video Updates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick 30-second updates on price action, product demos, team insights, and community highlights
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <VideoFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            videoCounts={videoCounts}
          />
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/video-updates')}
              className="group"
            >
              View All Updates
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* Video Modal */}
        <VideoModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </section>
  );
};
