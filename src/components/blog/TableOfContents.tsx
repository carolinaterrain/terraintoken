import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 w-64 ml-8">
      <GlassCard className="p-6">
        <h3 className="font-display text-lg font-bold mb-4">Table of Contents</h3>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "text-left text-sm hover:text-primary transition-colors",
                    activeId === heading.id
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-6 text-sm text-primary hover:text-primary-glow font-semibold"
        >
          ↑ Back to Top
        </button>
      </GlassCard>
    </aside>
  );
};
