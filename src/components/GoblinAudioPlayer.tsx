import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const GoblinAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync with SoundToggle localStorage setting
  useEffect(() => {
    const checkSoundEnabled = () => {
      const saved = localStorage.getItem("trn-sound-enabled");
      setSoundEnabled(saved === "true");
    };

    checkSoundEnabled();
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      checkSoundEnabled();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("sound-toggle-changed", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sound-toggle-changed", handleStorageChange);
    };
  }, []);

  // Load saved volume preference
  useEffect(() => {
    const savedVolume = localStorage.getItem("trn-music-volume");
    if (savedVolume) {
      setVolume(Number(savedVolume));
    }
  }, []);

  // Pause music when sound is disabled
  useEffect(() => {
    if (!soundEnabled && isPlaying) {
      handlePause();
    }
  }, [soundEnabled]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update current time
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const handlePlayPause = () => {
    if (!soundEnabled) {
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem("trn-music-volume", String(newVolume));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!soundEnabled) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/trn-anthem-loop.mp3"
        loop
        preload="none"
      />

      <div className="fixed bottom-4 right-4 z-40">
        <Card
          className={`bg-background/95 backdrop-blur-md border-primary/30 shadow-glow transition-all duration-300 ${
            isMinimized ? "w-16 h-16" : "w-80"
          }`}
        >
          {isMinimized ? (
            <div className="flex items-center justify-center h-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="w-full h-full"
              >
                {isPlaying ? (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-4 bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
                    <div className="w-1 h-4 bg-primary animate-[pulse_1s_ease-in-out_infinite_0.2s]" />
                    <div className="w-1 h-4 bg-primary animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
                  </div>
                ) : (
                  <span className="text-2xl">🎵</span>
                )}
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎵</span>
                  <span className="text-sm font-medium">Now Playing</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Track name */}
              <div className="text-xs text-muted-foreground">
                Lofi Vibes - Chill Background Music
              </div>

              {/* Progress bar */}
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

              {/* Volume control */}
              <div className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                )}
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {volume}%
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>

              {/* Footer */}
              <div className="text-[10px] text-center text-muted-foreground">
                Music by chill_background from Pixabay
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default GoblinAudioPlayer;
