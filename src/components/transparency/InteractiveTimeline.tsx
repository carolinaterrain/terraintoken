import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimelineEvent {
  year: string;
  event: string;
  details?: string;
  financialImpact?: string;
  category: "milestone" | "equipment" | "revenue" | "tech";
}

const timelineEvents: TimelineEvent[] = [
  { 
    year: "2019", 
    event: "Carolina Terrain Founded",
    details: "Started drainage and erosion control services in Waxhaw, NC area",
    category: "milestone"
  },
  { 
    year: "May 2022", 
    event: "First Tracked Revenue - $5,634",
    details: "Began systematic financial tracking and business operations scaling",
    financialImpact: "Monthly revenue: $5,634",
    category: "revenue"
  },
  { 
    year: "Nov 2022", 
    event: "Broke $12K Monthly Milestone",
    details: "Achieved first significant monthly revenue milestone with $36,487",
    financialImpact: "550% growth from launch",
    category: "revenue"
  },
  { 
    year: "2023", 
    event: "Scaled to $600K+ Annual Revenue",
    details: "Major equipment investments: Kubota Excavator ($44,431) and Large Skidsteer ($85,001)",
    financialImpact: "Total equipment investment: $129,433",
    category: "equipment"
  },
  { 
    year: "Oct 2023", 
    event: "First $100K+ Month",
    details: "Historic milestone with $115,636 in monthly revenue",
    financialImpact: "Peak performance month",
    category: "revenue"
  },
  { 
    year: "2024", 
    event: "Fleet Expansion Year",
    details: "Purchased Dodge Ram 2020 ($53,993), Dodge Ram 2025 ($55,843), and Pressure Washer Rig ($27,060 - PAID OFF)",
    financialImpact: "Total fleet investment: $136,896",
    category: "equipment"
  },
  { 
    year: "2024", 
    event: "Annual Revenue: $813,892",
    details: "Expanded team and equipment fleet to handle increased demand",
    financialImpact: "35% growth over 2023",
    category: "revenue"
  },
  { 
    year: "2024", 
    event: "TerrainVision™ AI Development Begins",
    details: "Started building AI-powered drainage analysis tool using job-site data",
    category: "tech"
  },
  { 
    year: "2025 YTD", 
    event: "Revenue: $905,322 (Already Exceeded 2024!)",
    details: "Peak month: April 2025 with $108,638. On track for best year yet.",
    financialImpact: "11% growth over entire 2024 in just 11 months",
    category: "revenue"
  },
  { 
    year: "2025", 
    event: "TRN Token Community Launched",
    details: "Community-driven meme token inspired by real-world operational success",
    category: "milestone"
  },
];

export const InteractiveTimeline = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "milestone":
        return "text-primary";
      case "equipment":
        return "text-blue-500";
      case "revenue":
        return "text-green-500";
      case "tech":
        return "text-purple-500";
      default:
        return "text-primary";
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "milestone":
        return "🎯 Milestone";
      case "equipment":
        return "🚜 Equipment";
      case "revenue":
        return "💰 Revenue";
      case "tech":
        return "🤖 Technology";
      default:
        return category;
    }
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="font-display text-2xl font-bold mb-6 text-center">
        Interactive Growth Timeline
      </h3>
      <div className="space-y-2">
        {timelineEvents.map((item, index) => (
          <div key={index} className="group">
            <div 
              className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                expandedIndex === index 
                  ? "bg-primary/10 border-2 border-primary/40" 
                  : "hover:bg-background/50 border-2 border-transparent"
              }`}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className={`flex-shrink-0 w-24 font-display text-lg font-bold ${getCategoryColor(item.category)} transition-transform ${
                expandedIndex === index ? "scale-110" : ""
              }`}>
                {item.year}
              </div>
              <div className={`flex-shrink-0 w-4 h-4 rounded-full ${
                expandedIndex === index ? "bg-primary scale-150" : "bg-primary/50"
              } transition-all`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.event}
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                {expandedIndex === index && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    <Badge variant="outline" className="mb-2">
                      {getCategoryBadge(item.category)}
                    </Badge>
                    {item.details && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.details}
                      </p>
                    )}
                    {item.financialImpact && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-primary">Financial Impact:</span>
                        <span className="text-foreground">{item.financialImpact}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
