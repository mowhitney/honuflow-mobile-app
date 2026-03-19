import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Eye, Hand, Ear, Heart, Wind } from "lucide-react";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";

interface GroundingExerciseProps {
  onBack: () => void;
}

const steps = [
  {
    count: 5,
    sense: "see",
    icon: Eye,
    prompt: "What are 5 things you can see around you?",
    hint: "Colors, shapes, light, shadows...",
  },
  {
    count: 4,
    sense: "touch",
    icon: Hand,
    prompt: "What are 4 things you can physically feel?",
    hint: "Your feet on the floor, fabric, temperature...",
  },
  {
    count: 3,
    sense: "hear",
    icon: Ear,
    prompt: "What are 3 sounds you can hear?",
    hint: "Near sounds, distant sounds, silence...",
  },
  {
    count: 2,
    sense: "smell",
    icon: Wind,
    prompt: "What are 2 things you can smell?",
    hint: "Or imagine 2 scents you love...",
  },
  {
    count: 1,
    sense: "feel",
    icon: Heart,
    prompt: "What is 1 thing you notice about your body right now?",
    hint: "No judgment, just noticing...",
  },
];

export function GroundingExercise({ onBack }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
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
              key={currentStep}
              className="text-center max-w-sm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-400 ${
                      i === currentStep
                        ? "bg-primary w-6"
                        : i < currentStep
                        ? "bg-primary/60"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <step.icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </motion.div>

              {/* Count */}
              <p className="text-3xl sm:text-4xl font-light text-primary mb-2">{step.count}</p>
              <p className="text-base text-sand-muted tracking-wide mb-8">
                {step.sense}
              </p>

              {/* Prompt */}
              <p className="text-base sm:text-lg text-foreground font-medium mb-3 leading-relaxed">
                {step.prompt}
              </p>
              <p className="text-sm text-muted-foreground">{step.hint}</p>
            </motion.div>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-8"
                animate={{
                  boxShadow: [
                    "0 0 24px -8px hsl(168 30% 60% / 0.25)",
                    "0 0 40px -4px hsl(168 30% 60% / 0.4)",
                    "0 0 24px -8px hsl(168 30% 60% / 0.25)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Heart className="w-11 h-11 text-primary" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-xl font-medium text-foreground mb-4">
                You're here.
              </h2>
              <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                You've returned to this moment. Take your time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="pb-8 pt-6">
        <div className="flex items-center justify-center">
          {!isComplete ? (
            <motion.button
              onClick={handleNext}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-base sm:text-lg glow-seafoam min-w-[120px]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentStep < steps.length - 1 ? "Next" : "Complete"}
            </motion.button>
          ) : (
            <div className="flex gap-4">
              <motion.button
                onClick={handleRestart}
                className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: [0.4, 0, 0.2, 1] }}
              >
                Do again
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
                Done
              </motion.button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
