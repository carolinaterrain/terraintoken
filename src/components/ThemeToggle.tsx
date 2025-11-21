import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("trn-theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("trn-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("trn-theme", "light");
    }
  };

  return (
    <div className="fixed top-4 right-20 z-50">
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12 border-primary/30 hover:bg-primary/10 transition-all hover:scale-110 active:scale-95"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-primary transition-transform" />
        ) : (
          <Sun className="w-5 h-5 text-primary transition-transform" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
