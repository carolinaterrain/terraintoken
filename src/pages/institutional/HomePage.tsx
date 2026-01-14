import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InstitutionalLayout, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { FlywheelDiagram } from "@/components/institutional/FlywheelDiagram";
import { ProductCard } from "@/components/institutional/ProductCard";
import { ProofPrinciplesGrid } from "@/components/institutional/EvidenceChain";
import { RoadmapLanes } from "@/components/institutional/RoadmapTimeline";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, Database, Award, CheckCircle, ExternalLink } from "lucide-react";
import components from "@/content/components.json";

export default function HomePage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Terrain - Stormwater Compliance Ecosystem</title>
        <meta name="description" content="Plan, build, monitor, and comply with stormwater regulations using Terrain's integrated ecosystem. Data integrity and auditability at every step." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="h-4 w-4" />
                Compliance-Grade Infrastructure
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Stormwater compliance,{" "}
                <span className="text-primary">simplified</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                From site planning to regulatory reporting, Terrain provides the integrated 
                ecosystem your stormwater program needs. Built on data integrity and transparency.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/flywheel">
                  <Button size="lg" className="gap-2">
                    Explore the Flywheel
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline">
                    View Products
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>MS4 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Audit-Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Multi-State</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FlywheelDiagram compact />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flywheel Preview */}
      <Section id="flywheel">
        <SectionHeader
          title="The Terrain Flywheel"
          description="Six interconnected steps that transform stormwater management from reactive compliance to proactive optimization."
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Database, title: "Plan & Build", desc: "Design and install infrastructure with complete documentation" },
            { icon: Eye, title: "Monitor & Comply", desc: "Real-time tracking and automated regulatory reporting" },
            { icon: Award, title: "Train & Incentivize", desc: "Certified education and optional rewards for quality contributions" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors"
            >
              <item.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/flywheel">
            <Button variant="outline" className="gap-2">
              Deep dive into the Flywheel
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Proof Section */}
      <Section className="bg-muted/30" id="proof">
        <SectionHeader
          title="Built on Proof, Not Promises"
          description="Every claim in the Terrain ecosystem is backed by verifiable evidence."
          align="center"
        />
        
        <ProofPrinciplesGrid />

        <div className="text-center mt-12">
          <Link to="/proof">
            <Button className="gap-2">
              Explore Our Evidence Chain
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Products Grid */}
      <Section id="products">
        <SectionHeader
          title="Integrated Product Suite"
          description="Five core products that work together to deliver complete stormwater lifecycle management."
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.filter(c => !c.optional).map((product) => (
            <ProductCard key={product.slug} slug={product.slug} />
          ))}
        </div>

        <DisclosureCallout type="info" className="mt-8">
          <p>
            <strong>Optional:</strong> TRN Utility Credits provide an incentive layer for verified contributions. 
            <Link to="/products/trn" className="text-primary hover:underline ml-1">Learn more →</Link>
          </p>
        </DisclosureCallout>
      </Section>

      {/* Roadmap Preview */}
      <Section className="bg-muted/30" id="roadmap">
        <SectionHeader
          title="Where We're Headed"
          description="Transparent progress tracking across all ecosystem initiatives."
          align="center"
        />
        
        <RoadmapLanes />

        <div className="text-center mt-12">
          <Link to="/roadmap">
            <Button variant="outline" className="gap-2">
              View Full Roadmap
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to modernize your stormwater program?</h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a municipality, contractor, or property manager, Terrain provides 
            the tools you need for compliance-grade stormwater management.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/pricing">
              <Button size="lg">View Pricing</Button>
            </Link>
            <Link to="/contribute">
              <Button size="lg" variant="outline">Become a Contributor</Button>
            </Link>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
