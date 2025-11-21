import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem("trn-sound-enabled");
    if (saved === "true") {
      setSoundEnabled(true);
    }
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("trn-sound-enabled", String(newState));
    
    // Dispatch custom event for audio player to listen
    window.dispatchEvent(new Event("sound-toggle-changed"));

    if (newState) {
      toast({
        title: "Sound effects enabled! 🎵",
        description: "Background music is now available in the bottom-right corner",
      });
    } else {
      toast({
        title: "Sound effects muted 🔇",
        description: "Peace and quiet restored",
      });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleSound}
        variant="outline"
        size="icon"
        className={`rounded-full w-12 h-12 border-primary/30 hover:bg-primary/10 transition-all hover:scale-110 active:scale-95 ${
          soundEnabled ? "shadow-glow animate-pulse" : ""
        }`}
        aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
        title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-primary transition-transform" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground transition-transform" />
        )}
      </Button>
    </div>
  );
};

export default SoundToggle;
