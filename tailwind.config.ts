import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
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
        ocean: {
          deep: "hsl(var(--ocean-deep))",
          dark: "hsl(var(--ocean-dark))",
          mid: "hsl(var(--ocean-mid))",
          light: "hsl(var(--ocean-light))",
        },
        seafoam: {
          DEFAULT: "hsl(var(--seafoam))",
          muted: "hsl(var(--seafoam-muted))",
          deep: "hsl(var(--seafoam-deep))",
        },
        sand: {
          DEFAULT: "hsl(var(--sand))",
          muted: "hsl(var(--sand-muted))",
        },
        coral: {
          DEFAULT: "hsl(var(--coral))",
          muted: "hsl(var(--coral-muted))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "breathe-in": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.2)", opacity: "1" },
        },
        "breathe-out": {
          "0%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0.6" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "wave": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(1deg)" },
          "66%": { transform: "translateY(-3px) rotate(-1deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 30px -10px hsl(185 50% 45% / 0.3)" },
          "50%": { boxShadow: "0 0 50px -5px hsl(185 50% 45% / 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "breathe-in": "breathe-in 4s ease-in-out",
        "breathe-out": "breathe-out 4s ease-in-out",
        "gentle-pulse": "gentle-pulse 4s ease-in-out infinite",
        "wave": "wave 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 1rem)',
        'safe-top': 'env(safe-area-inset-top, 1rem)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
