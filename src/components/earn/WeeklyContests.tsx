import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar } from "lucide-react";

const contests = [
  {
    title: "Most Creative Drainage Problem",
    prize: "1,000 TRN",
    category: "creative",
    entries: 42,
    description: "Show us your most unique yard challenge"
  },
  {
    title: "Worst Erosion Nightmare",
    prize: "1,000 TRN",
    category: "worst_erosion",
    entries: 38,
    description: "Epic erosion disasters welcome"
  },
  {
    title: "Best Before/After Transformation",
    prize: "2,000 TRN",
    category: "before_after",
    entries: 29,
    description: "Document your terrain transformation"
  }
];

const WeeklyContests = () => {
  const getDeadline = () => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - now.getDay()));
    return sunday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Goblin's Weekly Challenges
          </h2>
          <p className="font-body text-muted-foreground">
            Compete for bonus TRN rewards every week
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-body text-sm">Ends {getDeadline()} at 11:59 PM EST</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contests.map((contest, index) => (
            <GlassCard key={index} className="p-6 relative">
              <div className="absolute top-4 right-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-display text-xl font-bold mb-2 pr-8">
                {contest.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-4">
                {contest.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">Prize Pool</span>
                  <span className="font-display text-lg font-bold text-primary">
                    {contest.prize}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">Entries</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-display font-bold">{contest.entries}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline" asChild>
                <a href="/upload-project">Enter Contest</a>
              </Button>
            </GlassCard>
          ))}
        </div>

        <div className="text-center">
          <GlassCard className="inline-block p-6">
            <div className="text-3xl mb-2">⛏️</div>
            <p className="font-body text-sm text-muted-foreground">
              Winners announced every Monday • Terry the Goblin picks the best
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default WeeklyContests;
