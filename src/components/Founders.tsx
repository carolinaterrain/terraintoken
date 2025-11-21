import { Brain, Hammer, MapPin, Shield, Award, Droplets } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import foundersHeadshot from "@/assets/founders-together.jpg";
import alexHeadshot from "@/assets/alex-purdy.jpg";
import zachHeadshot from "@/assets/zac-hyman.jpg";

const Founders = () => {
  const trustFactors = [
    { icon: Shield, label: "NC License CL.1872" },
    { icon: Award, label: "NDS Certified" },
    { icon: Award, label: "Keystone Authorized" },
    { icon: Shield, label: "Licensed & Insured" },
    { icon: Droplets, label: "Stormwater-Compliant" },
  ];

  const serviceCities = [
    "Marvin", "Weddington", "Mineral Springs", "Indian Trail", 
    "Matthews", "Ballantyne", "South Charlotte", "Pineville", "Fort Mill, SC"
  ];

  return (
    <section id="founders" className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background opacity-50" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="text-primary">Founders</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground">
            Licensed Contractors. Data Engineers. Goblin Wranglers.
          </p>
        </div>

        {/* Founders Headshot */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <img
            src={foundersHeadshot}
            alt="Alex Purdy and Zac Hyman, founders of Carolina Terrain, standing together outdoors"
            className="relative w-full max-w-lg rounded-lg border-2 border-primary/40 shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
          />
          </div>
        </div>

        {/* Founder Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Alex Purdy Card */}
          <GlassCard hover className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex-shrink-0">
                <img
                  src={alexHeadshot}
                  alt="Alex Purdy, Co-Founder of Carolina Terrain, wearing company hat"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary/90 rounded-full border-2 border-background">
                  <Brain className="w-4 h-4 text-background" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Alex Purdy
                </h3>
                <p className="text-muted-foreground font-body">
                  CEO & Creator of TerrainToken
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-primary/20 border-primary text-primary font-mono text-xs">
                    NC License CL.1872
                  </Badge>
                  <a 
                    href="https://www.linkedin.com/in/jamesapurdy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors text-sm underline"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-display text-lg font-semibold mb-2 text-foreground">Strengths</h4>
                <ul className="space-y-2 text-muted-foreground font-body">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Creator of TerrainToken and the entire Terrain digital ecosystem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Architect of Terrain Vision AI, FlowGuardian, and platform design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Leads product vision, tokenomics, and software integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Designs engineered drainage systems using drone data & AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Oversees tech direction and long-term roadmap</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary bg-primary/5 pl-4 py-3 rounded-r">
                <p className="font-body italic text-foreground">
                  "Fix water first. Protect the structure second. Build beauty third."
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Zac Hyman Card */}
          <GlassCard hover className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex-shrink-0">
                <img
                  src={zachHeadshot}
                  alt="Zac Hyman, Co-Founder of Carolina Terrain, field operations lead"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary/90 rounded-full border-2 border-background">
                  <Hammer className="w-4 h-4 text-background" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Zac Hyman
                </h3>
                <p className="text-muted-foreground font-body">
                  COO - Chief Operating Officer
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-display text-lg font-semibold mb-2 text-foreground">Strengths</h4>
                <ul className="space-y-2 text-muted-foreground font-body">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Oversees daily operations across Carolina Terrain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Coordinates field crews, manages project flow and installations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensures physical infrastructure aligns with TRN utility model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Leads grading, pipe installation, and drainage system execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keeps field execution tight, consistent, and scalable</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary bg-primary/5 pl-4 py-3 rounded-r">
                <p className="font-body italic text-foreground">
                  "Build it right the first time—no shortcuts, no guesswork."
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Partnership Section */}
        <GlassCard className="p-6 md:p-8 mb-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 text-foreground">
            The Perfect <span className="text-primary">Partnership</span>
          </h3>
          <div className="max-w-3xl mx-auto space-y-3 font-body text-muted-foreground">
            <p>
              <strong className="text-foreground">Alex</strong> creates the vision, software, and digital ecosystem.
            </p>
            <p>
              <strong className="text-foreground">Zac</strong> executes operations and keeps field work running smoothly.
            </p>
            <p className="text-lg font-semibold text-foreground pt-2">
              One builds the future. One delivers the present. Both guarantee results.
            </p>
          </div>
        </GlassCard>

        {/* Trust Factors */}
        <div className="mb-12">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-center mb-6 text-foreground">
            Trust & Credentials
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {trustFactors.map((factor, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-body hover:bg-primary/20 transition-colors"
              >
                <factor.icon className="w-4 h-4 mr-2" />
                {factor.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Service Area */}
        <GlassCard className="p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
              Where We Serve
            </h3>
          </div>
          <p className="font-body text-muted-foreground mb-3">
            Operating within a 20-mile radius of Waxhaw, NC
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {serviceCities.map((city, index) => (
              <span key={index} className="text-sm font-body text-muted-foreground">
                {city}
                {index < serviceCities.length - 1 && <span className="text-primary mx-1">•</span>}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default Founders;
