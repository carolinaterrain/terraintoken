import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";

interface Meme {
  id: string;
  image: string;
  username: string;
  xHandle: string;
  xLink: string;
  likes: number;
  timestamp: Date;
}

// Manual curated meme gallery - easily update this array
const memes: Meme[] = [
  // Example entry (commented out):
  // {
  //   id: "1",
  //   image: "https://example.com/meme.png",
  //   username: "ErosionKing",
  //   xHandle: "@erosionking",
  //   xLink: "https://x.com/erosionking/status/123",
  //   likes: 420,
  //   timestamp: new Date("2025-11-15")
  // }
];

const MemeFeed = () => {
  const handleSubmitMeme = () => {
    const tweetText = encodeURIComponent(
      "Born from the ground down 🌱⛏️ @carolinaterrain #TRNMemes\n\n[paste your meme image]"
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  return (
    <section id="memes" className="py-20 px-4 bg-gradient-to-b from-background to-terrain-dark/20 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            🌧️ LIVE MEME RAIN — WATCH THE CHAOS UNFOLD 🌧️
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Fresh memes straight from the erosion zone
          </p>
          
          <Button 
            onClick={handleSubmitMeme}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 animate-scale-in"
          >
            SUBMIT YOUR MEME 🎨
          </Button>
        </div>

        {memes.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 border-primary/20">
            <div className="mb-4 text-6xl">⛏️</div>
            <h3 className="text-2xl font-bold mb-2">No memes yet — be the first!</h3>
            <p className="text-muted-foreground mb-6">
              Show us your erosion creativity and win prizes!
            </p>
            <Button onClick={handleSubmitMeme} variant="outline" size="lg">
              Submit First Meme
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <Card 
                key={meme.id}
                className="group overflow-hidden bg-card border-primary/30 hover:border-primary/60 hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => window.open(meme.xLink, "_blank")}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={meme.image} 
                    alt={`Meme by ${meme.username}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{meme.username}</p>
                      <p className="text-sm text-muted-foreground">{meme.xHandle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{meme.likes}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(meme.xLink, "_blank");
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Vote on X
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Goblin mascot peeking from corner */}
        <div className="absolute bottom-4 left-4 text-6xl animate-float pointer-events-none opacity-50">
          👺
        </div>
        <div className="absolute bottom-8 left-20 bg-card/90 border border-primary/30 rounded-lg px-4 py-2 pointer-events-none">
          <p className="text-sm font-semibold text-primary">Show us your erosion! 🌧️</p>
        </div>
      </div>
    </section>
  );
};

export default MemeFeed;
