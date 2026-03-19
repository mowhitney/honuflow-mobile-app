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

const bodyParts = [
  { area: "Head", prompt: "Notice any sensations in your head" },
  { area: "Shoulders", prompt: "Feel your shoulders... tight or relaxed?" },
  { area: "Chest", prompt: "Notice your chest, your breath" },
  { area: "Belly", prompt: "Feel your belly... any holding?" },
  { area: "Legs & Feet", prompt: "Notice your legs and feet on the ground" },
];

export function BodyScan({ onBack, onComplete }: ExerciseProps) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    if (step >= bodyParts.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 4000);

    return () => clearTimeout(timer);
  }, [step, isComplete]);

  const current = bodyParts[step];

  return (
    <ExerciseBackground exerciseId="body-scan" variant="gradient">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {/* Scanning visual - vertical line moving down */}
              <div className="relative w-20 h-40 mx-auto mb-10">
                <div className="absolute inset-0 rounded-full bg-primary/5" />
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-primary/40 rounded-full"
                  animate={{
                    top: `${(step / (bodyParts.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Area name */}
              <motion.p
                className="text-xl font-medium text-foreground mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {current?.area}
              </motion.p>

              {/* Prompt */}
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {current?.prompt}
              </motion.p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mt-10">
                {bodyParts.map((_, i) => (
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
        Scan complete.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Just noticing, without judgment.
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
