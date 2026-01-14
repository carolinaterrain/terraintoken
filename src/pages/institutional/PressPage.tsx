import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Mail } from "lucide-react";

const assets = [
  { name: "Terrain Logo (PNG)", file: "/branding/trn-logo-full.png", type: "Logo" },
  { name: "Terrain Lockup", file: "/branding/trn-lockup.png", type: "Logo" },
  { name: "Brand Scene", file: "/branding/trn-scene.png", type: "Graphics" },
  { name: "Mountains Illustration", file: "/branding/trn-mountains.png", type: "Graphics" },
];

const brandColors = [
  { name: "Primary Green", hex: "#22C55E", usage: "Primary actions, highlights" },
  { name: "Dark Background", hex: "#0A0A0A", usage: "Main background" },
  { name: "Card Surface", hex: "#171717", usage: "Cards, elevated surfaces" },
  { name: "Muted Text", hex: "#A1A1AA", usage: "Secondary text" },
];

export default function PressPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Press Kit - Terrain</title>
        <meta name="description" content="Download Terrain brand assets, logos, and press materials." />
      </Helmet>

      <PageHeader
        title="Press Kit"
        description="Brand assets and materials for media coverage. For press inquiries, contact press@terraintoken.com."
      />

      <Section>
        <SectionHeader title="Brand Assets" description="Download logos and graphics for editorial use." />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.name} className="p-4 rounded-xl border bg-card space-y-4">
              <div className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                <img src={asset.file} alt={asset.name} className="max-h-full max-w-full object-contain p-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.type}</p>
              </div>
              <a href={asset.file} download>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <SectionHeader title="Brand Colors" description="Official color palette for Terrain brand materials." />
        
        <div className="grid md:grid-cols-4 gap-4 max-w-3xl">
          {brandColors.map((color) => (
            <div key={color.hex} className="space-y-2">
              <div 
                className="h-20 rounded-lg border" 
                style={{ backgroundColor: color.hex }}
              />
              <p className="font-medium text-sm">{color.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
              <p className="text-xs text-muted-foreground">{color.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Press Inquiries</h2>
          <p className="text-muted-foreground">
            For interviews, statements, or additional materials, please reach out to our communications team.
          </p>
          <a href="mailto:press@terraintoken.com">
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              press@terraintoken.com
            </Button>
          </a>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
