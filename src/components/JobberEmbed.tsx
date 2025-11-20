import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Video, Map } from "lucide-react";

const JobberEmbed = () => {
  useEffect(() => {
    // Load Jobber stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";
    link.media = "screen";
    document.head.appendChild(link);

    // Load Jobber script
    const script = document.createElement("script");
    script.src = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
    script.setAttribute("clienthub_id", "51237859-1605-408a-8154-a2998adede42-803472");
    script.setAttribute("form_url", "https://clienthub.getjobber.com/client_hubs/51237859-1605-408a-8154-a2998adede42/public/work_request/embedded_work_request_form?form_id=803472");
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
      <div className="text-center mb-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-3">
          🌍 Get Your Yard Fixed — <span className="text-primary">ANYWHERE!</span> 🌍
        </h3>
        <p className="text-lg text-muted-foreground mb-4">
          Remote 2D/3D Designs • Virtual Consultations • Local Provider Connections
        </p>
        <p className="text-md text-muted-foreground italic mb-4">
          Not local to NC? No problem! We'll design your perfect drainage paradise remotely and connect you with certified contractors in YOUR area! 💚⛏️
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Badge variant="default" className="px-4 py-2 text-sm">
            <Globe className="w-4 h-4 mr-2 inline" />
            NATIONWIDE SERVICE
          </Badge>
          <Badge variant="default" className="px-4 py-2 text-sm">
            <Map className="w-4 h-4 mr-2 inline" />
            2D/3D DESIGN
          </Badge>
          <Badge variant="default" className="px-4 py-2 text-sm">
            <Video className="w-4 h-4 mr-2 inline" />
            REMOTE CONSULTATION
          </Badge>
        </div>
      </div>

      {/* Jobber embed container */}
      <div id="51237859-1605-408a-8154-a2998adede42-803472" className="min-h-[400px]"></div>
    </Card>
  );
};

export default JobberEmbed;
