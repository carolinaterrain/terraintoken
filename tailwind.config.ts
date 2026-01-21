import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['JetBrains Mono', 'Space Grotesk', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        terrain: {
          glow: "hsl(var(--terrain-glow))",
          dark: "hsl(var(--terrain-dark))",
          shadow: "hsl(var(--terrain-shadow))",
          deep: "hsl(var(--terrain-deep))",
          purple: "hsl(var(--terrain-purple))",
        },
        goblin: {
          green: "hsl(var(--goblin-green))",
          gold: "hsl(var(--goblin-gold))",
        },
        earth: {
          brown: "hsl(var(--earth-brown))",
          green: "hsl(var(--forest-green))",
          red: "hsl(var(--clay-red))",
          gray: "hsl(var(--stone-gray))",
        },
        // Industrial DePIN colors
        "safety-green": "hsl(var(--safety-green))",
        "solana-purple": "hsl(var(--solana-purple))",
        slate: {
          950: "hsl(222 47% 5%)",
          900: "hsl(222 47% 8%)",
          800: "hsl(222 47% 11%)",
          700: "hsl(217 33% 17%)",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        disco: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        dance: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        blink: {
          "0%, 95%, 100%": { transform: "scaleY(1)" },
          "97%": { transform: "scaleY(0.1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(142 76% 36% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(142 84% 47% / 0.6)" },
        },
        "grid-shift": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "100%": { transform: "translateX(-20px) translateY(-20px)" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-text": {
          "0%, 100%": { textShadow: "0 0 20px hsl(142 76% 39% / 0.5)" },
          "50%": { textShadow: "0 0 40px hsl(142 84% 47% / 0.9)" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "hsl(142 76% 39% / 0.5)" },
          "50%": { borderColor: "hsl(142 84% 47% / 1)" },
        },
        "urgency-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        disco: "disco 2s linear infinite",
        dance: "dance 0.5s ease-in-out infinite",
        "slide-right": "slide-right 10s linear infinite",
        "scroll-left": "scroll-left 40s linear infinite",
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        blink: "blink 8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "grid-shift": "grid-shift 15s linear infinite",
        "slide-in-down": "slide-in-down 0.5s ease-out",
        "glow-text": "glow-text 2s ease-in-out infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
        "urgency-pulse": "urgency-pulse 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
