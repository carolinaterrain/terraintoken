import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section } from "@/components/institutional/InstitutionalLayout";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function WhitepaperPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Whitepaper - Terrain Ecosystem</title>
        <meta name="description" content="The Terrain Token whitepaper documenting ecosystem mechanics, supply economics, and governance." />
      </Helmet>

      <PageHeader title="Whitepaper" description="Complete documentation of the Terrain ecosystem mechanics, token economics, and governance framework." />

      <Section>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex gap-4 mb-8">
            <a href="/Terrain_Token_TRN_Whitepaper.pdf" download>
              <Button className="gap-2"><Download className="h-4 w-4" />Download PDF</Button>
            </a>
          </div>
          <div className="aspect-[8.5/11] w-full border rounded-lg overflow-hidden bg-card">
            <iframe src="/Terrain_Token_TRN_Whitepaper.pdf" className="w-full h-full" title="Terrain Whitepaper" />
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
