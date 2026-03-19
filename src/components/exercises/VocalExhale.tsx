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

type Phase = "inhale" | "exhale";

const INHALE_DURATION = 4000;
const EXHALE_DURATION = 8000;
const TOTAL_CYCLES = 4;

export function VocalExhale({ onBack, onComplete }: ExerciseProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const duration = phase === "inhale" ? INHALE_DURATION : EXHALE_DURATION;

    const timer = setTimeout(() => {
      if (phase === "exhale") {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles >= TOTAL_CYCLES) {
          setIsComplete(true);
          return;
        }
      }
      setPhase(phase === "inhale" ? "exhale" : "inhale");
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, cycles, isComplete]);

  return (
    <ExerciseBackground exerciseId="vocal-exhale" variant="gradient">
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
              {/* Sound wave visualization for exhale */}
              <motion.div
                className="w-44 h-44 rounded-full mx-auto mb-12 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
              >
                {phase === "exhale" ? (
                  <motion.div
                    className="flex gap-1 items-end h-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-primary/60 rounded-full"
                        animate={{
                          height: [h * 30, h * 50, h * 30],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="w-20 h-20 rounded-full"
                    style={{
                      background: "radial-gradient(circle, hsl(168 30% 68% / 0.3) 0%, transparent 100%)",
                    }}
                    animate={{
                      scale: [0.7, 1.2],
                    }}
                    transition={{
                      duration: 4,
                      ease: "easeInOut",
                    }}
                  />
                )}
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
                    {phase === "inhale" ? "Breathe in..." : "Let out a soft \"ahh\" or \"mmm\"..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {phase === "inhale" 
                      ? "Fill your belly" 
                      : "Let the sound flow out slowly"}
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
        Vagus nerve toned.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Vocal vibration calms the nervous system.
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
