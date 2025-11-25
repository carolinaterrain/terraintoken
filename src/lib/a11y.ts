/**
 * Accessibility utilities for WCAG AAA compliance
 * 
 * WCAG Requirements:
 * - Normal text: ≥ 4.5:1 contrast ratio
 * - Large text (≥18pt or 14pt bold): ≥ 3:1 contrast ratio
 * - AAA level: ≥ 7:1 for normal text, ≥ 4.5:1 for large text
 */

export interface ContrastCheck {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  level: 'fail' | 'AA' | 'AAA';
}

/**
 * Safe color combinations that meet WCAG AAA standards
 */
export const A11Y_SAFE = {
  // Primary text on dark background (~20:1 contrast)
  bodyOnDark: {
    fg: 'text-foreground',
    bg: 'bg-background',
    minSize: '16px',
    contrast: '~20:1',
  },
  
  // Secondary text on dark background (~11:1 contrast)
  mutedOnDark: {
    fg: 'text-muted-foreground',
    bg: 'bg-background',
    minSize: '14px',
    contrast: '~11:1',
  },
  
  // Gold highlights (large text only) (~12:1 contrast)
  goldOnDark: {
    fg: 'text-goblin-gold',
    bg: 'bg-background',
    minSize: '18px',
    contrast: '~12:1',
  },
  
  // Green primary (large text only) (~6:1 contrast)
  primaryOnDark: {
    fg: 'text-primary',
    bg: 'bg-background',
    minSize: '18px',
    bold: true,
    contrast: '~6:1',
  },
  
  // Purple accents (large text only) (~5:1 contrast)
  purpleOnDark: {
    fg: 'text-terrain-purple',
    bg: 'bg-background',
    minSize: '18px',
    bold: true,
    contrast: '~5:1',
  },
} as const;

/**
 * Get contrast-safe Tailwind class based on color and text size
 */
export function getContrastSafeClass(
  color: 'primary' | 'gold' | 'purple' | 'muted',
  size: 'sm' | 'md' | 'lg',
  isBold: boolean = false
): string {
  // Large text (≥18px) or bold medium text (≥14px) can use accent colors
  const isLargeOrBold = size === 'lg' || (size === 'md' && isBold);

  switch (color) {
    case 'primary':
      // Green - only safe for large/bold text
      return isLargeOrBold ? 'text-primary' : 'text-foreground';
    
    case 'gold':
      // Gold - safe for large text
      return size === 'lg' ? 'text-goblin-gold' : 'text-foreground';
    
    case 'purple':
      // Purple - only safe for large/bold text
      return isLargeOrBold ? 'text-terrain-purple' : 'text-foreground';
    
    case 'muted':
      // Muted - safe for all sizes (improved to 70%)
      return 'text-muted-foreground';
    
    default:
      return 'text-foreground';
  }
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two RGB colors
 */
export function calculateContrast(
  fg: [number, number, number],
  bg: [number, number, number]
): ContrastCheck {
  const l1 = getLuminance(...fg);
  const l2 = getLuminance(...bg);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  const wcagAA = ratio >= 4.5;
  const wcagAAA = ratio >= 7;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA,
    wcagAAA,
    level: wcagAAA ? 'AAA' : wcagAA ? 'AA' : 'fail',
  };
}

/**
 * Text size requirements for different color combinations
 */
export const MIN_TEXT_SIZES = {
  critical: '16px', // Body text, critical info
  standard: '14px',  // UI labels, secondary info
  large: '18px',     // Accent colors, headings
  bold: '14px',      // Bold can use accent colors at 14px
} as const;

/**
 * Verify if a text size is appropriate for a given contrast ratio
 */
export function isTextSizeAppropriate(
  contrast: number,
  textSize: number,
  isBold: boolean
): boolean {
  // Large text (≥18px) or bold text (≥14px) can use 3:1 ratio
  if (textSize >= 18 || (textSize >= 14 && isBold)) {
    return contrast >= 3;
  }
  
  // Normal text needs 4.5:1 ratio
  return contrast >= 4.5;
}

/**
 * Audit helpers for component development
 */
export const A11Y_AUDIT = {
  /**
   * Log color usage warnings for development
   */
  warnIfUnsafe(
    colorClass: string,
    textSize: number,
    isBold: boolean,
    componentName: string
  ) {
    if (process.env.NODE_ENV !== 'development') return;

    const warnings: string[] = [];

    // Check for accent colors on small text
    if (!isBold && textSize < 18) {
      if (colorClass.includes('text-primary') || 
          colorClass.includes('text-goblin-gold') || 
          colorClass.includes('text-terrain-purple')) {
        warnings.push(
          `⚠️ ${componentName}: Accent color "${colorClass}" on small text (${textSize}px). ` +
          `Use text-foreground or increase to ≥18px/14px bold.`
        );
      }
    }

    // Check for text under minimum size
    if (textSize < 14 && !colorClass.includes('text-xs')) {
      warnings.push(
        `⚠️ ${componentName}: Text size ${textSize}px is below recommended 14px minimum.`
      );
    }

    if (warnings.length > 0) {
      console.warn(warnings.join('\n'));
    }
  },
} as const;
