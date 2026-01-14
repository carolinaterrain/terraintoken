import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge, OptionalBadge } from "./StatusBadge";
import { ChevronDown, ChevronUp, Calendar, Target, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import roadmapItems from "@/content/roadmapItems.json";

type Status = "live" | "in_progress" | "planned";

interface RoadmapFiltersProps {
  activeFilter: Status | "all";
  onFilterChange: (filter: Status | "all") => void;
  counts: Record<Status | "all", number>;
}

function RoadmapFilters({ activeFilter, onFilterChange, counts }: RoadmapFiltersProps) {
  const filters: { value: Status | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "live", label: "Live" },
    { value: "in_progress", label: "In Progress" },
    { value: "planned", label: "Planned" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      {filters.map(filter => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="min-w-[80px]"
        >
          {filter.label}
          <span className="ml-2 text-xs opacity-70">({counts[filter.value]})</span>
        </Button>
      ))}
    </div>
  );
}

interface RoadmapItemCardProps {
  item: typeof roadmapItems[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function RoadmapItemCard({ item, isExpanded, onToggle }: RoadmapItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border rounded-lg overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
              {item.category}
            </span>
            <StatusBadge status={item.status as Status} size="sm" />
            {item.optional && <OptionalBadge />}
          </div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
        <div className="ml-4 flex flex-col items-end gap-2">
          {(item.launchDate || item.targetDate) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {item.launchDate || item.targetDate}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Success Criteria
                </h4>
                <ul className="space-y-1">
                  {item.successCriteria.map((criteria, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface RoadmapTimelineProps {
  className?: string;
}

export function RoadmapTimeline({ className }: RoadmapTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<Status | "all">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const counts = useMemo(() => ({
    all: roadmapItems.length,
    live: roadmapItems.filter(i => i.status === "live").length,
    in_progress: roadmapItems.filter(i => i.status === "in_progress").length,
    planned: roadmapItems.filter(i => i.status === "planned").length,
  }), []);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return roadmapItems;
    return roadmapItems.filter(item => item.status === activeFilter);
  }, [activeFilter]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <RoadmapFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <RoadmapItemCard
              key={item.id}
              item={item}
              isExpanded={expandedItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No items match the selected filter.
        </div>
      )}
    </div>
  );
}

interface RoadmapLanesProps {
  className?: string;
}

export function RoadmapLanes({ className }: RoadmapLanesProps) {
  const liveItems = roadmapItems.filter(i => i.status === "live");
  const inProgressItems = roadmapItems.filter(i => i.status === "in_progress");
  const plannedItems = roadmapItems.filter(i => i.status === "planned");

  return (
    <div className={cn("grid md:grid-cols-3 gap-6", className)}>
      {/* Live Lane */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <StatusBadge status="live" />
          <span className="text-sm text-muted-foreground">({liveItems.length})</span>
        </div>
        <div className="space-y-3">
          {liveItems.map(item => (
            <div key={item.id} className="p-4 rounded-lg border bg-card space-y-2">
              <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
              <h4 className="font-medium text-sm">{item.title}</h4>
              {item.launchDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.launchDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* In Progress Lane */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <StatusBadge status="in_progress" />
          <span className="text-sm text-muted-foreground">({inProgressItems.length})</span>
        </div>
        <div className="space-y-3">
          {inProgressItems.map(item => (
            <div key={item.id} className="p-4 rounded-lg border bg-card space-y-2">
              <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
              <h4 className="font-medium text-sm">{item.title}</h4>
              {item.targetDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Target: {item.targetDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Planned Lane */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <StatusBadge status="planned" />
          <span className="text-sm text-muted-foreground">({plannedItems.length})</span>
        </div>
        <div className="space-y-3">
          {plannedItems.map(item => (
            <div key={item.id} className="p-4 rounded-lg border bg-card space-y-2">
              <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
              <h4 className="font-medium text-sm">{item.title}</h4>
              {item.targetDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Target: {item.targetDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
