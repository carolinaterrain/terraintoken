import { Helmet } from "react-helmet-async";
import { InstitutionalLayout, PageHeader, Section } from "@/components/institutional/InstitutionalLayout";
import { Shield, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <InstitutionalLayout>
      <Helmet>
        <title>About - Terrain Ecosystem</title>
        <meta name="description" content="Learn about Terrain's mission to modernize stormwater compliance through data integrity and transparency." />
      </Helmet>

      <PageHeader title="About Terrain" description="Modernizing stormwater compliance through data integrity, transparency, and integrated technology." />

      <Section>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Mission", desc: "Make stormwater compliance efficient, transparent, and data-driven." },
              { icon: Shield, title: "Approach", desc: "Build on proof, not promises. Every claim is verifiable." },
              { icon: Users, title: "Team", desc: "Stormwater professionals and technologists working together." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border bg-card text-center space-y-3">
                <item.icon className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
