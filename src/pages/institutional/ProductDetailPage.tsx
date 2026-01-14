import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { InstitutionalLayout, PageHeader, Section, SectionHeader } from "@/components/institutional/InstitutionalLayout";
import { StatusBadge, OptionalBadge } from "@/components/institutional/StatusBadge";
import { ComponentSpecTable } from "@/components/institutional/ComponentSpecTable";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, CheckCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import components from "@/content/components.json";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = components.find(c => c.slug === slug);

  if (!product) {
    return (
      <InstitutionalLayout>
        <Section>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </Section>
      </InstitutionalLayout>
    );
  }

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconName] || LucideIcons.Box;
  };

  const Icon = getIcon(product.icon);

  return (
    <InstitutionalLayout>
      <Helmet>
        <title>{product.name} - Terrain Products</title>
        <meta name="description" content={product.whatItIs} />
      </Helmet>

      <PageHeader
        title={product.name}
        description={product.tagline}
        badge={
          <div className="flex items-center gap-2 mb-4">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm">{product.name}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={product.status as "live" | "in_progress" | "planned"} />
            {product.optional && <OptionalBadge />}
            {product.externalUrl && (
              <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  Visit Site
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        }
      />

      <Section>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What It Is</h2>
              <p className="text-lg text-muted-foreground">{product.whatItIs}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Who Uses It</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {product.whoUses.map((user, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {user}
                  </li>
                ))}
              </ul>
            </div>

            {product.features && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Key Features</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="p-3 rounded-lg bg-muted/50 text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border bg-card">
              <div className="p-4 rounded-lg bg-primary/10 w-fit mb-4">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>
              
              {product.externalUrl ? (
                <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2">
                    Get Started
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : product.status === "planned" ? (
                <Button disabled className="w-full">Coming Soon</Button>
              ) : (
                <Link to="/contribute">
                  <Button variant="outline" className="w-full">Join Waitlist</Button>
                </Link>
              )}
            </div>

            {product.disclaimers && (
              <DisclosureCallout type="legal" title="Important Disclosures">
                <ul className="space-y-1 text-xs">
                  {product.disclaimers.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </DisclosureCallout>
            )}
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <SectionHeader
          title="Data Flow"
          description="How information moves through this product—inputs, outputs, and the evidence generated at each step."
        />
        
        <ComponentSpecTable
          inputs={product.inputs}
          outputs={product.outputs}
          evidence={product.evidence}
        />
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Part of the Terrain Ecosystem</h2>
          <p className="text-muted-foreground">
            {product.name} integrates with other Terrain products through the unified evidence chain. 
            Data flows between products to create a complete picture of your stormwater program.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/flywheel">
              <Button variant="outline">See the Flywheel</Button>
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
