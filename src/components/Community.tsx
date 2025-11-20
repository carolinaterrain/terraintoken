import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Twitter } from "lucide-react";

const links = [
  {
    icon: MessageCircle,
    name: "Telegram",
    url: "https://t.me/terraintoken",
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
    url: "https://x.com/terraintoken",
    color: "hover:text-primary"
  }
];

const Community = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join the <span className="text-primary">Movement</span>
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Connect with our growing community of terrain enthusiasts, meme lovers, and future data contributors
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className={`border-primary/50 hover:border-primary transition-all ${link.color}`}
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
