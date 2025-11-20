import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

// Meme templates - easily add more
const templates: Template[] = [
  {
    id: "goblin-hodl",
    name: "Goblin HODL",
    category: "Classic Goblins",
    imageUrl: "/goblin-with-coin.png",
    description: "Perfect for HODL memes"
  },
  {
    id: "terrain-mascot",
    name: "Terrain Mascot",
    category: "Classic Goblins",
    imageUrl: "/terrain-mascot.png",
    description: "The OG terrain goblin"
  },
  {
    id: "goblin-banner",
    name: "Goblin Banner",
    category: "Classic Goblins",
    imageUrl: "/goblin-banner.png",
    description: "Wide format for epic memes"
  },
  // Add more templates as needed
];

const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

const MemeGenerator = () => {
  const { toast } = useToast();

  const handleDownload = (template: Template) => {
    // Create a link to download the image
    const link = document.createElement("a");
    link.href = template.imageUrl;
    link.download = `trn-meme-${template.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded! 🎨",
      description: "Add your text and share on X with #TRNMemes",
    });
  };

  const handleShareToX = () => {
    const tweetText = encodeURIComponent(
      "Just made a meme with the TRN Meme Maker! 🌱⛏️ @carolinaterrain #TRNMemes"
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  return (
    <section id="meme-maker" className="py-20 px-4 bg-gradient-to-b from-terrain-dark/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🎨 TRN MEME MAKER — INSTANT EROSION CHAOS
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Download templates, add your text, become legend
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>✨ 20+ Templates</span>
            <span>•</span>
            <span>💾 Instant Download</span>
            <span>•</span>
            <span>🏆 Contest Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden bg-card border-primary/30 hover:border-primary/60 hover:shadow-glow transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <h3 className="font-bold mb-3">{template.name}</h3>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleDownload(template)}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button
                    onClick={handleShareToX}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share to X
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-12 p-8 bg-card/50 border-primary/20">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📝 How to Make Your Meme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-semibold mb-1">Download</h4>
              <p className="text-sm text-muted-foreground">Pick a template and download it</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-semibold mb-1">Edit</h4>
              <p className="text-sm text-muted-foreground">Add text using any image editor</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-semibold mb-1">Share</h4>
              <p className="text-sm text-muted-foreground">Post on X with #TRNMemes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">4️⃣</div>
              <h4 className="font-semibold mb-1">Win</h4>
              <p className="text-sm text-muted-foreground">Get votes and win prizes!</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MemeGenerator;
