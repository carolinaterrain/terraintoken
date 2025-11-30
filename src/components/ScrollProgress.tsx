import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  // Cache document height to avoid repeated DOM queries
  const cachedHeightRef = useRef<number>(0);

  useEffect(() => {
    // Calculate initial height
    cachedHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      // Throttle with requestAnimationFrame for 60fps
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        if (!progressRef.current) {
          rafRef.current = null;
          return;
        }
        
        const totalHeight = cachedHeightRef.current;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
        
        // Use CSS transform instead of width to avoid forced reflow
        // scaleX is GPU-accelerated and doesn't trigger layout
        progressRef.current.style.transform = `scaleX(${progress})`;
        rafRef.current = null;
      });
    };

    // Update cached height on resize
    const handleResize = () => {
      cachedHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[130] pointer-events-none">
      <div
        ref={progressRef}
        className="h-full w-full bg-primary shadow-glow origin-left will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

export default ScrollProgress;
