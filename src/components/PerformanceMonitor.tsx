import { useEffect } from "react";

const PerformanceMonitor = () => {
  useEffect(() => {
    // Reduce animations on low-end devices
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    if (mediaQuery.matches) {
      document.body.classList.add("reduce-motion");
    }

    // Detect low-end devices
    const isLowEndDevice = () => {
      // Check for hardware concurrency (number of CPU cores)
      const cores = navigator.hardwareConcurrency || 1;
      
      // Check memory (if available)
      const memory = (navigator as any).deviceMemory;
      
      return cores <= 2 || (memory && memory <= 4);
    };

    if (isLowEndDevice()) {
      // Reduce particle counts
      document.documentElement.style.setProperty("--particle-count", "10");
      // Disable parallax on low-end devices
      document.body.classList.add("disable-parallax");
    }

    // Log performance metrics in development
    if (import.meta.env.DEV) {
      window.addEventListener("load", () => {
        if (performance.getEntriesByType) {
          const perfData = performance.getEntriesByType("navigation")[0] as any;
          console.log("⚡ Performance Metrics:");
          console.log("- DOM Content Loaded:", perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, "ms");
          console.log("- Page Load:", perfData.loadEventEnd - perfData.loadEventStart, "ms");
          console.log("- Time to Interactive:", perfData.domInteractive - perfData.fetchStart, "ms");
        }
      });
    }
  }, []);

  return null;
};

export default PerformanceMonitor;
