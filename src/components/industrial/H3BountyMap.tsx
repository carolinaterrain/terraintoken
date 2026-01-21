import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Hexagon, 
  Layers, 
  ChevronRight,
  Info,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BountyHex {
  id: string;
  h3Index: string;
  bountyTRN: number;
  dataQuality: "surveyor" | "scout";
  status: "available" | "claimed" | "verified";
  region: string;
}

const mockHexes: BountyHex[] = [
  { id: "1", h3Index: "8644b1a2fffffff", bountyTRN: 2500, dataQuality: "surveyor", status: "available", region: "Charlotte Metro" },
  { id: "2", h3Index: "8644b1a3fffffff", bountyTRN: 1800, dataQuality: "scout", status: "claimed", region: "Waxhaw" },
  { id: "3", h3Index: "8644b1a4fffffff", bountyTRN: 3200, dataQuality: "surveyor", status: "available", region: "Matthews" },
  { id: "4", h3Index: "8644b1a5fffffff", bountyTRN: 1500, dataQuality: "scout", status: "verified", region: "Pineville" },
  { id: "5", h3Index: "8644b1a6fffffff", bountyTRN: 2800, dataQuality: "surveyor", status: "available", region: "Mint Hill" },
];

export function H3BountyMap() {
  const [selectedHex, setSelectedHex] = useState<BountyHex | null>(null);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map visualization */}
          <div className="relative">
            <div className="relative bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden aspect-square">
              {/* Mock map background */}
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

              {/* Interactive hexes */}
              <div className="absolute inset-0 p-8">
                {mockHexes.map((hex, index) => {
                  const positions = [
                    { x: 30, y: 25 },
                    { x: 55, y: 35 },
                    { x: 25, y: 55 },
                    { x: 60, y: 60 },
                    { x: 45, y: 75 },
                  ];
                  const pos = positions[index];
                  
                  return (
                    <motion.button
                      key={hex.id}
                      className={cn(
                        "absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2",
                        "flex items-center justify-center cursor-pointer group"
                      )}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedHex(hex)}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon
                          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                          className={cn(
                            "transition-all duration-300",
                            hex.status === "available" && "fill-safety-green/30 stroke-safety-green",
                            hex.status === "claimed" && "fill-amber-500/30 stroke-amber-500",
                            hex.status === "verified" && "fill-solana-purple/30 stroke-solana-purple",
                            selectedHex?.id === hex.id && "fill-opacity-60"
                          )}
                          strokeWidth="2"
                        />
                      </svg>
                      {/* Height indicator (bounty value) */}
                      <div 
                        className={cn(
                          "absolute bottom-full mb-1 text-xs font-mono font-bold",
                          hex.status === "available" && "text-safety-green",
                          hex.status === "claimed" && "text-amber-500",
                          hex.status === "verified" && "text-solana-purple"
                        )}
                      >
                        {(hex.bountyTRN / 1000).toFixed(1)}K
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="w-8 h-8 bg-slate-800/80">
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

            {/* Selected hex info */}
            {selectedHex && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{selectedHex.region}</h3>
                  <Badge 
                    className={cn(
                      "font-mono",
                      selectedHex.status === "available" && "bg-safety-green/20 text-safety-green",
                      selectedHex.status === "claimed" && "bg-amber-500/20 text-amber-500",
                      selectedHex.status === "verified" && "bg-solana-purple/20 text-solana-purple"
                    )}
                  >
                    {selectedHex.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">H3 Index</p>
                    <p className="font-mono">{selectedHex.h3Index}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Bounty</p>
                    <p className="font-mono text-safety-green font-bold">
                      {selectedHex.bountyTRN.toLocaleString()} TRN
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Quality Tier</p>
                    <p className="font-mono capitalize">{selectedHex.dataQuality}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Link to="/ecosystem">
              <Button className="w-full bg-safety-green hover:bg-safety-green/90 text-slate-950 font-semibold gap-2">
                Explore Full Map
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
