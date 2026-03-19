import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Heart } from "lucide-react";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";

interface EuthanasiaResetProps {
  onBack: () => void;
}

type Phase = "intro" | "breathe" | "ground" | "truth" | "complete";

const compassionateTruths = [
  "Providing a peaceful passing is an act of care.",
  "You gave them comfort when it mattered most.",
  "Being present through the end is a gift.",
  "What you did was an act of compassion.",
  "You honored their dignity.",
];

export function EuthanasiaReset({ onBack }: EuthanasiaResetProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [truth] = useState(() => 
    compassionateTruths[Math.floor(Math.random() * compassionateTruths.length)]
  );

  // Phase timing
  useEffect(() => {
    let timer: NodeJS.Timeout;

    switch (phase) {
      case "intro":
        timer = setTimeout(() => setPhase("breathe"), 4000);
        break;
      case "breathe":
        // Handled by breath cycle effect
        break;
      case "ground":
        timer = setTimeout(() => setPhase("truth"), 6000);
        break;
      case "truth":
        timer = setTimeout(() => setPhase("complete"), 8000);
        break;
    }

    return () => clearTimeout(timer);
  }, [phase]);

  // Slow breathing cycle: inhale 5s, hold 3s, exhale 7s
  useEffect(() => {
    if (phase !== "breathe") return;

    let timer: NodeJS.Timeout;

    if (breathPhase === "inhale") {
      timer = setTimeout(() => setBreathPhase("hold"), 5000);
    } else if (breathPhase === "hold") {
      timer = setTimeout(() => setBreathPhase("exhale"), 3000);
    } else {
      timer = setTimeout(() => setPhase("ground"), 7000);
    }

    return () => clearTimeout(timer);
  }, [phase, breathPhase]);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      {/* Header - subtle, only on intro */}
      {phase === "intro" && (
        <header className="pt-4 pb-8 flex items-center justify-between px-6">
          <BackButton onClick={onBack} label="Home" />
          <ExerciseSoundControls position="header" />
        </header>
      )}

      {/* Floating sound control for other phases */}
      {phase !== "intro" && phase !== "complete" && (
        <ExerciseSoundControls position="floating" />
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* Intro */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Heart className="w-6 h-6 text-coral" strokeWidth={1.5} />
              </motion.div>
              <motion.p
                className="text-lg text-foreground mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Take a moment.
              </motion.p>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                This is a space to pause.
              </motion.p>
            </motion.div>
          )}

          {/* One slow breathing cycle */}
          {phase === "breathe" && (
            <motion.div
              key="breathe"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Breathing circle */}
              <motion.div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-8 sm:mb-10"
                style={{
                  background: "radial-gradient(circle at 30% 30%, hsl(168 30% 74% / 0.3) 0%, hsl(168 30% 60% / 0.12) 50%, transparent 100%)",
                  boxShadow: "0 0 50px -15px hsl(168 30% 60% / 0.35)",
                }}
                animate={{
                  scale: breathPhase === "inhale" ? 1.25 : breathPhase === "hold" ? 1.25 : 0.75,
                  opacity: breathPhase === "exhale" ? 0.5 : 1,
                }}
                transition={{
                  duration: breathPhase === "inhale" ? 5 : breathPhase === "hold" ? 0.3 : 7,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              <AnimatePresence mode="wait">
                <motion.p
                  key={breathPhase}
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {breathPhase === "inhale" && "Breathe in slowly..."}
                  {breathPhase === "hold" && "Hold gently..."}
                  {breathPhase === "exhale" && "Let it all go..."}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Grounding body cue */}
          {phase === "ground" && (
            <motion.div
              key="ground"
              className="text-center max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-8"
                style={{
                  background: "radial-gradient(circle, hsl(168 30% 60% / 0.15) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              <motion.p
                className="text-lg text-foreground mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Place your hand on your heart.
              </motion.p>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Feel your own presence.
              </motion.p>
            </motion.div>
          )}

          {/* Compassionate truth */}
          {phase === "truth" && (
            <motion.div
              key="truth"
              className="text-center max-w-sm px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-8"
                animate={{
                  boxShadow: [
                    "0 0 20px -5px hsl(23 55% 68% / 0.15)",
                    "0 0 35px -5px hsl(23 55% 68% / 0.25)",
                    "0 0 20px -5px hsl(23 55% 68% / 0.15)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Heart className="w-7 h-7 text-coral" strokeWidth={1.5} />
              </motion.div>
              <motion.p
                className="text-xl font-medium text-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {truth}
              </motion.p>
            </motion.div>
          )}

          {/* Complete */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-lg text-foreground mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                You're still here.
              </motion.p>
              <motion.p
                className="text-muted-foreground mb-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Take all the time you need.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - only show on complete */}
      {phase === "complete" && (
        <motion.footer
          className="pb-8 pt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onBack}
            className="w-full max-w-xs mx-auto block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Return home
          </button>
        </motion.footer>
      )}
    </div>
  );
}
