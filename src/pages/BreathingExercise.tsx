import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingCircle } from "@/components/BreathingCircle";
import { BackButton } from "@/components/BackButton";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const phaseMessages: Record<Phase, string> = {
  inhale: "Breathe in...",
  hold: "Hold gently...",
  exhale: "Let it go...",
  rest: "Rest...",
};

const phaseDurations: Record<Phase, number> = {
  inhale: 4000,
  hold: 4000,
  exhale: 6000,
  rest: 2000,
};

const phaseOrder: Phase[] = ["inhale", "hold", "exhale", "rest"];

interface BreathingExerciseProps {
  onBack: () => void;
}

export function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("rest");
  const [cycleCount, setCycleCount] = useState(0);

  const advancePhase = useCallback(() => {
    setPhase((current) => {
      const currentIndex = phaseOrder.indexOf(current);
      const nextIndex = (currentIndex + 1) % phaseOrder.length;
      
      if (nextIndex === 0) {
        setCycleCount((c) => c + 1);
      }
      
      return phaseOrder[nextIndex];
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      advancePhase();
    }, phaseDurations[phase]);

    return () => clearTimeout(timeout);
  }, [isActive, phase, advancePhase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setCycleCount(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("rest");
    setCycleCount(0);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      <header className="pt-4 pb-8 flex items-center justify-between">
        <BackButton onClick={onBack} label="Tools" />
        <ExerciseSoundControls position="header" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Phase message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            className="text-xl font-light text-sand mb-12 h-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {isActive ? phaseMessages[phase] : "Ready when you are"}
          </motion.p>
        </AnimatePresence>

        {/* Breathing circle */}
        <BreathingCircle phase={phase} isActive={isActive} />

        {/* Cycle counter */}
        <motion.p
          className="text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {cycleCount > 0 ? `${cycleCount} breath${cycleCount !== 1 ? "s" : ""}` : "4-4-6-2 pattern — go at your own pace"}
        </motion.p>
      </main>

      {/* Controls */}
      <footer className="pb-8 pt-6">
        <div className="flex items-center justify-center gap-4">
          {!isActive ? (
            <motion.button
              onClick={handleStart}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg glow-seafoam"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Begin
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Pause className="w-4 h-4" />
                Pause
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/50 text-secondary-foreground font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            </>
          )}
        </div>
      </footer>

    </div>
  );
}
