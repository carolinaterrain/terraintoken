import { useState, useRef } from "react";
import { Building2, Sparkles, ExternalLink, Shield, Award, Truck, Star, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const RealWorldRoots = () => {
  const [clickCount, setClickCount] = useState(0);
  const [videoPlayCount, setVideoPlayCount] = useState(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const videoCaptions = [
    "🎬 Behold! The official Terrain Token goblin doing its LEGENDARY victory dance over a French drain! This is what peak performance looks like! ⛏️💚",
    "When your meme coin mascot has more moves than most crypto influencers 🕺✨ (And it's backed by actual drainage contractors!)",
    "This goblin dances on certified French drains installed by Carolina Terrain! The vibes are immaculate! 🌧️⛏️",
    "POV: You just realized this dancing goblin represents a token with REAL construction company backing 🤯💚",
    "The only meme coin where the mascot's victory dance is powered by NDS-certified drainage energy! 🚰✨",
  ];

  const handleCarolinaTerrainClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      toast({
        title: "🚰 Honorary Drainage Inspector Badge Unlocked!",
        description: "You've been certified by the pros! The goblins are impressed.",
        duration: 5000,
      });
      setTimeout(() => setClickCount(0), 1000);
    }
  };

  const handleVideoPlay = () => {
    const newPlayCount = videoPlayCount + 1;
    setVideoPlayCount(newPlayCount);
    setCurrentCaptionIndex((prev) => (prev + 1) % videoCaptions.length);

    if (newPlayCount === 1) {
      toast({
        title: "🎉 The goblin noticed you watching!",
        description: "Those are some certified moves, aren't they? 💚",
        duration: 3000,
      });
    } else if (newPlayCount === 3) {
      toast({
        title: "You can't stop watching the goblin dance! 💚",
        description: "Don't worry, nobody can resist those drainage-powered moves!",
        duration: 3000,
      });
    } else if (newPlayCount === 5) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "🕺⛏️ OFFICIAL GOBLIN DANCE CERTIFIED! 🕺⛏️",
        description: "You've watched the goblin dance enough times to learn the moves! You're now part of the crew!",
        duration: 5000,
      });
    }
  };

  const certifications = [
    { icon: Shield, text: "Licensed NC Landscape Contractor" },
    { icon: Award, text: "NDS Certified Property Drainage Contractor" },
    { icon: Award, text: "Keystone Certified Hardscape Contractor" },
    { icon: Shield, text: "SOX Erosion Control Certified" },
    { icon: Truck, text: "Custom 700-Gallon Pressure Washing Trailer" },
    { icon: Award, text: "Unilock Lifetime Warranty Projects" },
    { icon: Star, text: "125+ 5-Star Reviews" },
  ];

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/hero-terrain-grid.jpg')] opacity-5" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🏗️ Built on <span className="text-primary">Solid Ground</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Most meme coins are built on hot air. Terrain Token is built on top of a company 
            that installs French drains with a 700-gallon beast truck and lifetime Unilock warranties.
          </p>
          <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">
            Born from the ground down — and that ground is NDS-certified! 🌱⛏️💚
          </Badge>
        </div>

        {/* Video Showcase */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Badge variant="outline" className="text-sm px-4 py-2 border-primary/50 mb-3 animate-pulse">
              <Play className="w-4 h-4 inline mr-2" />
              WATCH THE GOBLIN!
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              🎬 The Moment You've Been Waiting For...
            </h3>
            <p className="text-muted-foreground">
              Witness the official Terrain Token goblin performing its legendary victory dance! 
              Powered by real French drain energy and certified drainage vibes! 🌧️⛏️✨
            </p>
          </div>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]">
            <video 
              ref={videoRef}
              controls 
              className="w-full rounded-lg"
              poster="/carolina-terrain-work-1.png"
              onPlay={handleVideoPlay}
            >
              <source src="/carolina-terrain-showcase.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-sm text-muted-foreground mt-4 animate-fade-in">
              {videoCaptions[currentCaptionIndex]}
            </p>
            {videoPlayCount > 0 && (
              <p className="text-center text-xs text-primary mt-2">
                👀 You've watched this {videoPlayCount} time{videoPlayCount !== 1 ? 's' : ''}! The goblins are impressed!
              </p>
            )}
          </Card>

          {/* Goblin Fact Card */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Goblin Fun Fact:</h4>
                <p className="text-sm text-foreground mb-2">
                  Did you know? Carolina Terrain's custom 700-gallon pressure washing trailer can clean 
                  an entire industrial park while the goblin takes a nap! That's what we call efficiency! 🚰✨
                </p>
                <p className="text-xs text-muted-foreground italic">
                  (And yes, every French drain installed is one more reason this token has ACTUAL BACKING! 
                  We're not just memeing, we're DRAINING! 🌧️)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Certifications Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="text-primary">God-Tier</span> Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <cert.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{cert.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Work Gallery with Goblin Images */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">
            Real Work. Real Credentials. Real <span className="text-primary">Drainage Glory</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="overflow-hidden border-primary/20">
              <img src="/carolina-terrain-work-1.png" alt="Carolina Terrain professional work" className="w-full h-64 object-cover" />
            </Card>
            <Card className="overflow-hidden border-primary/20">
              <img src="/goblin-certified.png" alt="Certified by the goblins" className="w-full h-64 object-cover" />
            </Card>
            <Card className="overflow-hidden border-primary/20">
              <img src="/carolina-terrain-work-2.png" alt="Carolina Terrain drainage expertise" className="w-full h-64 object-cover" />
            </Card>
            <Card className="overflow-hidden border-primary/20">
              <img src="/goblin-drainage.png" alt="Goblin drainage inspector" className="w-full h-64 object-cover" />
            </Card>
            <Card className="overflow-hidden border-primary/20">
              <img src="/carolina-terrain-work-3.png" alt="Carolina Terrain hardscape mastery" className="w-full h-64 object-cover" />
            </Card>
            <Card className="overflow-hidden border-primary/20">
              <img src="/carolina-terrain-work-4.png" alt="Carolina Terrain erosion control" className="w-full h-64 object-cover" />
            </Card>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Carolina Terrain */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Carolina Terrain</h3>
                <p className="text-sm text-muted-foreground">Professional Landscape Installation Company</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-semibold text-primary mb-1">Serving:</p>
                <p className="text-xs text-muted-foreground">Industrial Parks • HOAs • Government Contracts • Commercial Properties</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-semibold text-primary mb-1">Specialties:</p>
                <p className="text-xs text-muted-foreground">French Drains • Erosion Control • Hardscape • Pressure Washing • Landscape Installation</p>
              </div>
            </div>

            <Button
              onClick={handleCarolinaTerrainClick}
              className="w-full group-hover:shadow-glow transition-all"
              asChild
            >
              <a 
                href="https://www.carolinaterrain.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Visit Carolina Terrain
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Card>

          {/* Terrain Vision AI */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Terrain Vision AI</h3>
                <p className="text-sm text-muted-foreground">Data-Driven Landscape Intelligence</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                AI-Powered Landscape Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Automated Project Planning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Smart Drainage Solutions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Future of Terrain Management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Innovation Lab for Phase 3-5
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full group-hover:bg-primary/10 transition-all"
              asChild
            >
              <a 
                href="https://terrainvision-ai.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Explore Terrain Vision AI
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Card>
        </div>

        {/* Bottom Proclamation */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              🌱 Official Goblin Proclamation 🌱
            </h3>
            <p className="text-lg">
              "We're not just eroding jealousy...
            </p>
            <p className="text-xl font-bold text-primary">
              We're eroding actual water damage for HOAs across North Carolina."
            </p>
            <p className="text-muted-foreground mt-4">
              When Phase 3–5 hits and Terrain Vision AI starts feeding real backyard photos into our AI, 
              every single meme submitted today becomes training data for the future Terrain Vision empire tomorrow.
            </p>
            <Badge variant="outline" className="text-base px-4 py-2 border-primary/50 mt-4">
              The chaotic, cute, goblin-fronted marketing department for a legitimate terrain revolution 🌧️⛏️💚
            </Badge>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default RealWorldRoots;
