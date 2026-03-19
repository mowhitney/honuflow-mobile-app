import { motion } from "framer-motion";
import oceanBg from "@/assets/ocean-bg.jpg";

interface WaveBackgroundProps {
  /** Use image background (home/main screens) vs gradient-only (exercise screens) */
  variant?: "image" | "gradient";
}

export function WaveBackground({ variant = "image" }: WaveBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ocean image background with subtle Ken Burns effect */}
      {variant === "image" && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${oceanBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Dark overlay for text readability */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, hsl(193 38% 10% / 0.7) 0%, hsl(193 38% 8% / 0.6) 50%, hsl(193 38% 10% / 0.75) 100%)",
            }}
          />
        </>
      )}

      {/* Gradient-only background for exercise screens */}
      {variant === "gradient" && (
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(193 38% 15%) 0%, hsl(193 38% 12%) 40%, hsl(193 40% 10%) 100%)",
          }}
        />
      )}
      
      {/* Very slow moving gradient overlay - rhythmic like waves */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 120%, hsl(168 30% 60% / 0.08) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          y: ["0%", "-2%", "0%"],
        }}
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
          background: "radial-gradient(ellipse 100% 60% at 30% 80%, hsl(193 35% 25% / 0.3) 0%, transparent 50%)",
        }}
        animate={{
          x: ["-3%", "3%", "-3%"],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 70% 90%, hsl(168 28% 35% / 0.25) 0%, transparent 50%)",
        }}
        animate={{
          x: ["3%", "-3%", "3%"],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 22,
          delay: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, hsl(193 38% 8% / 0.4) 100%)",
        }}
      />

      {/* Very subtle floating particles - fewer and slower */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${25 + i * 25}%`,
            bottom: `${15 + (i % 2) * 10}%`,
            background: "hsl(168 30% 70% / 0.25)",
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
    </div>
  );
}
