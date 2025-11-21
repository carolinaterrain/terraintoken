import { VideoUpdate } from "@/types/video";
import { Button } from "./ui/button";

interface VideoFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  videoCounts?: Record<string, number>;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'price-action', label: '📈 Price Action' },
  { id: 'demo', label: '🎬 Demos' },
  { id: 'update', label: '📢 Updates' },
  { id: 'team', label: '👥 Team' },
  { id: 'community', label: '🎉 Community' },
];

export const VideoFilters = ({ activeCategory, onCategoryChange, videoCounts }: VideoFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-300"
        >
          {category.label}
          {videoCounts && videoCounts[category.id] > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background/20">
              {videoCounts[category.id]}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
