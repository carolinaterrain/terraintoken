import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { RoadmapTimeline, RoadmapLanes } from "@/components/institutional/RoadmapTimeline";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoadmapPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Roadmap - Terrain Development Progress</title>
        <meta name="description" content="Track the development progress of Terrain ecosystem products and features. See what's live, in progress, and planned." />
      </Helmet>

      <PageHeader
        title="Development Roadmap"
        description="Transparent progress tracking across all ecosystem initiatives. We believe in showing our work—successes and setbacks alike."
      />

      <Section>
        <Tabs defaultValue="lanes" className="space-y-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="lanes">Lane View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lanes">
            <RoadmapLanes />
          </TabsContent>

          <TabsContent value="timeline">
            <RoadmapTimeline />
          </TabsContent>
        </Tabs>
      </Section>

      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <SectionHeader
            title="How We Work"
            description="Our development philosophy prioritizes transparency and incremental delivery."
            align="center"
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Ship Early</h3>
              <p className="text-sm text-muted-foreground">
                We release functional products as soon as they deliver value, then iterate based on real-world feedback.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Show Progress</h3>
              <p className="text-sm text-muted-foreground">
                Every item on this roadmap has defined success criteria. We update status as milestones are achieved.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="font-semibold">Acknowledge Delays</h3>
              <p className="text-sm text-muted-foreground">
                When timelines slip, we say so. Target dates are estimates, not guarantees. We prioritize quality over speed.
              </p>
            </div>
          </div>

          <DisclosureCallout type="info" title="Roadmap Updates">
            This roadmap is updated as priorities shift and milestones are achieved. Last updated: January 2026. 
            For major announcements, follow our blog or whitepaper updates.
          </DisclosureCallout>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
