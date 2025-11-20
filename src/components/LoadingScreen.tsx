import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const loadingMessages = [
  { text: "Compacting soil...", progress: 42 },
  { text: "Convincing worms...", progress: 69 },
  { text: "Installing French drains...", progress: 220 },
  { text: "Summoning goblins...", progress: 420 },
  { text: "Eroding jealousy...", progress: 666 },
  { text: "Checking soil moisture...", progress: 840 },
  { text: "Preparing memes...", progress: 100 },
];

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasVisited = localStorage.getItem("trn-visited");
    if (hasVisited) {
      onComplete();
      return;
    }

    let stepInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const startProgress = () => {
      const targetProgress = loadingMessages[currentStep].progress;
      const duration = 800;
      const steps = 20;
      const increment = (targetProgress - progress) / steps;

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= targetProgress) {
            clearInterval(progressInterval);
            return targetProgress;
          }
          return next;
        });
      }, duration / steps);
    };

    startProgress();

    stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            localStorage.setItem("trn-visited", "true");
            onComplete();
          }, 500);
          return prev;
        }
      });
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [currentStep, progress]);

  const handleSkip = () => {
    localStorage.setItem("trn-visited", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Goblin Animation */}
        <div className="mb-8 text-8xl animate-bounce">
          ⛏️
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-bold mb-4 animate-pulse">
          {loadingMessages[currentStep].text}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-lg text-primary font-bold mb-8">
          {Math.min(Math.floor(progress), 100)}%
        </p>

        {/* Skip Button */}
        <Button
          onClick={handleSkip}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          I've been here before →
        </Button>
      </div>
    </div>
  );
};

export default LoadingScreen;
