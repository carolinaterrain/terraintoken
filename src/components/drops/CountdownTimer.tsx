import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeBlock = memo(({ value, label, isUrgent }: { value: number; label: string; isUrgent: boolean }) => (
  <div className="flex flex-col items-center">
    <div
      className={`
        w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl
        transition-colors duration-300
        ${isUrgent 
          ? 'bg-destructive/20 text-destructive border border-destructive/50' 
          : 'bg-primary/20 text-primary border border-primary/30'
        }
      `}
    >
      {value.toString().padStart(2, '0')}
    </div>
    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
  </div>
));

TimeBlock.displayName = 'TimeBlock';

export function CountdownTimer({ endDate, className = "" }: CountdownTimerProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = endDate.getTime() - Date.now();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [endDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const updateCountdown = (timestamp: number) => {
      // Only update once per second
      if (timestamp - lastUpdateRef.current >= 1000) {
        lastUpdateRef.current = timestamp;
        setTimeLeft(calculateTimeLeft());
      }
      rafRef.current = requestAnimationFrame(updateCountdown);
    };

    rafRef.current = requestAnimationFrame(updateCountdown);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [calculateTimeLeft]);

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const isExpired = totalSeconds <= 0;

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-destructive font-bold">Drop Ended</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-destructive' : 'text-primary'}`} />
        <span className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isUrgent ? '⚡ Ending Soon!' : 'Drop closes in:'}
        </span>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <TimeBlock value={timeLeft.days} label="Days" isUrgent={isUrgent} />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" isUrgent={isUrgent} />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" isUrgent={isUrgent} />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" isUrgent={isUrgent} />
      </div>
    </div>
  );
}
