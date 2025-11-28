import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string | null;
  trn_reward: number;
  requirement_type: string;
  requirement_value: number;
}

const rarityColors: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-400",
  rare: "bg-blue-500/20 text-blue-400",
  epic: "bg-purple-500/20 text-purple-400",
  legendary: "bg-orange-500/20 text-orange-400"
};

const AchievementBadges = () => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievement-definitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievement_definitions")
        .select("*")
        .order("trn_reward", { ascending: true });
      
      if (error) throw error;
      return data as AchievementDefinition[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Achievement Badges
            </h2>
            <p className="font-body text-muted-foreground">
              Unlock special rewards as you contribute to the terrain intelligence network
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GlassCard key={i} className="p-6">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Achievement Badges
            </h2>
            <p className="font-body text-muted-foreground">
              Achievements coming soon! Start uploading to be ready when they launch.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Achievement Badges
          </h2>
          <p className="font-body text-muted-foreground">
            Unlock special rewards as you contribute to the terrain intelligence network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <GlassCard key={achievement.id} className="p-6 relative overflow-hidden">
              <div className="text-5xl mb-4">{achievement.icon}</div>
              
              <div className="mb-4">
                <h3 className="font-display text-xl font-bold mb-2">{achievement.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{achievement.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={rarityColors[achievement.rarity || "common"]}>
                  {(achievement.rarity || "common").toUpperCase()}
                </Badge>
                <div className="font-display font-bold text-primary">
                  +{achievement.trn_reward} TRN
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-body text-muted-foreground">
            More achievements coming soon! Keep contributing to unlock them all.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AchievementBadges;
