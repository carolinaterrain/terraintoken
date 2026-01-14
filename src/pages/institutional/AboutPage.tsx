import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Scale, Eye, Zap, ArrowRight, ExternalLink } from "lucide-react";

const values = [
  { 
    icon: Target, 
    title: "Mission-Driven", 
    desc: "Make stormwater compliance efficient, transparent, and data-driven for everyone involved." 
  },
  { 
    icon: Shield, 
    title: "Proof Over Promises", 
    desc: "Every claim is backed by verifiable evidence. We build trust through transparency, not marketing." 
  },
  { 
    icon: Users, 
    title: "Practitioner-Built", 
    desc: "Built by stormwater professionals who understand the real challenges of compliance." 
  },
  { 
    icon: Scale, 
    title: "Regulatory Aligned", 
    desc: "Designed around actual regulatory requirements, not abstract ideals." 
  },
  { 
    icon: Eye, 
    title: "Open Methodology", 
    desc: "Our processes are documented and auditable. We welcome scrutiny." 
  },
  { 
    icon: Zap, 
    title: "Incremental Value", 
    desc: "Start small, expand as needed. Every product delivers standalone value." 
  },
];

const milestones = [
  { year: "2020", event: "Carolina Terrain field operations launched" },
  { year: "2024", event: "Stormwater SCM platform goes live" },
  { year: "Nov 2025", event: "Development begins on Terrain ecosystem" },
  { year: "Dec 2025", event: "Terrain Vision AI & TRN utility credits launched" },
  { year: "2026", event: "Evidence Chain integration in progress" },
  { year: "2026", event: "Drainage Academy & Terrain Guard planned" },
];

export default function AboutPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>About - Terrain Ecosystem</title>
        <meta name="description" content="Learn about Terrain's mission to modernize stormwater compliance through data integrity and transparency." />
      </Helmet>

      <PageHeader 
        title="About Terrain" 
        description="We're building the infrastructure layer for stormwater compliance. Not with hype, but with data integrity, transparency, and tools that actually work for practitioners." 
      />

      <Section>
        <SectionHeader
          title="Our Values"
          description="The principles that guide how we build and operate."
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Our Story"
            align="center"
          />
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              Terrain started in the field—literally. Carolina Terrain began as a stormwater 
              construction and maintenance contractor, handling everything from retention pond 
              cleanouts to emergency repairs after major storms.
            </p>
            <p>
              What we learned in the field was simple: compliance is hard, documentation is 
              tedious, and most "solutions" are built by people who've never stood knee-deep 
              in a sediment basin. So we started building tools for ourselves.
            </p>
            <p>
              Those internal tools became Stormwater SCM. The AI models we developed for 
              analyzing our own drone footage became Terrain Vision. The monitoring systems 
              we needed for proactive maintenance became Terrain Guard.
            </p>
            <p>
              Today, Terrain is an integrated ecosystem where each product feeds data into 
              the others. Field work generates documentation. AI analysis triggers maintenance 
              schedules. Monitoring data populates compliance reports. Training reinforces 
              best practices. And for those who contribute to the ecosystem's quality, TRN 
              provides optional recognition.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Timeline"
          description="Key milestones in our development."
          align="center"
        />
        
        <div className="max-w-2xl mx-auto">
          <div className="relative border-l border-border pl-8 space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[41px] h-4 w-4 rounded-full bg-primary border-4 border-background" />
                <div className="text-sm font-mono text-primary mb-1">{milestone.year}</div>
                <div className="font-medium">{milestone.event}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <SectionHeader
            title="Risk Posture"
            description="We believe in being upfront about what we are and aren't."
            align="center"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold text-primary">What We Are</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• A working stormwater contractor with real projects</li>
                <li>• A software platform with production users</li>
                <li>• An AI company with deployed models</li>
                <li>• A utility credit with transparent mechanics</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold text-destructive">What We're Not</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• An investment opportunity</li>
                <li>• A get-rich-quick scheme</li>
                <li>• A guarantee of regulatory compliance</li>
                <li>• A replacement for professional judgment</li>
              </ul>
            </div>
          </div>

          <DisclosureCallout type="legal">
            <p>
              Stormwater management involves inherent risks. Terrain provides tools to help, 
              but ultimate compliance responsibility lies with property owners and their 
              professional advisors. TRN is a utility credit with no guaranteed value.
            </p>
          </DisclosureCallout>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Connect With Us</h2>
          <p className="text-muted-foreground">
            Whether you're a potential user, contributor, or just curious about what we're building.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contribute">
              <Button className="gap-2">
                Join the Ecosystem
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://stormwaterscm.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                Visit Stormwater SCM
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/press">
              <Button variant="outline">Press Kit</Button>
            </Link>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
