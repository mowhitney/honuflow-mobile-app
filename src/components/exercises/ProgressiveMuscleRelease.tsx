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

type Phase = "tense" | "release";

const muscleGroups = [
  { name: "Feet", tense: "Curl your toes tightly", release: "Let them soften" },
  { name: "Legs", tense: "Tighten your legs", release: "Let them go heavy" },
  { name: "Belly", tense: "Tighten your belly", release: "Let it be soft" },
  { name: "Shoulders", tense: "Raise shoulders to ears", release: "Drop them down" },
  { name: "Face", tense: "Scrunch your face", release: "Smooth and relax" },
];

export function ProgressiveMuscleRelease({ onBack, onComplete }: ExerciseProps) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("tense");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    if (step >= muscleGroups.length) {
      setIsComplete(true);
      return;
    }

    const duration = phase === "tense" ? 5000 : 5000;

    const timer = setTimeout(() => {
      if (phase === "tense") {
        setPhase("release");
      } else {
        setPhase("tense");
        setStep((s) => s + 1);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [step, phase, isComplete]);

  const current = muscleGroups[step];

  return (
    <ExerciseBackground exerciseId="progressive-muscle" variant="gradient">
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      <header className="pt-4 pb-8 flex items-center justify-between">
        <BackButton onClick={onBack} label="Library" />
        <ExerciseSoundControls position="header" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={`${step}-${phase}`}
              className="text-center max-w-sm"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.35 }}
            >
              {/* Tense/release visual */}
              <motion.div
                className="w-36 h-36 rounded-full mx-auto mb-10"
                style={{
                  background: phase === "tense" 
                    ? "radial-gradient(circle, hsl(168 30% 50% / 0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
                animate={{
                  scale: phase === "tense" ? 0.85 : 1.1,
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                }}
              />

              {/* Body part */}
              <motion.p
                className="text-2xl font-medium text-foreground mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {current?.name}
              </motion.p>

              {/* Instruction */}
              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {phase === "tense" ? current?.tense : current?.release}
              </motion.p>

              {/* Phase indicator */}
              <motion.p
                className="text-sm text-primary mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {phase === "tense" ? "Tense for 5 seconds..." : "Release for 5 seconds..."}
              </motion.p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {muscleGroups.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-400 ${
                      i < step || (i === step && phase === "release") ? "bg-primary" : "bg-muted"
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
        Your body has released.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Notice where tension has softened.
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
