import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AudioControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const lastVolumeBeforeMute = useRef(volume);
  const { toast } = useToast();

  // Load preferences and check first visit
  useEffect(() => {
    const savedPlaying = localStorage.getItem("trn-audio-playing");
    const savedVolume = localStorage.getItem("trn-audio-volume");
    const firstVisit = localStorage.getItem("trn-audio-first-visit");

    if (savedVolume) {
      setVolume(Number(savedVolume));
    }

    if (!firstVisit) {
      setIsFirstVisit(true);
      localStorage.setItem("trn-audio-first-visit", "true");
      
      // Remove first visit indicator after 3 seconds
      setTimeout(() => setIsFirstVisit(false), 3000);
    }

    // Auto-resume if was playing
    if (savedPlaying === "true" && audioRef.current) {
      handlePlay();
    }
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Track time updates
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleError = () => {
      setError("Audio failed to load");
      setIsLoading(false);
      toast({
        title: "🔇 Audio unavailable",
        description: "Network issue - click to retry",
        variant: "destructive",
      });
    };
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [toast]);

  // Smart pause/resume based on tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        audioRef.current?.pause();
      } else if (!document.hidden && isPlaying) {
        audioRef.current?.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Fade in from 0 to target volume
      audioRef.current.volume = 0;
      await audioRef.current.play();
      
      // Gradually increase volume
      const targetVolume = volume / 100;
      const steps = 20;
      const stepDuration = 500 / steps;
      
      for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.volume = (targetVolume * i) / steps;
          }
        }, stepDuration * i);
      }
      
      setIsPlaying(true);
      localStorage.setItem("trn-audio-playing", "true");
      
      toast({
        title: "🎵 Vibes activated",
        description: "Hover for volume control",
      });
    } catch (err) {
      console.error("Audio play failed:", err);
      setError("Failed to play audio");
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;

    // Fade out
    const currentVol = audioRef.current.volume;
    const steps = 15;
    const stepDuration = 300 / steps;
    
    for (let i = steps; i >= 0; i--) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = (currentVol * i) / steps;
        }
      }, stepDuration * (steps - i));
    }

    setTimeout(() => {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    }, 300);

    setIsPlaying(false);
    localStorage.setItem("trn-audio-playing", "false");
    
    toast({
      title: "🔇 Music paused",
      description: "Click to resume",
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem("trn-audio-volume", String(newVolume));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPopup(false);
  };

  const retry = () => {
    setError(null);
    handlePlay();
  };

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Spacebar: Play/Pause
      if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        togglePlay();
        toast({
          title: isPlaying ? "⏸️ Music Paused" : "▶️ Music Playing",
          description: "Press Space to toggle",
          duration: 1500,
        });
      }

      // M: Mute/Unmute
      if (e.key === 'm' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (volume === 0) {
          // Unmute to last volume or 30%
          const newVolume = lastVolumeBeforeMute.current > 0 ? lastVolumeBeforeMute.current : 30;
          handleVolumeChange([newVolume]);
          toast({
            title: `🔊 Unmuted (${newVolume}%)`,
            description: "Press M to toggle mute",
            duration: 1500,
          });
        } else {
          // Mute
          lastVolumeBeforeMute.current = volume;
          handleVolumeChange([0]);
          toast({
            title: "🔇 Muted",
            description: "Press M to toggle mute",
            duration: 1500,
          });
        }
      }

      // Arrow Up: Volume Up
      if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newVolume = Math.min(volume + 10, 100);
        handleVolumeChange([newVolume]);
        toast({
          title: `🔊 Volume: ${newVolume}%`,
          duration: 1000,
        });
      }

      // Arrow Down: Volume Down
      if (e.key === 'ArrowDown' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newVolume = Math.max(volume - 10, 0);
        handleVolumeChange([newVolume]);
        toast({
          title: `🔉 Volume: ${newVolume}%`,
          duration: 1000,
        });
      }

      // Ctrl+M: Toggle popup
      if (e.key === 'm' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowPopup(!showPopup);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, showPopup, toast]);

  // Listen for VIBE easter egg custom event
  useEffect(() => {
    const handleVibeEvent = () => {
      if (!isPlaying) {
        handlePlay();
      }
    };
    
    window.addEventListener('trn-audio-play', handleVibeEvent);
    return () => window.removeEventListener('trn-audio-play', handleVibeEvent);
  }, [isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/trn-anthem-loop.mp3"
        loop
        preload="metadata"
      />

      <div 
        className={cn(
          "fixed z-45 transition-all duration-300",
          "bottom-4 right-4 md:top-20 md:bottom-auto"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          disabled={isLoading}
          className={cn(
            "relative rounded-full w-12 h-12 border-primary/30 hover:bg-primary/10 transition-all hover:scale-110 active:scale-95",
            isPlaying && "shadow-glow",
            isFirstVisit && "animate-pulse"
          )}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <div className="flex items-center gap-0.5 h-5 w-5 justify-center">
              <div className="w-1 bg-primary rounded-full equalizer-bar-1" style={{ height: '40%' }} />
              <div className="w-1 bg-primary rounded-full equalizer-bar-2" style={{ height: '60%' }} />
              <div className="w-1 bg-primary rounded-full equalizer-bar-3" style={{ height: '30%' }} />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>

        {/* Hover Popup */}
        {showPopup && (
          <Card className={cn(
            "absolute bg-background/98 backdrop-blur-md border-primary/30 shadow-glow p-4 space-y-3 w-64 animate-fade-in",
            "bottom-full mb-2 right-0",
            "sm:right-full sm:bottom-auto sm:top-0 sm:mr-2 sm:mb-0"
          )}>
            {/* Track Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎵</span>
                <span className="text-sm font-medium">TRN Anthem</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lofi Background Mix
              </div>
            </div>

            {/* Progress Bar */}
            {isPlaying && (
              <div className="space-y-1">
                <div className="relative h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-200"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>🔊</span>
                <span>Volume</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right font-medium">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Button
                onClick={retry}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Retry
              </Button>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default AudioControl;
