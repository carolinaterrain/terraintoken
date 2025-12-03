import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Camera, Users, Percent } from "lucide-react";

const actions = [
  {
    icon: Camera,
    title: "Upload & Earn",
    description: "Submit terrain photos to train our AI and earn up to 75 TRN per upload",
    href: "/upload-project",
    reward: "Up to 75 TRN",
  },
  {
    icon: Users,
    title: "Refer Friends",
    description: "Share your referral link and earn bonus TRN when friends join",
    href: "/refer",
    reward: "Referral bonuses",
  },
  {
    icon: Percent,
    title: "Redeem for Discounts",
    description: "Use your TRN balance to unlock discounts on terrain services",
    href: "/redeem-trn",
    reward: "Up to 15% off",
  },
];

const EarnActionCards = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
          Choose How to <span className="text-primary">Earn</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} to={action.href}>
                <GlassCard 
                  hover 
                  className="p-6 h-full flex flex-col items-center text-center transition-all hover:border-primary/50"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{action.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4 flex-1">
                    {action.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {action.reward}
                  </span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EarnActionCards;
