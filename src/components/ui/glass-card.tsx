import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, hover = false, onClick }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "bg-card/40 backdrop-blur-xl border border-primary/20",
        "shadow-[0_8px_32px_hsl(var(--primary)/0.1)]",
        "rounded-lg",
        "transition-all duration-300",
        hover && "hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.2)] hover:-translate-y-1",
        onClick && "cursor-pointer active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
