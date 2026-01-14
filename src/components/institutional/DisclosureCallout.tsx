import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Shield } from "lucide-react";

interface DisclosureCalloutProps {
  type?: "info" | "warning" | "legal";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    className: "bg-blue-500/5 border-blue-500/20 text-blue-900 dark:text-blue-100",
    iconClassName: "text-blue-500"
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-100",
    iconClassName: "text-amber-500"
  },
  legal: {
    icon: Shield,
    className: "bg-slate-500/5 border-slate-500/20 text-slate-700 dark:text-slate-300",
    iconClassName: "text-slate-500"
  }
};

export function DisclosureCallout({ type = "info", title, children, className }: DisclosureCalloutProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-lg border p-4 flex gap-3",
      config.className,
      className
    )}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClassName)} />
      <div className="space-y-1 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
