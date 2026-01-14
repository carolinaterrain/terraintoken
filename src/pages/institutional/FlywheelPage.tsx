import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section } from "@/components/institutional/InstitutionalLayout";
import { FlywheelInteractive, FlywheelDiagram } from "@/components/institutional/FlywheelDiagram";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const subnav = [
  { label: "Overview", href: "#overview" },
  { label: "Plan", href: "#plan" },
  { label: "Build", href: "#build" },
  { label: "Monitor", href: "#monitor" },
  { label: "Comply", href: "#comply" },
  { label: "Train", href: "#train" },
  { label: "Incentivize", href: "#incentivize" },
];

export default function FlywheelPage() {
  return (
    <InstitutionalLayout subnav={subnav}>
      <Helmet>
        <title>The Terrain Flywheel - Stormwater Lifecycle Management</title>
        <meta name="description" content="Explore the six interconnected steps of the Terrain Flywheel: Plan, Build, Monitor, Comply, Train, and Incentivize." />
      </Helmet>

      <PageHeader
        title="The Terrain Flywheel"
        description="Six interconnected steps that transform stormwater management from reactive compliance to proactive optimization. Each step feeds into the next, creating a self-reinforcing cycle of improvement."
      />

      <Section id="overview">
        <div className="max-w-4xl mx-auto">
          <FlywheelInteractive />
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold">How It Works</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Continuous Improvement Loop</h3>
              <p className="text-muted-foreground">
                Unlike traditional linear approaches, the Terrain Flywheel creates a continuous 
                improvement loop. Data from monitoring informs better planning. Compliance insights 
                drive training priorities. Training completions unlock incentives that encourage 
                further participation.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Evidence at Every Step</h3>
              <p className="text-muted-foreground">
                Each step in the flywheel generates verifiable evidence. From GPS-tagged installation 
                photos to AI analysis audit trails, every action creates a permanent record that 
                supports compliance and builds trust.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Optional Incentive Layer</h3>
              <p className="text-muted-foreground">
                The Incentivize step is optional. All core platform functionality works without 
                TRN utility credits. The incentive layer simply provides additional recognition 
                for verified contributions to ecosystem quality.
              </p>
            </div>
          </div>

          <DisclosureCallout type="info" title="Note">
            The flywheel is designed to work incrementally. You don't need all products to get value. 
            Start with what you need and expand as your program grows.
          </DisclosureCallout>

          <div className="flex gap-4 pt-4">
            <Link to="/products">
              <Button className="gap-2">
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/proof">
              <Button variant="outline">View Evidence Chain</Button>
            </Link>
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
