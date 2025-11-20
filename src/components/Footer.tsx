import { MessageCircle, Users, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Terrain Token</h3>
            <p className="text-muted-foreground text-sm">
              From memes to meaningful data — building the future of terrain intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contract</h4>
            <p className="text-sm text-muted-foreground font-mono break-all">
              [Contract Address Coming Soon]
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <div className="flex gap-4">
              <a 
                href="https://t.me/terraintoken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a 
                href="https://discord.gg/terraintoken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Users className="w-6 h-6" />
              </a>
              <a 
                href="https://x.com/terraintoken" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Terrain Token. All rights reserved.</p>
          <p className="mt-2">Not financial advice. DYOR. Meme responsibly.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
