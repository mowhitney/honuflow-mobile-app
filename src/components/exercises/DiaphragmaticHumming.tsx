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

type Phase = "inhale" | "hum";

const INHALE_DURATION = 4000;
const HUM_DURATION = 8000;
const TOTAL_CYCLES = 4;

export function DiaphragmaticHumming({ onBack, onComplete }: ExerciseProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const duration = phase === "inhale" ? INHALE_DURATION : HUM_DURATION;

    const timer = setTimeout(() => {
      if (phase === "hum") {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles >= TOTAL_CYCLES) {
          setIsComplete(true);
          return;
        }
      }
      setPhase(phase === "inhale" ? "hum" : "inhale");
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, cycles, isComplete]);

  return (
    <ExerciseBackground exerciseId="diaphragmatic-humming" variant="gradient">
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
              {/* Vibrating hum visualization */}
              <motion.div
                className="w-44 h-44 rounded-full mx-auto mb-12 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
              >
                <motion.div
                  className="w-28 h-28 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(168 30% 68% / 0.35) 0%, hsl(168 30% 60% / 0.1) 100%)",
                  }}
                  animate={phase === "hum" ? {
                    scale: [1, 1.05, 0.98, 1.02, 1],
                    boxShadow: [
                      "0 0 20px -5px hsl(168 30% 60% / 0.3)",
                      "0 0 40px -5px hsl(168 30% 60% / 0.5)",
                      "0 0 25px -5px hsl(168 30% 60% / 0.35)",
                      "0 0 35px -5px hsl(168 30% 60% / 0.45)",
                      "0 0 20px -5px hsl(168 30% 60% / 0.3)",
                    ],
                  } : {
                    scale: [0.8, 1.1],
                  }}
                  transition={{
                    duration: phase === "hum" ? 1 : 4,
                    repeat: phase === "hum" ? 7 : 0,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-xl font-medium text-foreground mb-2">
                    {phase === "inhale" ? "Belly breath in..." : "Hum gently... mmm..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {phase === "inhale" 
                      ? "Let your belly expand" 
                      : "Feel the vibration in your chest"}
                  </p>
                </motion.div>
              </AnimatePresence>

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
        Vagus nerve activated.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        The humming vibration calms your nervous system.
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
