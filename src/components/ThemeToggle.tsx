import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 transition-colors"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-yellow-400 transition-transform hover:rotate-12" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDark ? "Light mode" : "Dark mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
