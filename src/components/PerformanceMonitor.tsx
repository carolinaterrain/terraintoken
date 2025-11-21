import { useEffect } from "react";

const PerformanceMonitor = () => {
  useEffect(() => {
    // Reduce animations on low-end devices
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleMotionChange = () => {
      document.body.classList.toggle("reduce-motion", mediaQuery.matches);
    };
    
    handleMotionChange();
    mediaQuery.addEventListener("change", handleMotionChange);

    // Detect low-end devices
    const isLowEndDevice = () => {
      const cores = navigator.hardwareConcurrency || 1;
      const memory = (navigator as any).deviceMemory;
      return cores <= 2 || (memory && memory <= 4);
    };

    if (isLowEndDevice()) {
      document.documentElement.style.setProperty("--particle-count", "10");
      document.body.classList.add("disable-parallax");
    }

    // Log performance metrics in development only
    if (import.meta.env.DEV) {
      const logPerformance = () => {
        if (performance.getEntriesByType) {
          const perfData = performance.getEntriesByType("navigation")[0] as any;
          if (perfData) {
            console.log("⚡ Performance Metrics:");
            console.log("- DOM Content Loaded:", Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart), "ms");
            console.log("- Page Load:", Math.round(perfData.loadEventEnd - perfData.loadEventStart), "ms");
            console.log("- Time to Interactive:", Math.round(perfData.domInteractive - perfData.fetchStart), "ms");
          }
        }
      };

      if (document.readyState === "complete") {
        logPerformance();
      } else {
        window.addEventListener("load", logPerformance, { once: true });
      }
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
