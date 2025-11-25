import { useState, useEffect, useRef, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * LazySection component that loads content only when it enters the viewport
 * Uses IntersectionObserver for optimal performance
 * 
 * @param children - Content to lazy load
 * @param fallback - Placeholder to show while loading (defaults to Skeleton)
 * @param rootMargin - Margin around the root (e.g., "200px" to load 200px before visible)
 * @param threshold - Percentage of visibility required to trigger (0-1)
 * 
 * @example
 * <LazySection fallback={<Skeleton className="h-96" />}>
 *   <ExpensiveComponent />
 * </LazySection>
 */
export const LazySection = ({
  children,
  fallback,
  rootMargin = "200px",
  threshold = 0.01,
  className = "",
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  const defaultFallback = <Skeleton className="w-full h-96 rounded-lg" />;

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (fallback || defaultFallback)}
    </div>
  );
};
