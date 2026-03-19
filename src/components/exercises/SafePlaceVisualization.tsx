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

const prompts = [
  { text: "Bring to mind a place where you felt safe", detail: "Real or imagined" },
  { text: "Notice what you see there", detail: "Colors, light, shapes..." },
  { text: "What do you hear in this place?", detail: "Sounds, silence..." },
  { text: "Feel the safety in your body", detail: "Where do you notice it?" },
  { text: "Let this feeling settle", detail: "You can return here anytime" },
];

export function SafePlaceVisualization({ onBack, onComplete }: ExerciseProps) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    if (step >= prompts.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 8000);

    return () => clearTimeout(timer);
  }, [step, isComplete]);

  const current = prompts[step];

  return (
    <ExerciseBackground exerciseId="safe-place" variant="gradient">
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      <header className="pt-4 pb-8 flex items-center justify-between">
        <BackButton onClick={onBack} label="Library" />
        <ExerciseSoundControls position="header" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={step}
              className="text-center max-w-sm"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5 }}
            >
              {/* Soft expanding glow */}
              <motion.div
                className="w-40 h-40 rounded-full mx-auto mb-10"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, hsl(168 40% 70% / 0.05) 50%, transparent 100%)",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Prompt */}
              <motion.p
                className="text-xl font-medium text-foreground mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {current?.text}
              </motion.p>

              {/* Detail */}
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {current?.detail}
              </motion.p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mt-10">
                {prompts.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-400 ${
                      i <= step ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ width: i === step ? 20 : 8 }}
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
        Your safe place is always with you.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        You can return there in a single breath.
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
