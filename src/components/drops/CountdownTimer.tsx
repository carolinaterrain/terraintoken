import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

export function CountdownTimer({ endDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

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

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl
          ${isUrgent 
            ? 'bg-destructive/20 text-destructive border border-destructive/50 animate-pulse' 
            : 'bg-primary/20 text-primary border border-primary/30'
          }
        `}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-destructive animate-pulse' : 'text-primary'}`} />
        <span className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isUrgent ? '⚡ Ending Soon!' : 'Drop closes in:'}
        </span>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive' : 'text-primary'} -mt-4`}>:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}
