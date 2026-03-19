import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";
import { ExerciseBackground } from "@/components/ExerciseBackground";
import { Sparkles } from "lucide-react";

interface ExerciseProps {
  onBack: () => void;
  onComplete: () => void;
}

const emotionSuggestions = [
  "Tension", "Fear", "Sadness", "Frustration", 
  "Warmth", "Heaviness", "Numbness", "Uncertainty"
];

export function EmotionLabeling({ onBack, onComplete }: ExerciseProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const toggleEmotion = (emotion: string) => {
    setSelected((prev) => 
      prev.includes(emotion) 
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  return (
    <ExerciseBackground exerciseId="emotion-labeling" variant="gradient">
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
              className="text-center max-w-sm w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.p
                className="text-xl font-medium text-foreground mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                I'm noticing...
              </motion.p>
              
              <motion.p
                className="text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Name what's present. No judgment.
              </motion.p>

              {/* Emotion chips */}
              <motion.div 
                className="flex flex-wrap justify-center gap-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {emotionSuggestions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      selected.includes(emotion)
                        ? "bg-primary/20 text-foreground border border-primary/30"
                        : "bg-secondary/60 text-muted-foreground border border-transparent hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </motion.div>

              {/* Selected summary */}
              <AnimatePresence>
                {selected.length > 0 && (
                  <motion.p
                    className="text-sm text-muted-foreground italic mb-6"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    "I'm noticing {selected.join(", ").toLowerCase()}..."
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Validation */}
              <motion.p
                className="text-xs text-muted-foreground/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Naming creates distance. This is a skill.
              </motion.p>
            </motion.div>
          ) : (
            <CompletionScreen onBack={onBack} onComplete={onComplete} selected={selected} />
          )}
        </AnimatePresence>
      </main>

      {!isComplete && (
        <footer className="pb-8 pt-6 flex justify-center">
          <motion.button
            onClick={handleComplete}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {selected.length > 0 ? "I've named it" : "Skip"}
          </motion.button>
        </footer>
      )}
      </div>
    </ExerciseBackground>
  );
}

function CompletionScreen({ 
  onBack, 
  onComplete, 
  selected 
}: { 
  onBack: () => void; 
  onComplete: () => void;
  selected: string[];
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
        You named it.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        {selected.length > 0 
          ? "That awareness creates space to respond."
          : "Sometimes there are no words. That's okay too."}
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
