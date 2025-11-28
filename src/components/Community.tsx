import { Button } from "./ui/button";
import { MessageCircle, Users, Twitter, Sparkles } from "lucide-react";

const links = [
  {
    icon: MessageCircle,
    name: "Telegram",
    url: "https://t.me/+s6385WFOp21lOGZh",
    color: "hover:text-[#0088cc]"
  },
  {
    icon: Users,
    name: "Discord",
    url: "https://discord.gg/terraintoken",
    color: "hover:text-[#5865F2]"
  },
  {
    icon: Twitter,
    name: "Twitter / X",
    url: "https://x.com/carolinaterrain",
    color: "hover:text-primary"
  },
  {
    icon: Sparkles,
    name: "Terrain Vision AI",
    url: "https://terrainvision-ai.com",
    color: "hover:text-primary"
  }
];

const Community = () => {
  return (
    <section id="community" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Join the Movement
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow holders, share memes, and be part of building the future of real-world utility tokens
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className={`font-display border-primary/30 hover:border-primary transition-all ${link.color}`}
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="mr-2" />
                  {link.name}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Community;
