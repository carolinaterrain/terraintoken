import { useState, useRef } from "react";
import { Building2, Sparkles, ExternalLink, Shield, Award, Truck, Star, Play, Phone, Mail, MapPin, Globe, Video, Map, Droplets, Hammer, TreePine, Sparkle, Ruler, Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    { icon: Shield, text: "Licensed NC Landscape Contractor (CL.1872)" },
    { icon: Award, text: "NDS Certified Property Drainage Contractor" },
    { icon: Award, text: "Keystone Certified Hardscape Contractor" },
    { icon: Shield, text: "SOX Erosion Control Certified" },
    { icon: Truck, text: "Custom 700-Gallon Pressure Washing Trailer" },
    { icon: Award, text: "Unilock Lifetime Warranty Projects" },
    { icon: Sparkles, text: "Pike's Nursery Partner - Lifetime Plant Replacement" },
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
          <p className="text-sm text-primary italic">
            Born from the ground down — and that ground is NDS-certified, baby! 🌱⛏️💚
          </p>
        </div>

        {/* Contact Info Card */}
        <Card className="p-6 mb-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="tel:9802807638" className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-semibold">(980) 280-7638</p>
              </div>
            </a>
            <a href="mailto:info@carolinaterrain.com" className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">info@carolinaterrain.com</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">License</p>
                <p className="font-semibold">CL.1872</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">Waxhaw, NC & Beyond!</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-primary mt-4 italic">
            The goblins approve this contact info! Call the legends! 💚⛏️
          </p>
        </Card>

        {/* Video showcase */}
        <Card className="p-6 md:p-8 mb-12 bg-card border-primary/20">
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
          
          <div className="relative max-w-3xl mx-auto">
            <video
              ref={videoRef}
              className="w-full rounded-lg shadow-2xl"
              controls
              onPlay={handleVideoPlay}
              poster="/terrain-mascot.png"
            >
              <source src="/carolina-terrain-showcase.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground italic">
                {videoCaptions[currentCaptionIndex]}
              </p>
              {videoPlayCount > 0 && (
                <Badge variant="outline" className="mt-2">
                  Views: {videoPlayCount} {videoPlayCount >= 5 && "🏆"}
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Remote Services Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              🌍 <span className="text-primary">GLOBAL TERRAIN DOMINATION</span> 🌍
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not in North Carolina? No problem! We offer remote services nationwide!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-primary/20 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-center mb-3">Remote 2D/3D Design</h4>
              <p className="text-muted-foreground text-center text-sm mb-4">
                Upload yard photos → Get professional 2D/3D landscape designs. 
                We'll plan your entire project remotely using Terrain Vision AI + human expertise!
              </p>
              <p className="text-xs text-center text-primary italic">
                "Your backyard gets the royal treatment, even from 1,000 miles away! 👑"
              </p>
            </Card>

            <Card className="p-6 bg-card border-primary/20 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-center mb-3">Virtual Consultations</h4>
              <p className="text-muted-foreground text-center text-sm mb-4">
                Schedule Zoom/video consultation with licensed contractors. 
                Get expert advice on drainage, hardscaping, and landscaping!
              </p>
              <p className="text-xs text-center text-primary italic">
                "The goblins will personally review your yard disasters on camera! 📹"
              </p>
            </Card>

            <Card className="p-6 bg-card border-primary/20 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-center mb-3">Local Provider Network</h4>
              <p className="text-muted-foreground text-center text-sm mb-4">
                Not in North Carolina? We'll connect you with certified local contractors. 
                Our network ensures you get quality work anywhere in the USA!
              </p>
              <p className="text-xs text-center text-primary italic">
                "The drainage revolution is spreading like erosion... but in a GOOD way! 🌊"
              </p>
            </Card>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            🏆 <span className="text-primary">Professional Credentials</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card 
                  key={index}
                  className="p-4 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                >
                  <Icon className="w-8 h-8 text-primary mb-2 mx-auto" />
                  <p className="text-sm text-center text-muted-foreground">{cert.text}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Full Service Menu */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            🛠️ <span className="text-primary">Full Service Arsenal</span> 🛠️
          </h3>
          
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="drainage">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  Drainage Solutions 🌧️
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• French Drains (NDS-Certified)</li>
                  <li>• Catch Basins</li>
                  <li>• Downspout Extensions</li>
                  <li>• Sump Pump Installation</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"We fix what other contractors ignore!"</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardscaping">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-primary" />
                  Hardscaping 🪨
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• Keystone Retaining Walls</li>
                  <li>• Unilock Patios (Lifetime Warranty)</li>
                  <li>• Permeable Pavers</li>
                  <li>• Walkways & Driveways</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"Built to outlast the next bull run!"</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="landscaping">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-primary" />
                  Landscaping 🌱
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• Grading & Leveling</li>
                  <li>• Sod Installation (Pike's Nursery - Lifetime Plant Replacement)</li>
                  <li>• Landscape Lighting</li>
                  <li>• Erosion Control</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"From barren wasteland to goblin paradise!"</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maintenance">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-primary" />
                  Maintenance & Washing 🚿
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• VIP Maintenance Plans</li>
                  <li>• 700-Gallon Pressure Washing</li>
                  <li>• Fleet Washing</li>
                  <li>• Industrial Park Cleaning</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"We keep it clean while you stack TRN!"</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="design">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Design Services 📐
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• 2D/3D Landscape Designs</li>
                  <li>• Remote Zoom Consultations</li>
                  <li>• HOA Approval Assistance</li>
                  <li>• Project Planning</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"Terrain Vision AI meets human expertise!"</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="commercial">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Commercial & Government 🏢
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>• HOA Contracts</li>
                  <li>• Industrial Parks</li>
                  <li>• Government Projects</li>
                  <li>• Multi-Property Management</li>
                </ul>
                <p className="text-sm text-primary italic mt-3">"We don't just drain yards... we drain EMPIRES!"</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Goblin Fun Fact Card */}
        <Card className="p-6 mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
          <h3 className="text-xl font-bold mb-3 text-center">🌱 Goblin Fun Fact 🌱</h3>
          <p className="text-muted-foreground text-center">
            While other meme coins are pumping tweets, Carolina Terrain is pumping... well, actual water. 
            Out of your yard. With 700 gallons of pressure. The goblin approves. 💚
          </p>
        </Card>

        {/* Work Gallery */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">📸 Real Work, Real Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="/carolina-terrain-work-1.png" alt="Carolina Terrain drainage installation project - French drain system" className="rounded-lg w-full" />
            <img src="/carolina-terrain-work-2.png" alt="Carolina Terrain hardscape installation - Unilock patio with lifetime warranty" className="rounded-lg w-full" />
            <img src="/carolina-terrain-work-3.png" alt="Carolina Terrain landscaping project - erosion control and grading" className="rounded-lg w-full" />
            <img src="/carolina-terrain-work-4.png" alt="Carolina Terrain stormwater management - catch basin and drainage system" className="rounded-lg w-full" />
          </div>

          {/* CTA after gallery */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="font-display font-semibold"
              asChild
            >
              <a href="https://carolinaterrain.com" target="_blank" rel="noopener noreferrer">
                See Our Work Gallery 🏗️
              </a>
            </Button>
          </div>
        </div>

        {/* Goblin Image Gallery */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">🌱 Goblin-Approved Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src="/goblin-certified.png" alt="Terrain Token goblin mascot with NDS certification badge - officially certified drainage contractor" className="rounded-lg w-full" />
            <img src="/goblin-drainage.png" alt="Terrain Token goblin mascot inspecting French drain installation - professional drainage expertise" className="rounded-lg w-full" />
            <img src="/goblin-banner.png" alt="Terrain Token official banner with goblin mascot - TRN cryptocurrency branding" className="rounded-lg w-full" />
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Carolina Terrain Card */}
          <Card 
            className="p-6 bg-card border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] cursor-pointer"
            onClick={handleCarolinaTerrainClick}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Carolina Terrain</h3>
                <p className="text-sm text-muted-foreground">Landscape Installation Company</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Licensed NC Landscape Contractor (CL.1872) specializing in:
            </p>
            
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                French Drain Installation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Hardscape Design & Construction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Property Drainage Solutions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Erosion Control Systems
              </li>
            </ul>
            
            <Button variant="outline" className="w-full" asChild>
              <a href="https://carolinaterrain.com" target="_blank" rel="noopener noreferrer">
                Visit Carolina Terrain
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </Card>

          {/* Terrain Vision AI Card */}
          <Card className="p-6 bg-card border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Terrain Vision AI</h3>
                <p className="text-sm text-muted-foreground">AI-Powered Landscape Intelligence</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Advanced AI platform providing:
            </p>
            
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Instant Yard Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Automated Pricing & Estimates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Data-Driven Design Recommendations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Integration with Local Resources
              </li>
            </ul>
            
            <Button variant="outline" className="w-full" asChild>
              <a href="https://terrainvision-ai.com" target="_blank" rel="noopener noreferrer">
                Try Terrain Vision AI
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </Card>
        </div>

        {/* Final Proclamation */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            🌱 THE GOBLIN PROCLAMATION 🌱
          </h3>
          <p className="text-lg text-muted-foreground mb-4">
            Most meme coins are built on hot air.<br />
            Terrain Token is built on top of a company that installs French drains with a 700-gallon beast truck 
            and lifetime Unilock warranties.
          </p>
          <p className="text-lg font-semibold text-primary mb-4">
            We're not just eroding jealousy...<br />
            We're eroding actual water damage for HOAs across North Carolina.
          </p>
          <p className="text-md text-muted-foreground italic">
            Born from the ground down — and that ground is NDS-certified, baby!!! 🌱⛏️💚
          </p>
        </Card>
      </div>
    </section>
  );
};

export default RealWorldRoots;
