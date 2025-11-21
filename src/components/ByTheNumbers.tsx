import { TrendingUp, MapPin, Shield, Cpu, Camera, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ByTheNumbers = () => {
  const metrics = [
    {
      icon: Wrench,
      value: "1,100+",
      label: "Completed Projects",
      description: "Drainage & erosion control solutions",
      color: "text-primary"
    },
    {
      icon: MapPin,
      value: "20 Miles",
      label: "Service Radius",
      description: "Around Waxhaw, NC",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      value: "CL.1872",
      label: "Licensed Contractor",
      description: "NC Landscape Contractor",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      value: "$2M+",
      label: "Service Volume",
      description: "2022-2025 operational activity",
      color: "text-purple-500"
    },
    {
      icon: Cpu,
      value: "AI-Powered",
      label: "TerrainVision™",
      description: "Built from real job-site data",
      color: "text-cyan-500"
    },
    {
      icon: Camera,
      value: "1000s",
      label: "Documented Jobs",
      description: "Photos & drone scans archived",
      color: "text-orange-500"
    }
  ];

  const timeline = [
    { year: "2019", event: "Carolina Terrain Founded" },
    { year: "2022", event: "Scaled to 6-figure monthly operations" },
    { year: "2023", event: "Expanded team & equipment fleet" },
    { year: "2024", event: "Invested in robotics & AI tooling" },
    { year: "2025", event: "TRN Token community launched" }
  ];

  return (
    <section id="by-the-numbers" className="py-20 px-6 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/40">
            💼 Operational Transparency
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Carolina Terrain By The Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A snapshot of the real-world business backing the TRN community
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            2019–2025
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-background/80 ${metric.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-3xl font-bold mb-1">
                      {metric.value}
                    </div>
                    <div className="font-semibold text-foreground mb-1">
                      {metric.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.description}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Timeline */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 text-center">
            Operational Growth Timeline
          </h3>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-20 font-display text-xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {item.year}
                </div>
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                <div className="flex-1 text-foreground">
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Investment Highlights */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 text-center">
            Operational Investments
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">
                🚜 Heavy Equipment Fleet
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Kubota Excavator & Large Skidsteer</li>
                <li>• Dodge Ram 2020 & 2025 work trucks</li>
                <li>• Pressure washing & robotics equipment</li>
                <li>• Specialized tools & machinery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">
                🤖 Technology & Innovation
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• TerrainVision™ AI development</li>
                <li>• Drone scanning & mapping systems</li>
                <li>• Project documentation database</li>
                <li>• Automation & efficiency tools</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Critical Disclaimer */}
        <Card className="p-6 bg-muted/50 backdrop-blur-sm border-2 border-muted">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">⚠️</div>
            <div>
              <h4 className="font-display text-lg font-bold mb-2">
                Important Disclosure
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">TRN is a community-driven meme token</span> inspired by the real-world work we do every day at Carolina Terrain. 
                <span className="font-semibold text-foreground"> It is not tied to company equity, profits, or revenue.</span>
              </p>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                The operational data shown above demonstrates the legitimacy and real-world foundation behind the TRN community, 
                but TRN tokens themselves do not represent ownership, investment returns, or financial claims of any kind.
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Context */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Since 2019, Carolina Terrain has experienced consistent operational growth, reinvesting into equipment, 
            team expansion, and cutting-edge technology. This transparency is provided to showcase the authentic 
            foundation behind the TRN community culture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ByTheNumbers;
