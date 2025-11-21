// Standardized animation utilities
export const animations = {
  timing: {
    fast: '150ms',
    standard: '300ms',
    slow: '500ms',
  },
  easing: {
    entrance: 'ease-out',
    exit: 'ease-in',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  classes: {
    hoverScale: 'transition-transform duration-200 hover:scale-105',
    hoverLift: 'transition-all duration-300 hover:-translate-y-2 hover:shadow-glow',
    hoverGlow: 'transition-all duration-300 hover:shadow-glow',
    fadeIn: 'animate-fade-in',
    scaleIn: 'animate-scale-in',
    slideInRight: 'animate-slide-in-right',
  },
  stagger: (index: number, delay: number = 50) => ({
    animationDelay: `${index * delay}ms`,
  }),
} as const;

export const getStaggerDelay = (index: number, baseDelay: number = 50) => {
  return `${index * baseDelay}ms`;
};
