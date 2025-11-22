/**
 * Shared chart configuration and utilities
 */

export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
};

export const CHART_DEFAULTS = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  fontSize: 12,
  fontFamily: 'var(--font-body)',
  gridStroke: 'hsl(var(--chart-grid))',
  tooltipStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    padding: '12px',
  },
};

/**
 * Format currency values
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format large numbers with K/M/B suffixes
 */
export const formatNumber = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
};

/**
 * Get contrasting text color for background
 */
export const getContrastColor = (bgColor: string): string => {
  // Simple contrast calculation (for HSL colors from our system)
  return bgColor.includes('--primary') ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))';
};

/**
 * SVG pattern definitions for colorblind accessibility
 */
export const SVG_PATTERNS = {
  stripes: {
    id: 'stripes',
    path: 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2',
  },
  dots: {
    id: 'dots',
    circle: { cx: 2, cy: 2, r: 1 },
  },
  grid: {
    id: 'grid',
    path: 'M 0 0 L 0 4 M 0 0 L 4 0',
  },
};
