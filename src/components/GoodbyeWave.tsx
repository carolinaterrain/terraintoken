import { useEffect, useState } from "react";

const GoodbyeWave = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.hostname !== window.location.hostname && link.href.startsWith("http")) {
        setShow(true);
        setTimeout(() => setShow(false), 1000);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-background/50 animate-fade-in">
      <div className="text-center animate-scale-in">
        <div className="text-8xl mb-4 animate-bounce">👋</div>
        <p className="text-2xl font-bold text-foreground">
          Come back soon!
        </p>
        <p className="text-lg text-muted-foreground">
          The goblins will miss you 🌱
        </p>
      </div>
    </div>
  );
};

export default GoodbyeWave;
