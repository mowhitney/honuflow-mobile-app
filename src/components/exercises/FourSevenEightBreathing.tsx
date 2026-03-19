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

type Phase = "inhale" | "hold" | "exhale";

const phaseDurations: Record<Phase, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
};

const phaseLabels: Record<Phase, string> = {
  inhale: "Breathe in...",
  hold: "Hold gently...",
  exhale: "Let it flow out...",
};

const phaseOrder: Phase[] = ["inhale", "hold", "exhale"];
const TOTAL_CYCLES = 4;

export function FourSevenEightBreathing({ onBack, onComplete }: ExerciseProps) {
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
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [phase, cycles, isComplete]);

  const getCircleScale = () => {
    switch (phase) {
      case "inhale": return 1.4;
      case "hold": return 1.4;
      case "exhale": return 0.7;
    }
  };

  return (
    <ExerciseBackground exerciseId="four-seven-eight" variant="gradient">
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
              {/* Breathing circle */}
              <motion.div
                className="w-44 h-44 rounded-full mx-auto mb-12"
                style={{
                  background: "radial-gradient(circle at 30% 30%, hsl(168 30% 74% / 0.35) 0%, hsl(168 30% 60% / 0.15) 50%, transparent 100%)",
                  boxShadow: "0 0 60px -15px hsl(168 30% 60% / 0.4)",
                }}
                animate={{
                  scale: getCircleScale(),
                  opacity: phase === "hold" ? 0.8 : 1,
                }}
                transition={{
                  duration: phaseDurations[phase] / 1000,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

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

              <p className="text-sm text-muted-foreground">
                {phase === "inhale" && "4 counts"}
                {phase === "hold" && "7 counts"}
                {phase === "exhale" && "8 counts"}
              </p>

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
        Your heart rate is slowing.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        The 4-7-8 pattern activates your rest response.
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
