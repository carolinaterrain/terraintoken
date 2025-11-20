import { Card } from "@/components/ui/card";
import { Coins, Shield, Rocket, RefreshCw } from "lucide-react";

const stats = [
  {
    icon: Coins,
    label: "Fixed Supply",
    value: "1 Billion TRN",
    description: "No additional minting"
  },
  {
    icon: Shield,
    label: "No Taxes",
    value: "0% Fees",
    description: "Pure transfer freedom"
  },
  {
    icon: Rocket,
    label: "Fair Launch",
    value: "100% Community",
    description: "No pre-mine or insider allocation"
  },
  {
    icon: RefreshCw,
    label: "Upgradeable",
    value: "Future Utility",
    description: "Evolves with ecosystem needs"
  }
];

const Tokenomics = () => {
  return (
    <section id="tokenomics" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Tokenomics</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and community-first token design
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card border-border text-center hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold mb-2 text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
