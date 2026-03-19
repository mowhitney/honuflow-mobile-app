import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";
import { ExerciseBackground } from "@/components/ExerciseBackground";
import { Eye, Hand, Ear, Wind, Heart, Sparkles } from "lucide-react";

interface ExerciseProps {
  onBack: () => void;
  onComplete: () => void;
}

const senses = [
  { count: 5, sense: "see", icon: Eye, prompt: "Name 5 things you can see", hint: "Colors, shapes, light..." },
  { count: 4, sense: "feel", icon: Hand, prompt: "Name 4 things you can feel", hint: "Textures, temperature..." },
  { count: 3, sense: "hear", icon: Ear, prompt: "Name 3 sounds you hear", hint: "Near, far, quiet..." },
  { count: 2, sense: "smell", icon: Wind, prompt: "Name 2 things you smell", hint: "Or imagine 2 scents you love" },
  { count: 1, sense: "body", icon: Heart, prompt: "Notice 1 thing about your body", hint: "No judgment, just noticing" },
];

export function SensoryAnchoring({ onBack, onComplete }: ExerciseProps) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (step < senses.length - 1) {
      setStep((s) => s + 1);
    } else {
      setIsComplete(true);
    }
  };

  const current = senses[step];
  const Icon = current?.icon || Eye;

  return (
    <ExerciseBackground exerciseId="sensory-anchoring" variant="gradient">
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
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {senses.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-400 ${
                      i === step ? "bg-primary w-6" : i < step ? "bg-primary/60" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </motion.div>

              {/* Count */}
              <p className="text-3xl sm:text-4xl font-light text-primary mb-2">{current?.count}</p>
              <p className="text-sm text-muted-foreground tracking-wide mb-8">{current?.sense}</p>

              {/* Prompt */}
              <p className="text-lg text-foreground font-medium mb-3">{current?.prompt}</p>
              <p className="text-sm text-muted-foreground">{current?.hint}</p>
            </motion.div>
          ) : (
            <CompletionScreen onBack={onBack} onComplete={onComplete} />
          )}
        </AnimatePresence>
      </main>

      {!isComplete && (
        <footer className="pb-8 pt-6 flex justify-center">
          <motion.button
            onClick={handleNext}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {step < senses.length - 1 ? "Next" : "Complete"}
          </motion.button>
        </footer>
      )}
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
        You're here.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Anchored in this moment.
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
