import { ReactNode } from "react";
import { InstitutionalHeader, StickySubnav } from "./InstitutionalHeader";
import { InstitutionalFooter } from "./InstitutionalFooter";
import { cn } from "@/lib/utils";

interface InstitutionalLayoutProps {
  children: ReactNode;
  subnav?: { label: string; href: string }[];
  className?: string;
}

export function InstitutionalLayout({ children, subnav, className }: InstitutionalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InstitutionalHeader />
      {subnav && <StickySubnav items={subnav} />}
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b bg-muted/30", className)}>
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl space-y-4">
          {badge && <div>{badge}</div>}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground">{description}</p>
          )}
          {actions && <div className="pt-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({ title, description, className, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn(
      "max-w-3xl space-y-4 mb-12",
      align === "center" && "mx-auto text-center",
      className
    )}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
