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

const tappingPoints = [
  { name: "Side of hand", instruction: "Tap the outer edge of your hand", duration: 6000 },
  { name: "Eyebrow", instruction: "Tap gently above the inner eyebrow", duration: 6000 },
  { name: "Side of eye", instruction: "Tap beside the outer corner of eye", duration: 6000 },
  { name: "Under eye", instruction: "Tap on the bone under your eye", duration: 6000 },
  { name: "Collarbone", instruction: "Tap below your collarbone", duration: 6000 },
  { name: "Under arm", instruction: "Tap about 4 inches below armpit", duration: 6000 },
  { name: "Top of head", instruction: "Tap gently on top of your head", duration: 6000 },
];

export function EFTTapping({ onBack, onComplete }: ExerciseProps) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    if (step >= tappingPoints.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, tappingPoints[step].duration);

    return () => clearTimeout(timer);
  }, [step, isComplete]);

  const currentPoint = tappingPoints[step];

  return (
    <ExerciseBackground exerciseId="eft-tapping" variant="gradient">
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
              transition={{ duration: 0.35 }}
            >
              {/* Tapping animation */}
              <motion.div
                className="w-32 h-32 rounded-full mx-auto mb-10 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-primary/40"
                  animate={{
                    scale: [1, 0.7, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                  }}
                />
              </motion.div>

              {/* Point name */}
              <motion.p
                className="text-2xl font-medium text-foreground mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {currentPoint?.name}
              </motion.p>

              {/* Instruction */}
              <motion.p
                className="text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentPoint?.instruction}
              </motion.p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2">
                {tappingPoints.map((_, i) => (
                  <motion.div
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
        Tapping complete.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Energy points activated. Notice any shifts.
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
