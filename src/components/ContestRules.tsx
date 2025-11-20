import { Trophy, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ContestRules = () => {
  return (
    <section id="contest" className="py-20 px-4 bg-terrain-dark/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Meme Contest <span className="text-primary">Rules</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Show us your best terrain-themed memes and win prizes!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Trophy className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Contest Theme</h3>
                <p className="text-muted-foreground">
                  "Born from the ground down" — Create memes featuring terrain, erosion, drainage disasters, 
                  the Erosion Goblin, or any soil-related chaos!
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Timeline</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Deadline:</strong> Friday night (48 hours from announcement)
                </p>
                <p className="text-muted-foreground">
                  Winners announced shortly after deadline via Twitter/X and Telegram.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 border-primary/30 bg-primary/5 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Prize Pool</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-semibold">1st Place</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">5 SOL</p>
                <p className="text-sm text-muted-foreground">+ Hall of Fame spot</p>
              </div>
            </div>
            {[2, 3, 4, 5].map((place) => (
              <div key={place} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{place}th Place</span>
                </div>
                <p className="font-bold text-primary">1 SOL</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-primary/20 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            How to Enter
          </h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Create your terrain-themed meme (any format: image, GIF, video)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Post on Twitter/X with the hashtag <strong className="text-foreground">#TRNMemes</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Tag <strong className="text-foreground">@carolinaterrain</strong> in your post</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Optional: Share in our Telegram group for extra community love!</span>
            </li>
          </ol>
        </Card>

        <Card className="p-6 border-primary/20 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Judging Criteria
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Creativity & Originality</h4>
              <p className="text-sm text-muted-foreground">
                Fresh takes on terrain humor, unique angles, unexpected punchlines
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Meme Quality</h4>
              <p className="text-sm text-muted-foreground">
                Clean execution, good timing, proper use of meme formats
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Theme Adherence</h4>
              <p className="text-sm text-muted-foreground">
                Must relate to terrain, erosion, soil, drainage, or the Erosion Goblin
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Community Engagement</h4>
              <p className="text-sm text-muted-foreground">
                Likes, retweets, and comments will be considered
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-primary/20">
          <h3 className="text-xl font-bold mb-4">Contest Rules</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Submissions must be original content or clearly transformative</li>
            <li>• Keep it SFW (safe for work) — no explicit content</li>
            <li>• No plagiarism — credit sources if using others' work as base material</li>
            <li>• Multiple entries allowed per person</li>
            <li>• Winners must have a Solana wallet to receive prizes</li>
            <li>• Judging is final and at the discretion of the Terrain Token team</li>
            <li>• By entering, you grant Terrain Token rights to share your meme on social media</li>
          </ul>
        </Card>

        <Alert className="mt-8 border-primary/50 bg-card">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong className="text-foreground">Prize Distribution:</strong> Winners will be contacted via Twitter/X DM. 
            Prizes will be sent to provided Solana wallet addresses within 7 days of winner announcement. 
            Terrain Token reserves the right to disqualify entries that violate rules or community standards.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};

export default ContestRules;
