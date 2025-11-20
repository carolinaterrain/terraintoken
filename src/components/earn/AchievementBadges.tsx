import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const achievements = [
  {
    id: 'first_drop',
    name: 'First Drop',
    icon: '🌱',
    description: 'Upload your first photo',
    reward: 10,
    rarity: 'common'
  },
  {
    id: 'data_knight',
    name: 'Data Knight',
    icon: '🏆',
    description: 'Upload 10 photos with consent',
    reward: 50,
    rarity: 'rare'
  },
  {
    id: 'terrain_oracle',
    name: 'Terrain Oracle',
    icon: '👑',
    description: 'Upload 100 photos',
    reward: 500,
    rarity: 'legendary'
  },
  {
    id: 'ai_trainer',
    name: 'AI Trainer',
    icon: '🎯',
    description: 'Validate 50 AI predictions',
    reward: 250,
    rarity: 'epic'
  },
  {
    id: 'goblin_approved',
    name: 'Goblin Approved',
    icon: '⛏️',
    description: 'Get featured by Terry',
    reward: 100,
    rarity: 'epic'
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '🔥',
    description: '7-day upload streak',
    reward: 75,
    rarity: 'rare'
  }
];

const rarityColors = {
  common: "bg-gray-500/20 text-gray-500",
  rare: "bg-blue-500/20 text-blue-500",
  epic: "bg-purple-500/20 text-purple-500",
  legendary: "bg-orange-500/20 text-orange-500"
};

const AchievementBadges = () => {
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
                <Badge className={rarityColors[achievement.rarity]}>
                  {achievement.rarity.toUpperCase()}
                </Badge>
                <div className="font-display font-bold text-primary">
                  +{achievement.reward} TRN
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
