import { GlassCard } from "./ui/glass-card";

// Use public folder path directly for performance
const terrainMascot = "/terrain-mascot.png";

const MascotLore = () => {
  return (
    <section id="mascot" className="py-12 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-contour)" }}
      />
      
      <div className="container mx-auto max-w-5xl relative">
        <GlassCard hover className="p-8 md:p-12">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 items-center">
            {/* Goblin Mascot */}
            <div className="flex justify-center">
              <img
                src={terrainMascot}
                alt="Terry the Terrain Goblin"
                className="w-48 md:w-64 animate-float hover:animate-dance transition-all cursor-pointer"
              />
            </div>

            {/* Lore Content */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Meet <span className="text-primary">Terry the Terrain Goblin</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                A certified drainage contractor who discovered that community tokens and French drains have one thing in common: both prevent erosion. While other coins pump hot air, Terry pumps water. And data. And occasionally, vibes. 🌱⛏️
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default MascotLore;
