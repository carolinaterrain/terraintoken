import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const Countdown = () => {
  const targetDate = new Date('2025-11-22T23:59:59-05:00'); // November 22, 2025 @ 11:59 PM EST
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (timeLeft.isExpired) {
    return (
      <div className="my-8 text-center animate-fade-in">
        <div className="inline-block bg-gradient-to-r from-primary/20 via-terrain-glow/20 to-primary/20 backdrop-blur-sm border border-primary/30 rounded-2xl px-8 py-6">
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            🎉 Contest Closed — Winners Announced Soon! 🎉
          </h3>
          <p className="text-muted-foreground">
            Thank you to everyone who participated in the first TRN meme contest!
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-8 text-center animate-fade-in relative">
      {/* Particle rain effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="rain-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 animate-pulse-glow">
        🏆 First Meme Contest Ends In:
      </h3>
      
      <div className="inline-flex gap-3 md:gap-6 bg-gradient-to-r from-primary/10 via-terrain-glow/10 to-primary/10 backdrop-blur-sm border border-primary/30 rounded-2xl px-6 py-4 shadow-glow">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      
      <style>{`
        @keyframes rain-fall {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(200px);
            opacity: 0;
          }
        }
        
        .rain-particle {
          position: absolute;
          width: 2px;
          height: 10px;
          background: linear-gradient(to bottom, transparent, hsl(var(--terrain-glow)));
          animation: rain-fall linear infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 10px hsl(var(--terrain-glow) / 0.5);
          }
          50% {
            text-shadow: 0 0 20px hsl(var(--terrain-glow) / 0.8);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl md:text-5xl font-bold text-terrain-glow min-w-[60px] md:min-w-[80px] tabular-nums">
      {value.toString().padStart(2, '0')}
    </div>
    <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1">
      {label}
    </div>
  </div>
);

const TimeSeparator = () => (
  <div className="text-3xl md:text-5xl font-bold text-terrain-glow/50 flex items-center">
    :
  </div>
);

export default Countdown;
