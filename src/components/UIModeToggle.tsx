import { Rocket, Microscope } from "lucide-react";
import { useUIModeStore } from "@/stores/uiModeStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

export const UIModeToggle = () => {
  const { mode, toggleMode } = useUIModeStore();
  const { trackEvent } = useAnalytics();

  const handleToggle = () => {
    const newMode = mode === 'ape' ? 'research' : 'ape';
    toggleMode();
    trackEvent('ui_mode_switch', {
      from_mode: mode,
      to_mode: newMode,
      timestamp: Date.now()
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
        "bg-muted hover:bg-muted/80 border border-border",
        "text-sm font-medium"
      )}
      aria-label={`Switch to ${mode === 'ape' ? 'Research' : 'Ape'} Mode`}
    >
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        mode === 'ape' ? "text-primary" : "text-muted-foreground"
      )}>
        <Rocket className="w-4 h-4" />
        <span className="hidden sm:inline">Ape</span>
      </div>
      <div className={cn(
        "w-10 h-5 rounded-full bg-border relative transition-all duration-300",
        mode === 'research' && "bg-primary"
      )}>
        <div className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform duration-300",
          mode === 'research' && "translate-x-5"
        )} />
      </div>
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        mode === 'research' ? "text-primary" : "text-muted-foreground"
      )}>
        <span className="hidden sm:inline">Research</span>
        <Microscope className="w-4 h-4" />
      </div>
    </button>
  );
};
