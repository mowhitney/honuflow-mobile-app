import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";
import { ExerciseBackground } from "@/components/ExerciseBackground";
import { Sparkles } from "lucide-react";

interface ExerciseProps {
  onBack: () => void;
  onComplete: () => void;
}

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const phaseLabels: Record<Phase, string> = {
  inhale: "Breathe in...",
  hold1: "Hold gently...",
  exhale: "Let it go...",
  hold2: "Rest...",
};

const phaseOrder: Phase[] = ["inhale", "hold1", "exhale", "hold2"];
const PHASE_DURATION = 4000; // 4 seconds each
const TOTAL_CYCLES = 5;

export function BoxBreathingExercise({ onBack, onComplete }: ExerciseProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      const currentIndex = phaseOrder.indexOf(phase);
      const nextIndex = (currentIndex + 1) % phaseOrder.length;
      
      if (nextIndex === 0) {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles >= TOTAL_CYCLES) {
          setIsComplete(true);
          return;
        }
      }
      
      setPhase(phaseOrder[nextIndex]);
    }, PHASE_DURATION);

    return () => clearTimeout(timer);
  }, [phase, cycles, isComplete]);

  const getCircleScale = () => {
    switch (phase) {
      case "inhale": return 1.3;
      case "hold1": return 1.3;
      case "exhale": return 0.8;
      case "hold2": return 0.8;
    }
  };

  return (
    <ExerciseBackground exerciseId="box-breathing" variant="gradient">
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      <header className="pt-4 pb-8 flex items-center justify-between">
        <BackButton onClick={onBack} label="Library" />
        <ExerciseSoundControls position="header" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="active"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Box-shaped breathing indicator */}
              <motion.div
                className="w-40 h-40 rounded-3xl mx-auto mb-12 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.2) 0%, transparent 70%)",
                  boxShadow: "0 0 40px -10px hsl(168 30% 60% / 0.3)",
                }}
                animate={{
                  scale: getCircleScale(),
                  borderRadius: phase === "hold1" || phase === "hold2" ? "24px" : "50%",
                }}
                transition={{
                  duration: 4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(168 30% 68% / 0.4) 0%, hsl(168 30% 60% / 0.1) 100%)",
                  }}
                  animate={{
                    scale: getCircleScale(),
                  }}
                  transition={{
                    duration: 4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </motion.div>

              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  className="text-xl font-medium text-foreground mb-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {phaseLabels[phase]}
                </motion.p>
              </AnimatePresence>

              <p className="text-sm text-muted-foreground">4 counts</p>

              {/* Cycle progress */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {[...Array(TOTAL_CYCLES)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i < cycles ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <CompletionScreen onBack={onBack} onComplete={onComplete} />
          )}
        </AnimatePresence>
      </main>
      </div>
    </ExerciseBackground>
  );
}

function CompletionScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  return (
    <motion.div
      className="text-center max-w-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-primary/12 flex items-center justify-center mx-auto mb-8"
        animate={{
          boxShadow: [
            "0 0 16px -4px hsl(168 30% 60% / 0.2)",
            "0 0 32px -4px hsl(168 30% 60% / 0.35)",
            "0 0 16px -4px hsl(168 30% 60% / 0.2)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </motion.div>

      <p className="text-lg text-foreground font-medium mb-3">
        Five cycles complete.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Your nervous system is settling.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
        >
          More exercises
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
        >
          I'm ready
        </button>
      </div>
    </motion.div>
  );
}
