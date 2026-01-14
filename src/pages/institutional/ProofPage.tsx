import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { EvidenceChainDiagram, AuditPacketPreview, ProofPrinciplesGrid } from "@/components/institutional/EvidenceChain";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, FileText } from "lucide-react";

const subnav = [
  { label: "Principles", href: "#principles" },
  { label: "Evidence Chain", href: "#evidence-chain" },
  { label: "Audit Packet", href: "#audit-packet" },
  { label: "Verification", href: "#verification" },
];

export default function ProofPage() {
  return (
    <InstitutionalLayout subnav={subnav}>
      <Helmet>
        <title>Proof - Data Integrity in the Terrain Ecosystem</title>
        <meta name="description" content="Explore how the Terrain ecosystem ensures data integrity through ground-truth capture, tamper resistance, transparency, and privacy by design." />
      </Helmet>

      <PageHeader
        title="Built on Proof"
        description="Every claim in the Terrain ecosystem is backed by verifiable evidence. We believe trust is earned through transparency, not marketing. Here's how we ensure data integrity at every step."
      />

      <Section id="principles">
        <SectionHeader
          title="Core Integrity Principles"
          description="Four foundational principles guide how we capture, store, and verify data across the ecosystem."
          align="center"
        />
        
        <ProofPrinciplesGrid />
      </Section>

      <Section className="bg-muted/30" id="evidence-chain">
        <EvidenceChainDiagram />
      </Section>

      <Section id="audit-packet">
        <AuditPacketPreview />
        
        <div className="max-w-xl mx-auto mt-12 space-y-6 text-center">
          <p className="text-muted-foreground">
            Audit packets can be generated for any claim made by the ecosystem. They're designed 
            to be self-contained and independently verifiable.
          </p>
          
          <DisclosureCallout type="info" className="text-left">
            <p>
              <strong>Coming Soon:</strong> Public audit packet downloads will be available when 
              the Evidence Chain integration reaches production status. Currently in development.
            </p>
          </DisclosureCallout>
        </div>
      </Section>

      <Section className="bg-muted/30" id="verification">
        <div className="max-w-3xl mx-auto space-y-8">
          <SectionHeader
            title="Independent Verification"
            description="Trust, but verify. Here's how you can independently confirm claims made by the Terrain ecosystem."
            align="center"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h3 className="font-semibold">On-Chain Verification</h3>
              <p className="text-sm text-muted-foreground">
                TRN transactions, treasury balances, and reward distributions are recorded on the 
                Solana blockchain. Anyone can verify using a block explorer.
              </p>
              <Link to="/token">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Token Details
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h3 className="font-semibold">Whitepaper</h3>
              <p className="text-sm text-muted-foreground">
                Our whitepaper documents the complete methodology, including supply mechanics, 
                burn calculations, and ecosystem governance.
              </p>
              <Link to="/whitepaper">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center pt-8">
            <h3 className="font-semibold mb-4">Questions About Our Methodology?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We welcome scrutiny. If you have questions about how we collect, process, or 
              verify data, we'd love to hear from you.
            </p>
            <Link to="/contribute">
              <Button>Get in Touch</Button>
            </Link>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
