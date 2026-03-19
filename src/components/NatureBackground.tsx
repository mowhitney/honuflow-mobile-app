import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { NatureEnvironment } from "@/hooks/useNatureTheme";

// Import all nature images - calm/dusk variants
import oceanBg from "@/assets/ocean-bg.jpg";
import forestBg from "@/assets/forest-bg.jpg";
import lakeBg from "@/assets/lake-bg.jpg";
import riverBg from "@/assets/river-bg.jpg";
import mountainBg from "@/assets/mountain-bg.jpg";

// Import sunlit variants for warmth and hope
import oceanSunlitBg from "@/assets/ocean-sunlit-bg.jpg";
import forestSunlitBg from "@/assets/forest-sunlit-bg.jpg";
import lakeSunlitBg from "@/assets/lake-sunlit-bg.jpg";
import riverSunlitBg from "@/assets/river-sunlit-bg.jpg";
import mountainSunlitBg from "@/assets/mountain-sunlit-bg.jpg";

interface NatureBackgroundProps {
  environment: NatureEnvironment;
  /** Whether to show the full image or just gradient (for focus screens) */
  variant?: "image" | "gradient";
  /** Whether to use sunlit variant for warmth and hope */
  sunlit?: boolean;
}

const environmentImages: Record<NatureEnvironment, string> = {
  ocean: oceanBg,
  forest: forestBg,
  lake: lakeBg,
  river: riverBg,
  mountain: mountainBg,
};

const environmentSunlitImages: Record<NatureEnvironment, string> = {
  ocean: oceanSunlitBg,
  forest: forestSunlitBg,
  lake: lakeSunlitBg,
  river: riverSunlitBg,
  mountain: mountainSunlitBg,
};

const environmentOverlays: Record<NatureEnvironment, string> = {
  ocean: "linear-gradient(180deg, hsl(193 38% 10% / 0.7) 0%, hsl(193 38% 8% / 0.55) 50%, hsl(193 38% 10% / 0.75) 100%)",
  forest: "linear-gradient(180deg, hsl(140 25% 12% / 0.75) 0%, hsl(140 20% 10% / 0.6) 50%, hsl(140 25% 12% / 0.8) 100%)",
  lake: "linear-gradient(180deg, hsl(220 25% 15% / 0.7) 0%, hsl(220 20% 12% / 0.55) 50%, hsl(220 25% 15% / 0.75) 100%)",
  river: "linear-gradient(180deg, hsl(160 20% 14% / 0.7) 0%, hsl(160 18% 11% / 0.55) 50%, hsl(160 20% 14% / 0.75) 100%)",
  mountain: "linear-gradient(180deg, hsl(30 15% 14% / 0.7) 0%, hsl(30 12% 11% / 0.55) 50%, hsl(30 15% 14% / 0.75) 100%)",
};

// Lighter overlays for sunlit images - lets brightness show through
// Slightly darkened overlays for sunlit images - improves text readability while preserving warmth
const environmentSunlitOverlays: Record<NatureEnvironment, string> = {
  ocean: "linear-gradient(180deg, hsl(40 30% 15% / 0.4) 0%, hsl(40 25% 12% / 0.3) 50%, hsl(40 30% 15% / 0.45) 100%)",
  forest: "linear-gradient(180deg, hsl(80 25% 14% / 0.45) 0%, hsl(80 20% 12% / 0.35) 50%, hsl(80 25% 14% / 0.5) 100%)",
  lake: "linear-gradient(180deg, hsl(40 25% 15% / 0.4) 0%, hsl(40 20% 12% / 0.3) 50%, hsl(40 25% 15% / 0.45) 100%)",
  river: "linear-gradient(180deg, hsl(80 22% 14% / 0.45) 0%, hsl(80 18% 12% / 0.35) 50%, hsl(80 22% 14% / 0.5) 100%)",
  mountain: "linear-gradient(180deg, hsl(45 20% 15% / 0.4) 0%, hsl(45 15% 12% / 0.3) 50%, hsl(45 20% 15% / 0.45) 100%)",
};

const environmentGradients: Record<NatureEnvironment, string> = {
  ocean: "linear-gradient(180deg, hsl(193 38% 15%) 0%, hsl(193 38% 12%) 40%, hsl(193 40% 10%) 100%)",
  forest: "linear-gradient(180deg, hsl(140 25% 15%) 0%, hsl(140 22% 12%) 40%, hsl(140 28% 10%) 100%)",
  lake: "linear-gradient(180deg, hsl(220 25% 16%) 0%, hsl(220 22% 13%) 40%, hsl(220 28% 11%) 100%)",
  river: "linear-gradient(180deg, hsl(160 22% 15%) 0%, hsl(160 20% 12%) 40%, hsl(160 25% 10%) 100%)",
  mountain: "linear-gradient(180deg, hsl(30 18% 16%) 0%, hsl(30 15% 13%) 40%, hsl(30 20% 11%) 100%)",
};

const environmentAccents: Record<NatureEnvironment, { primary: string; secondary: string }> = {
  ocean: {
    primary: "hsl(168 30% 60% / 0.08)",
    secondary: "hsl(193 35% 25% / 0.3)",
  },
  forest: {
    primary: "hsl(140 35% 50% / 0.08)",
    secondary: "hsl(140 30% 25% / 0.3)",
  },
  lake: {
    primary: "hsl(220 30% 55% / 0.08)",
    secondary: "hsl(220 25% 30% / 0.3)",
  },
  river: {
    primary: "hsl(160 30% 50% / 0.08)",
    secondary: "hsl(160 25% 28% / 0.3)",
  },
  mountain: {
    primary: "hsl(30 25% 55% / 0.08)",
    secondary: "hsl(30 20% 30% / 0.3)",
  },
};

export function NatureBackground({ environment, variant = "image", sunlit = false }: NatureBackgroundProps) {
  // Use sunlit variant when requested for warmer, more hopeful feel
  const image = sunlit ? environmentSunlitImages[environment] : environmentImages[environment];
  // Use lighter overlay for sunlit images to let brightness show through
  const overlay = sunlit ? environmentSunlitOverlays[environment] : environmentOverlays[environment];
  const gradient = environmentGradients[environment];
  const accents = environmentAccents[environment];

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={environment}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Image background with subtle Ken Burns effect */}
          {variant === "image" && (
            <>
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Readability overlay */}
              <div
                className="absolute inset-0"
                style={{ background: overlay }}
              />
            </>
          )}

          {/* Gradient-only background for focus screens */}
          {variant === "gradient" && (
            <div
              className="absolute inset-0"
              style={{ background: gradient }}
            />
          )}

          {/* Slow moving gradient overlay - rhythmic motion */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 120% 80% at 50% 120%, ${accents.primary} 0%, transparent 50%)`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    opacity: [0.3, 0.6, 0.3],
                    y: ["0%", "-2%", "0%"],
                  }
            }
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Secondary slow gradient - gentle horizontal sway */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 100% 60% at 30% 80%, ${accents.secondary} 0%, transparent 50%)`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: ["-3%", "3%", "-3%"],
                    opacity: [0.2, 0.4, 0.2],
                  }
            }
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Tertiary accent gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 70% 90%, ${accents.secondary} 0%, transparent 50%)`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: ["3%", "-3%", "3%"],
                    opacity: [0.15, 0.35, 0.15],
                  }
            }
            transition={{
              duration: 22,
              delay: 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Subtle vignette for depth - lighter for sunlit images */}
          <div
            className="absolute inset-0"
            style={{
              background: sunlit
                ? "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 0%, hsl(40 20% 15% / 0.15) 100%)"
                : "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, hsl(193 38% 8% / 0.4) 100%)",
            }}
          />

          {/* Very subtle floating particles */}
          {!prefersReducedMotion &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${25 + i * 25}%`,
                  bottom: `${15 + (i % 2) * 10}%`,
                  background: `hsl(168 30% 70% / 0.25)`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.1, 0.25, 0.1],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 10 + i * 3,
                  delay: i * 2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
