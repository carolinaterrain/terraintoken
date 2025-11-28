import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Overview" },
  { id: "why-different", label: "Why Different" },
  { id: "ecosystem-metrics", label: "Live Metrics" },
  { id: "value-generation", label: "Value Engine" },
  { id: "investment-tiers", label: "Tiers" },
  { id: "roadmap", label: "Roadmap" },
  { id: "proof-section", label: "Trust & Proof" },
  { id: "investor-cta", label: "Take Action" },
];

export const StickyNavigation = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsExpanded(false);
    }
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const progress = ((activeIndex + 1) / sections.length) * 100;

  return (
    <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <div
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Progress indicator */}
        <div className="absolute left-0 top-0 w-1 h-full bg-border rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-primary"
            initial={{ height: "0%" }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Navigation dots */}
        <div className="ml-4 space-y-3">
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center"
                aria-label={`Navigate to ${section.label}`}
              >
                {/* Dot */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-primary scale-150 shadow-lg shadow-primary/50"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:scale-125"
                  )}
                />

                {/* Label on hover */}
                <AnimatePresence>
                  {(isExpanded || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "auto" }}
                      exit={{ opacity: 0, x: -10, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "bg-background/95 backdrop-blur-sm text-muted-foreground border border-border"
                      )}
                    >
                      {section.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Expand hint */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -left-8 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 animate-pulse" />
          </motion.div>
        )}
      </div>
    </div>
  );
};
