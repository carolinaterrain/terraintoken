import { Helmet } from "react-helmet-async";
import { Suspense, lazy, useState, useMemo } from "react";
import BackToHome from "@/components/BackToHome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";
import { VideoUpdate } from "@/types/video";
import { videoUpdates } from "@/data/videoUpdates";
import { Skeleton } from "@/components/ui/skeleton";
import { useTabPersistence } from "@/hooks/useTabPersistence";
import { useTabAnalytics } from "@/hooks/useTabAnalytics";
import { PlayCircle, Presentation, GraduationCap, Users, Lightbulb } from "lucide-react";

const Footer = lazy(() => import("@/components/Footer"));

const VideoUpdates = () => {
  const [activeTab, setActiveTab] = useTabPersistence('videos', 'all');
  useTabAnalytics('videos', activeTab);
  const [selectedVideo, setSelectedVideo] = useState<VideoUpdate | null>(null);

  const filteredVideos = useMemo(() => {
    if (activeTab === 'all') return videoUpdates;
    return videoUpdates.filter(v => v.category === activeTab);
  }, [activeTab]);

  const videoCounts = useMemo(() => {
    const counts: Record<string, number> = { all: videoUpdates.length };
    videoUpdates.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      <Helmet>
        <title>Video Updates - Terrain Token (TRN)</title>
        <meta 
          name="description" 
          content="Watch quick 30-second updates on TRN price action, product demos, team insights, and community highlights. Stay informed with our video content hub." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-20">
        <BackToHome />
        
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              🎬 Video Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick 30-second updates on price action, product demos, team insights, and community highlights
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0 rounded-none">
                <TabsTrigger 
                  value="all"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  All Videos ({videoCounts.all || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="product-update"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
                >
                  <Presentation className="w-4 h-4" />
                  <span className="hidden sm:inline">Product Updates ({videoCounts['product-update'] || 0})</span>
                  <span className="sm:hidden">Products</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tutorial"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Tutorials ({videoCounts['tutorial'] || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="community"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
                >
                  <Users className="w-4 h-4" />
                  Community ({videoCounts['community'] || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="team-insights"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="hidden sm:inline">Team Insights ({videoCounts['team-insights'] || 0})</span>
                  <span className="sm:hidden">Insights</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos in this category yet.</p>
            </div>
          )}
        </div>

        {/* Video Modal */}
        <VideoModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>

      <Suspense fallback={<div className="h-64 bg-muted" />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default VideoUpdates;
