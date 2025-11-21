import { Helmet } from "react-helmet-async";
import { VideoUpdatesHub } from "@/components/VideoUpdatesHub";
import BackToHome from "@/components/BackToHome";

const VideoUpdates = () => {
  return (
    <>
      <Helmet>
        <title>Video Updates - Terrain Token (TRN)</title>
        <meta 
          name="description" 
          content="Watch quick 30-second updates on TRN price action, product demos, team insights, and community highlights. Stay informed with our video content hub." 
        />
        <meta property="og:title" content="TRN Video Updates Hub" />
        <meta property="og:description" content="Quick video updates on price action, demos, and more from the Terrain Token team." />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-20">
        <BackToHome />
        <VideoUpdatesHub showFilters={true} />
      </div>
    </>
  );
};

export default VideoUpdates;
