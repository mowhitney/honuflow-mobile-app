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

const anchorWords = ["safe", "grounded", "here", "calm", "okay"];
const INHALE_DURATION = 4000;
const EXHALE_DURATION = 6000;
const TOTAL_CYCLES = 5;

export function AnchorWordBreathing({ onBack, onComplete }: ExerciseProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!selectedWord || isComplete) return;

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
  }, [selectedWord, phase, cycles, isComplete]);

  if (!selectedWord) {
    return (
      <ExerciseBackground exerciseId="anchor-word" variant="gradient">
        <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
          <header className="pt-4 pb-8 flex items-center justify-between">
            <BackButton onClick={onBack} label="Library" />
            <ExerciseSoundControls position="header" />
          </header>

          <main className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-lg sm:text-xl font-medium text-foreground mb-3">
                Choose an anchor word
              </p>
              <p className="text-muted-foreground mb-8">
                You'll repeat this word on each exhale
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {anchorWords.map((word) => (
                  <button
                    key={word}
                    onClick={() => setSelectedWord(word)}
                    className="px-5 py-3 rounded-full bg-secondary/60 text-foreground border border-border/30 transition-all duration-300 hover:bg-secondary hover:border-primary/30"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </ExerciseBackground>
    );
  }

  return (
    <ExerciseBackground exerciseId="anchor-word" variant="gradient">
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
              {/* Breathing circle with word */}
              <motion.div
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-full mx-auto mb-10 sm:mb-12 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.2) 0%, transparent 70%)",
                }}
                animate={{
                  scale: phase === "inhale" ? [0.8, 1.2] : [1.2, 0.8],
                }}
                transition={{
                  duration: phase === "inhale" ? 4 : 6,
                  ease: "easeInOut",
                }}
              >
                <AnimatePresence mode="wait">
                  {phase === "exhale" && (
                    <motion.p
                      className="text-2xl font-medium text-primary"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedWord}
                    </motion.p>
                  )}
                </AnimatePresence>
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
                  {phase === "inhale" ? "Breathe in..." : `"${selectedWord}"...`}
                </motion.p>
              </AnimatePresence>

              <p className="text-sm text-muted-foreground">
                {phase === "inhale" ? "Quietly" : "Silently or softly on exhale"}
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
            <CompletionScreen onBack={onBack} onComplete={onComplete} word={selectedWord} />
          )}
        </AnimatePresence>
      </main>
      </div>
    </ExerciseBackground>
  );
}

function CompletionScreen({ 
  onBack, 
  onComplete,
  word 
}: { 
  onBack: () => void; 
  onComplete: () => void;
  word: string;
}) {
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
        "{word}" is now your anchor.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Return to it anytime you need to ground.
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
