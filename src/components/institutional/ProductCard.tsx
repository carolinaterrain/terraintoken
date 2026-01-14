import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { StatusBadge, OptionalBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import components from "@/content/components.json";

interface ProductCardProps {
  slug: string;
  className?: string;
  compact?: boolean;
}

export function ProductCard({ slug, className, compact = false }: ProductCardProps) {
  const product = components.find(c => c.slug === slug);
  
  if (!product) return null;

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconName] || LucideIcons.Box;
  };

  const Icon = getIcon(product.icon);

  if (compact) {
    return (
      <Link
        to={`/products/${product.slug}`}
        className={cn(
          "group flex items-center gap-3 p-4 rounded-lg border bg-card hover:border-primary/50 transition-all",
          className
        )}
      >
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{product.name}</span>
            {product.optional && <OptionalBadge />}
          </div>
          <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    );
  }

  return (
    <div className={cn(
      "group bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-all",
      className
    )}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            {product.optional && <OptionalBadge />}
            <StatusBadge status={product.status as "live" | "in_progress" | "planned"} size="sm" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-sm text-primary font-medium">{product.tagline}</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{product.whatItIs}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.features?.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t p-4 flex items-center justify-between bg-muted/30">
        <Link to={`/products/${product.slug}`}>
          <Button variant="ghost" size="sm" className="group/btn">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
        {product.externalUrl && (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Visit
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

interface ProductsGridProps {
  className?: string;
  exclude?: string[];
}

export function ProductsGrid({ className, exclude = [] }: ProductsGridProps) {
  const filteredProducts = components.filter(c => !exclude.includes(c.slug));

  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {filteredProducts.map(product => (
        <ProductCard key={product.slug} slug={product.slug} />
      ))}
    </div>
  );
}
