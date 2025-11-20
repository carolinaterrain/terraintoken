import { Trophy, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Meme {
  id: string;
  imageUrl: string;
  creator: string;
  prize: string;
  placement: number;
  contestDate: string;
}

// This array can be easily updated with new contest winners
const memes: Meme[] = [
  // Add contest winners here after the contest ends
  // Example:
  // {
  //   id: "1",
  //   imageUrl: "/path-to-meme.jpg",
  //   creator: "@username",
  //   prize: "5 SOL",
  //   placement: 1,
  //   contestDate: "Contest #1 - Nov 2025"
  // }
];

const MemeHallOfFame = () => {
  // Don't render if no memes yet
  if (memes.length === 0) return null;

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
                  src={meme.imageUrl} 
                  alt={`Meme by ${meme.creator}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {meme.placement === 1 && (
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      1st Place
                    </div>
                  )}
                  {meme.placement > 1 && meme.placement <= 5 && (
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {meme.placement}th Place
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-foreground mb-1">{meme.creator}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{meme.contestDate}</span>
                  <span className="text-primary font-bold">{meme.prize}</span>
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
