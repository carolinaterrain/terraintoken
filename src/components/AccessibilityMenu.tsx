import { useState } from "react";
import { Button } from "./ui/button";
import { Settings, Minimize2, ZoomIn, Eye } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const toggleReduceMotion = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    document.body.classList.toggle("reduce-motion", newValue);
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    // This would need CSS implementation
    document.body.classList.toggle("high-contrast", newValue);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    document.body.classList.toggle("large-text", newValue);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        className="fixed bottom-20 md:bottom-4 left-4 z-50 rounded-full shadow-glow"
        aria-label="Accessibility settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-28 md:bottom-16 left-4 z-50 animate-fade-in-up">
          <GlassCard className="p-4 w-64">
            <h3 className="font-display font-semibold mb-4 text-sm">Accessibility</h3>
            
            <div className="space-y-3">
              <button
                onClick={toggleReduceMotion}
                className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-primary/10 transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
                <span className="text-sm flex-1">Reduce Motion</span>
                <span className={`text-xs ${reduceMotion ? "text-primary" : "text-muted-foreground"}`}>
                  {reduceMotion ? "ON" : "OFF"}
                </span>
              </button>

              <button
                onClick={toggleHighContrast}
                className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-primary/10 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm flex-1">High Contrast</span>
                <span className={`text-xs ${highContrast ? "text-primary" : "text-muted-foreground"}`}>
                  {highContrast ? "ON" : "OFF"}
                </span>
              </button>

              <button
                onClick={toggleLargeText}
                className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-primary/10 transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="text-sm flex-1">Large Text</span>
                <span className={`text-xs ${largeText ? "text-primary" : "text-muted-foreground"}`}>
                  {largeText ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;
