import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, TrendingUp, ExternalLink } from "lucide-react";

interface Meme {
  rank: number;
  username: string;
  xHandle: string;
  xLink: string;
  memeTitle: string;
  thumbnailUrl: string;
  engagementScore: number;
  isTrending: boolean;
}

// Manual leaderboard - update daily with top memes
const leaderboard: Meme[] = [
  // Example entries (commented out):
  // {
  //   rank: 1,
  //   username: "ErosionKing",
  //   xHandle: "@erosionking",
  //   xLink: "https://x.com/erosionking/status/123",
  //   memeTitle: "When TRN hits $1",
  //   thumbnailUrl: "https://example.com/meme1.png",
  //   engagementScore: 1337,
  //   isTrending: true
  // }
];

const ContestLeaderboard = () => {
  const handleSubmitMeme = () => {
    const tweetText = encodeURIComponent(
      "Born from the ground down 🌱⛏️ @carolinaterrain #TRNMemes"
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-6 h-6 text-amber-700" />;
    return <Award className="w-5 h-5 text-primary" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-500";
    if (rank === 2) return "bg-gray-400/20 border-gray-400/50 text-gray-400";
    if (rank === 3) return "bg-amber-700/20 border-amber-700/50 text-amber-700";
    return "bg-primary/20 border-primary/50 text-primary";
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          TOP 10 MEMERS — LEADERBOARD OF LEGENDS
          <Trophy className="w-8 h-8 text-primary" />
        </h3>
        <p className="text-muted-foreground">
          Most engaged memes so far (updated daily)
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <Card className="p-12 text-center bg-card/50 border-primary/20">
          <div className="mb-4 text-6xl">👑</div>
          <h3 className="text-2xl font-bold mb-2">No entries yet — YOU could be #1!</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to climb the leaderboard and claim the throne!
          </p>
          <Button onClick={handleSubmitMeme} size="lg" className="bg-primary hover:bg-primary/90">
            Claim #1 Spot
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((meme) => (
            <Card
              key={meme.rank}
              className={`p-6 bg-card border transition-all duration-300 hover:shadow-glow ${
                meme.rank <= 3
                  ? "border-primary/50 scale-105 hover:scale-[1.07]"
                  : "border-primary/30 hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-4 md:gap-6">
                {/* Rank Badge */}
                <div
                  className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${getRankBadge(
                    meme.rank
                  )}`}
                >
                  {meme.rank <= 3 ? getRankIcon(meme.rank) : `#${meme.rank}`}
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-primary/30">
                  <img
                    src={meme.thumbnailUrl}
                    alt={meme.memeTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-lg mb-1 truncate">{meme.memeTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{meme.username}</span>
                    <span className="ml-2 text-primary">{meme.xHandle}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-semibold flex items-center gap-1">
                      🔥 {meme.engagementScore.toLocaleString()} points
                    </span>
                    {meme.isTrending && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                </div>

                {/* Vote Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 hidden md:flex"
                  onClick={() => window.open(meme.xLink, "_blank")}
                >
                  Vote on X
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Mobile Vote Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 md:hidden"
                onClick={() => window.open(meme.xLink, "_blank")}
              >
                Vote on X
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Button
          onClick={handleSubmitMeme}
          size="lg"
          variant="outline"
          className="border-primary/50 hover:bg-primary/10"
        >
          Not on the list? Submit now! 🚀
        </Button>
      </div>
    </div>
  );
};

export default ContestLeaderboard;
