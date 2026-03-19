import { motion } from "framer-motion";

interface BreathingCircleProps {
  phase: "inhale" | "hold" | "exhale" | "rest";
  isActive: boolean;
}

const phaseConfig = {
  inhale: { scale: 1.3, opacity: 1 },
  hold: { scale: 1.3, opacity: 0.95 },
  exhale: { scale: 0.7, opacity: 0.7 },
  rest: { scale: 0.7, opacity: 0.6 },
};

const phaseDurations = {
  inhale: 4,
  hold: 4,
  exhale: 6,
  rest: 2,
};

export function BreathingCircle({ phase, isActive }: BreathingCircleProps) {
  const config = phaseConfig[phase];
  const duration = phaseDurations[phase];

  return (
    <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64">
      {/* Outer glow rings */}
      <motion.div
        className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(168 30% 68% / 0.2) 0%, transparent 70%)",
        }}
        animate={isActive ? {
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.7, 0.5],
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
      
      <motion.div
        className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(168 28% 55% / 0.12) 0%, transparent 70%)",
        }}
        animate={isActive ? {
          scale: [1.05, 1, 1.05],
          opacity: [0.4, 0.55, 0.4],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Main breathing circle */}
      <motion.div
        className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full breathing-circle"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(168 30% 74% / 0.6) 0%, hsl(168 30% 60% / 0.35) 50%, hsl(168 30% 50% / 0.18) 100%)",
          boxShadow: "0 0 60px -4px hsl(168 30% 60% / 0.5), 0 0 100px -10px hsl(168 30% 70% / 0.3), inset 0 0 40px -8px hsl(168 35% 80% / 0.25)",
          border: "1px solid hsl(168 30% 70% / 0.25)",
        }}
        animate={isActive ? {
          scale: config.scale,
          opacity: config.opacity,
        } : { scale: 0.9, opacity: 0.6 }}
        transition={{
          duration: duration,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Inner highlight */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, hsl(168 35% 85% / 0.45) 0%, transparent 60%)",
          }}
          animate={isActive ? {
            opacity: [0.5, 0.75, 0.5],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </motion.div>

      {/* Particle effects */}
      {isActive && [0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-seafoam/45"
          style={{
            left: `${50 + Math.cos(i * 72 * Math.PI / 180) * 40}%`,
            top: `${50 + Math.sin(i * 72 * Math.PI / 180) * 40}%`,
          }}
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 0.65, 0.3],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3.5,
            delay: i * 0.4,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}
