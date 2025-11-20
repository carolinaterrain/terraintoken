import { Trophy, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const MemeHallOfFame = () => {
  const { data: memes, isLoading } = useQuery({
    queryKey: ['hall-of-fame'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meme_submissions')
        .select('*')
        .eq('status', 'approved')
        .not('placement', 'is', null)
        .order('placement', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Don't render if no memes yet
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold">
                Meme Hall of <span className="text-primary">Fame</span>
              </h2>
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!memes || memes.length === 0) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Meme Hall of <span className="text-primary">Fame</span>
            </h2>
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No Hall of Fame entries yet — be the first legend! 🏆
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Meme Hall of <span className="text-primary">Fame</span>
            </h2>
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Legendary memes that made the Erosion Goblin proud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {memes.map((meme) => (
            <Card key={meme.id} className="overflow-hidden border-primary/20 hover:border-primary/50 transition-all group">
              <div className="relative aspect-square bg-muted">
                <img 
                  src={meme.image_url} 
                  alt={`Meme by ${meme.x_handle || 'Anonymous'}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  {meme.placement === 1 && (
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      1st Place
                    </div>
                  )}
                  {meme.placement && meme.placement > 1 && meme.placement <= 5 && (
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {meme.placement}
                      {meme.placement === 2 ? 'nd' : meme.placement === 3 ? 'rd' : 'th'} Place
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-foreground mb-1">
                  {meme.x_handle ? `@${meme.x_handle}` : 'Anonymous Goblin'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {meme.contest_date || 'Contest #1'}
                  </span>
                  <span className="text-primary font-bold">
                    {meme.prize || 'Glory'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemeHallOfFame;
