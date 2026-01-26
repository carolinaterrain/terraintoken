import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Hexagon, 
  Layers, 
  ChevronRight,
  Info,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Note: This is a conceptual visualization of the H3 bounty system
// Real bounty data will be displayed once the bounty program launches

export function H3BountyMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map visualization */}
          <div className="relative">
            <div className="relative bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden aspect-square">
              {/* Map background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 30% 40%, hsl(142 76% 39% / 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, hsl(280 65% 60% / 0.2) 0%, transparent 40%)
                  `,
                }}
              />

              {/* Hex grid overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <pattern id="hexGrid" width="60" height="52" patternUnits="userSpaceOnUse">
                    <polygon
                      points="30,0 60,15 60,37 30,52 0,37 0,15"
                      fill="none"
                      stroke="hsl(142 76% 39% / 0.1)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexGrid)" />
              </svg>

              {/* Conceptual hex regions */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-mono text-sm">
                    Bounty Program Coming Soon
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    H3 hex bounties will be available once the data collection program launches
                  </p>
                </div>
              </div>

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="w-8 h-8 bg-slate-800/80" disabled>
                  <Layers className="h-4 w-4" />
                </Button>
              </div>

              {/* Location label */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-safety-green" />
                  <span className="font-mono">Charlotte / Waxhaw Region</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4 border-safety-green/30 text-safety-green font-mono">
                <Hexagon className="h-3 w-3 mr-2" />
                H3 Bounty System
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Claim Your <span className="text-safety-green">Territory</span>
              </h2>
              <p className="text-muted-foreground font-mono">
                The Terrain network uses H3 hexagonal indexing to organize global terrain data. 
                Each hex represents a claimable region where surveyors can earn TRN by capturing 
                verified 3D point cloud data.
              </p>
            </div>

            {/* Legend */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Data Quality Tiers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-safety-green" />
                    <span className="font-mono text-sm">Surveyor Class</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    LiDAR / Photogrammetry (±2cm accuracy)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-mono text-sm">Scout Class</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Mobile capture (±30cm accuracy)
                  </span>
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-500 mb-1">Program Launching Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    The H3 Bounty Program is currently in development. Active bounties and claimed territories 
                    will be displayed here once the program is live.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/ecosystem">
              <Button className="w-full bg-safety-green hover:bg-safety-green/90 text-slate-950 font-semibold gap-2">
                Explore Ecosystem
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default H3BountyMap;
