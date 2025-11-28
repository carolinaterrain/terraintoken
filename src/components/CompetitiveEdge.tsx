import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const CompetitiveEdge = () => {
  const comparison = [{
    feature: "Real Company Backing",
    doge: false,
    shib: false,
    pepe: false,
    trn: "Licensed NC Contractor (CL.1872)"
  }, {
    feature: "Physical Assets",
    doge: false,
    shib: false,
    pepe: false,
    trn: "700-gal Pressure Trailer + Equipment"
  }, {
    feature: "Professional Services",
    doge: false,
    shib: false,
    pepe: false,
    trn: "French Drains, Hardscaping, Design"
  }, {
    feature: "Active Earning System",
    doge: false,
    shib: false,
    pepe: false,
    trn: "Upload → Analyze → Earn (LIVE)"
  }, {
    feature: "Cross-Platform Integration",
    doge: false,
    shib: false,
    pepe: false,
    trn: "TerrainVision AI + terraintoken.com"
  }, {
    feature: "Real-World Data Utility",
    doge: false,
    shib: false,
    pepe: false,
    trn: "Training AI with 100k+ terrain photos"
  }, {
    feature: "AI Integration",
    doge: false,
    shib: false,
    pepe: false,
    trn: "Terrain Vision AI (Phase 3-5)"
  }, {
    feature: "Industry Certifications",
    doge: false,
    shib: false,
    pepe: false,
    trn: "8 Professional Certifications"
  }, {
    feature: "Remote Services",
    doge: false,
    shib: false,
    pepe: false,
    trn: "Nationwide 2D/3D Design"
  }, {
    feature: "Utility Roadmap",
    doge: "Unclear",
    shib: "Unclear",
    pepe: "None",
    trn: "6-Phase Terrain Data Ecosystem"
  }];
  return <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2">
            🏆 The Evolution of Meme Coins 🏆
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-primary">TRN</span> Destroys The Old Guard
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From memes to meaningful utility — witness the fourth generation of meme coins
          </p>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4 max-w-2xl mx-auto mb-12">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="font-bold text-lg mb-3 text-primary">🌱 TRN Features</h3>
            <div className="space-y-2">
              {comparison.map((row, index) => (
                <div key={index} className="py-2 border-b border-border/30 last:border-0">
                  <div className="text-sm font-semibold mb-1">{row.feature}</div>
                  <div className="text-sm text-primary">
                    {typeof row.trn === "string" ? row.trn : "✓ Yes"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <h3 className="font-bold text-lg mb-3">🐕 Other Meme Coins</h3>
            <div className="space-y-3">
              {comparison.map((row, index) => (
                <div key={index} className="py-2 border-b border-border/30 last:border-0">
                  <div className="text-sm font-semibold mb-1">{row.feature}</div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>DOGE: {row.doge === false ? "✗" : row.doge}</span>
                    <span>SHIB: {row.shib === false ? "✗" : row.shib}</span>
                    <span>PEPE: {row.pepe === false ? "✗" : row.pepe}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            💡 Swipe cards to compare →
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block max-w-6xl mx-auto mb-12">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-bold text-lg">Feature</th>
                  <th className="text-center p-4 font-bold">DOGE 🐕</th>
                  <th className="text-center p-4 font-bold">SHIB 🐕</th>
                  <th className="text-center p-4 font-bold">PEPE 🐸</th>
                  <th className="text-center p-4 font-bold bg-primary/10">TRN 🌱⛏️</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.doge === false ? <X className="w-5 h-5 text-destructive mx-auto" /> : <span className="text-muted-foreground text-sm">{row.doge}</span>}
                    </td>
                    <td className="text-center p-4">
                      {row.shib === false ? <X className="w-5 h-5 text-destructive mx-auto" /> : <span className="text-muted-foreground text-sm">{row.shib}</span>}
                    </td>
                    <td className="text-center p-4">
                      {row.pepe === false ? <X className="w-5 h-5 text-destructive mx-auto" /> : <span className="text-muted-foreground text-sm">{row.pepe}</span>}
                    </td>
                    <td className="text-center p-4 bg-primary/5">
                      {typeof row.trn === "string" ? <span className="text-primary font-semibold text-sm">{row.trn}</span> : <Check className="w-5 h-5 text-primary mx-auto" />}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goblin Proclamation */}
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              🌱 THE GOBLIN PROCLAMATION 🌱
            </h3>
            <div className="text-left space-y-3 text-muted-foreground">
              <p className="text-lg">
                <span className="font-bold text-foreground">DOGE</span> was legendary in 2013.
              </p>
              <p className="text-lg">
                <span className="font-bold text-foreground">SHIB</span> tried to copy in 2020.
              </p>
              <p className="text-lg">
                <span className="font-bold text-foreground">PEPE</span> meme'd in 2023.
              </p>
              <p className="text-xl font-semibold text-primary mt-6">
                But in 2025, TRN said:
"What if a meme coin... actually DID something?"<br />
                "What if a meme coin... actually DID something?"
              </p>
              <p className="text-lg mt-6">
                We're not just tweeting hype.<br />
                We're installing French drains while you HODL.<br />
                We're building AI while other tokens build Twitter threads.
              </p>
              <p className="text-xl font-bold text-primary mt-6">
                The era of hot-air meme coins is OVER.<br />
                Welcome to the era of CERTIFIED DRAINAGE MEME COINS. 🌱⛏️💚
              </p>
              <p className="text-sm italic text-center mt-6">
                Born from the ground down — and we mean it literally.
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Card className="p-6 text-center border-border">
            <p className="text-sm text-muted-foreground mb-2">DOGE</p>
            <p className="text-2xl font-bold mb-1">$60B Market Cap</p>
            <p className="text-sm text-muted-foreground">Zero Services</p>
          </Card>
          <Card className="p-6 text-center border-border">
            <p className="text-sm text-muted-foreground mb-2">SHIB</p>
            <p className="text-2xl font-bold mb-1">$15B Market Cap</p>
            <p className="text-sm text-muted-foreground">Zero Real Backing</p>
          </Card>
          <Card className="p-6 text-center border-primary/50 bg-primary/5">
            <p className="text-sm text-primary mb-2">TRN</p>
            <p className="text-2xl font-bold mb-1">Early Stage</p>
            <p className="text-sm text-primary">Real Revenue Backing</p>
          </Card>
        </div>

        <p className="text-center text-lg text-muted-foreground mt-8 italic">
          The only meme coin where buying the dip funds ACTUAL CONSTRUCTION PROJECTS
        </p>
      </div>
    </section>;
};
export default CompetitiveEdge;