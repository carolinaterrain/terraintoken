// Standardized spacing system for consistent layout
export const spacing = {
  section: {
    hero: 'pt-32 pb-20 md:pt-40 md:pb-24',
    major: 'py-20 md:py-24',
    standard: 'py-16 md:py-20',
    compact: 'py-12 md:py-16',
    minimal: 'py-8 md:py-12',
  },
  container: {
    default: 'px-4 md:px-6 lg:px-8',
    wide: 'px-4 md:px-8 lg:px-12',
    narrow: 'px-4 md:px-6 max-w-4xl mx-auto',
    full: 'px-0',
  },
  gap: {
    cards: 'gap-6 md:gap-8',
    items: 'gap-4 md:gap-6',
    inline: 'gap-2 md:gap-3',
    tight: 'gap-2',
  },
  touchTarget: {
    minimum: 'min-h-[44px] min-w-[44px]',
    comfortable: 'min-h-[48px] min-w-[48px]',
  },
} as const;

export const typography = {
  hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  h1: 'text-3xl sm:text-4xl md:text-5xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl',
  h3: 'text-xl sm:text-2xl md:text-3xl',
  h4: 'text-lg sm:text-xl md:text-2xl',
  body: 'text-base md:text-lg',
  small: 'text-sm md:text-base',
} as const;
