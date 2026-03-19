import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Sparkles } from "lucide-react";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";

interface QuickResetProps {
  onBack: () => void;
}

const affirmations = [
  "This moment is hard. You're doing it anyway.",
  "Your nervous system is trying to protect you.",
  "It's okay to feel what you're feeling.",
  "You're allowed to pause.",
  "This will pass.",
  "You are not your thoughts right now.",
  "One breath at a time.",
];

export function QuickReset({ onBack }: QuickResetProps) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [affirmation] = useState(
    () => affirmations[Math.floor(Math.random() * affirmations.length)]
  );

  const steps = [
    {
      instruction: "Let your shoulders drop",
      duration: 3000,
    },
    {
      instruction: "Soften your jaw",
      duration: 3000,
    },
    {
      instruction: "Let your belly be soft",
      duration: 3000,
    },
    {
      instruction: "One slow breath",
      duration: 4000,
    },
  ];

  useEffect(() => {
    if (step >= steps.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, steps[step].duration);

    return () => clearTimeout(timer);
  }, [step, steps.length]);

  const handleRestart = () => {
    setStep(0);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      <header className="pt-4 pb-8 flex items-center justify-between">
        <BackButton onClick={onBack} label="Tools" />
        <ExerciseSoundControls position="header" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={step}
              className="text-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Pulsing circle */}
              <motion.div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full mx-auto mb-10 sm:mb-12 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <motion.div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(168 30% 68% / 0.25) 0%, hsl(168 30% 60% / 0.08) 100%)",
                    boxShadow: "0 0 32px -8px hsl(168 30% 60% / 0.3)",
                  }}
                  animate={{
                    scale: [0.92, 1, 0.92],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.4,
                  }}
                />
              </motion.div>

              {/* Instruction */}
              <motion.p
                className="text-lg sm:text-xl font-medium text-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: [0.4, 0, 0.2, 1] }}
              >
                {steps[step]?.instruction}
              </motion.p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-400 ${
                      i <= step ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ width: i === step ? 28 : 8 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="w-18 h-18 rounded-full bg-primary/12 flex items-center justify-center mx-auto mb-8"
                animate={{
                  boxShadow: [
                    "0 0 16px -4px hsl(168 30% 60% / 0.2)",
                    "0 0 32px -4px hsl(168 30% 60% / 0.35)",
                    "0 0 16px -4px hsl(168 30% 60% / 0.2)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Sparkles className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </motion.div>

              <p className="text-lg text-foreground font-medium mb-6 leading-relaxed">
                {affirmation}
              </p>

              <p className="text-sm text-muted-foreground">
                You can stay here as long as you need.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="pb-8 pt-6">
        <div className="flex items-center justify-center gap-4">
          {isComplete && (
            <>
              <motion.button
                onClick={handleRestart}
                className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: [0.4, 0, 0.2, 1] }}
              >
                Again
              </motion.button>
              <motion.button
                onClick={onBack}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
              >
                I'm ready
              </motion.button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
