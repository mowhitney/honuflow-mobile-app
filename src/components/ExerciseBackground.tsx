import { useMemo } from "react";
import { motion } from "framer-motion";
import { NatureEnvironment, exerciseEnvironmentMap, categoryEnvironmentMap } from "@/hooks/useNatureTheme";

// Import nature images - calm/dusk variants
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

interface ExerciseBackgroundProps {
  exerciseId?: string;
  category?: string;
  variant?: "image" | "gradient";
  /** Whether to use sunlit variant for warmth and hope */
  sunlit?: boolean;
  children: React.ReactNode;
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
const environmentSunlitOverlays: Record<NatureEnvironment, string> = {
  ocean: "linear-gradient(180deg, hsl(40 30% 20% / 0.25) 0%, hsl(40 25% 15% / 0.15) 50%, hsl(40 30% 20% / 0.3) 100%)",
  forest: "linear-gradient(180deg, hsl(80 25% 18% / 0.3) 0%, hsl(80 20% 15% / 0.2) 50%, hsl(80 25% 18% / 0.35) 100%)",
  lake: "linear-gradient(180deg, hsl(40 25% 20% / 0.25) 0%, hsl(40 20% 15% / 0.15) 50%, hsl(40 25% 20% / 0.3) 100%)",
  river: "linear-gradient(180deg, hsl(80 22% 18% / 0.3) 0%, hsl(80 18% 15% / 0.2) 50%, hsl(80 22% 18% / 0.35) 100%)",
  mountain: "linear-gradient(180deg, hsl(45 20% 20% / 0.25) 0%, hsl(45 15% 15% / 0.15) 50%, hsl(45 20% 20% / 0.3) 100%)",
};

const environmentGradients: Record<NatureEnvironment, string> = {
  ocean: "linear-gradient(180deg, hsl(193 35% 12%) 0%, hsl(193 30% 8%) 50%, hsl(193 35% 10%) 100%)",
  forest: "linear-gradient(180deg, hsl(140 25% 12%) 0%, hsl(140 20% 8%) 50%, hsl(140 25% 10%) 100%)",
  lake: "linear-gradient(180deg, hsl(220 25% 14%) 0%, hsl(220 20% 10%) 50%, hsl(220 25% 12%) 100%)",
  river: "linear-gradient(180deg, hsl(160 20% 13%) 0%, hsl(160 18% 9%) 50%, hsl(160 20% 11%) 100%)",
  mountain: "linear-gradient(180deg, hsl(30 15% 14%) 0%, hsl(30 12% 10%) 50%, hsl(30 15% 12%) 100%)",
};

export function ExerciseBackground({ 
  exerciseId, 
  category, 
  variant = "image",
  sunlit = false,
  children 
}: ExerciseBackgroundProps) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Determine environment based on exercise or category
  const environment = useMemo((): NatureEnvironment => {
    if (exerciseId && exerciseEnvironmentMap[exerciseId]) {
      return exerciseEnvironmentMap[exerciseId];
    }
    if (category && categoryEnvironmentMap[category]) {
      return categoryEnvironmentMap[category];
    }
    return "ocean";
  }, [exerciseId, category]);

  // Use sunlit variant when requested
  const imageSrc = sunlit ? environmentSunlitImages[environment] : environmentImages[environment];
  // Use lighter overlay for sunlit images to let brightness show through
  const overlay = sunlit ? environmentSunlitOverlays[environment] : environmentOverlays[environment];
  const gradient = environmentGradients[environment];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background layer */}
      {variant === "image" ? (
        <>
          {/* Nature image with subtle Ken Burns effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={prefersReducedMotion ? {} : { scale: 1.05 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          
          {/* Warm overlay for readability */}
          <div
            className="absolute inset-0"
            style={{ background: overlay }}
          />
          
          {/* Subtle vignette - lighter for sunlit images */}
          <div
            className="absolute inset-0"
            style={{
              background: sunlit
                ? "radial-gradient(ellipse at center, transparent 40%, hsl(40 20% 15% / 0.1) 100%)"
                : "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.25) 100%)",
            }}
          />
        </>
      ) : (
        <>
          {/* Gradient-only background for active exercises */}
          <div
            className="absolute inset-0"
            style={{ background: gradient }}
          />
          
          {/* Subtle animated pulse for rhythm */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.03, 0.08, 0.03],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: `radial-gradient(ellipse at center, hsl(168 30% 50% / 0.15) 0%, transparent 70%)`,
              }}
            />
          )}
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
