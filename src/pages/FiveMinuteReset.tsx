import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Wind, Hand, Brain } from "lucide-react";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";

type ResetType = "breathe" | "body" | "thoughts" | null;
type Screen = "orientation" | "choose" | "reset" | "grounding" | "closing";

interface FiveMinuteResetProps {
  onBack: () => void;
  onSaveTruth?: (truth: string) => void;
}

const suggestedTruths = [
  "I did the best I could with what I had.",
  "This feeling will pass.",
  "I am allowed to feel this way.",
  "My worth is not measured by this moment.",
  "I showed up. That matters.",
];

export function FiveMinuteReset({ onBack, onSaveTruth }: FiveMinuteResetProps) {
  const [screen, setScreen] = useState<Screen>("orientation");
  const [resetType, setResetType] = useState<ResetType>(null);
  const [selectedTruth, setSelectedTruth] = useState<string>("");
  const [customThought, setCustomThought] = useState("");

  // Auto-advance from orientation
  useEffect(() => {
    if (screen === "orientation") {
      const timer = setTimeout(() => {
        setScreen("choose");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Auto-advance from choose if no selection
  useEffect(() => {
    if (screen === "choose") {
      const timer = setTimeout(() => {
        if (!resetType) {
          setResetType("breathe");
        }
        setScreen("reset");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [screen, resetType]);

  const handleChooseType = (type: ResetType) => {
    setResetType(type);
    setScreen("reset");
  };

  const handleResetComplete = () => {
    setScreen("grounding");
  };

  const handleGroundingComplete = () => {
    setScreen("closing");
  };

  const handleSaveTruth = () => {
    if (selectedTruth && onSaveTruth) {
      onSaveTruth(selectedTruth);
    }
    onBack();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col relative z-10">
      <AnimatePresence mode="wait">
        {screen === "orientation" && (
          <OrientationScreen key="orientation" />
        )}
        {screen === "choose" && (
          <ChooseScreen key="choose" onChoose={handleChooseType} />
        )}
        {screen === "reset" && (
          <ResetScreen 
            key="reset" 
            type={resetType || "breathe"} 
            onComplete={handleResetComplete}
            customThought={customThought}
            setCustomThought={setCustomThought}
          />
        )}
        {screen === "grounding" && (
          <GroundingScreen 
            key="grounding" 
            selectedTruth={selectedTruth}
            setSelectedTruth={setSelectedTruth}
            onComplete={handleGroundingComplete}
          />
        )}
        {screen === "closing" && (
          <ClosingScreen 
            key="closing" 
            onBack={onBack}
            onSaveTruth={handleSaveTruth}
            hasTruth={!!selectedTruth}
          />
        )}
      </AnimatePresence>

      {/* Back button and sound - only show on certain screens */}
      {(screen === "choose" || screen === "reset") && (
        <div className="absolute top-0 left-0 right-0 pt-safe-top px-6 pt-4 z-20 flex items-center justify-between">
          <BackButton onClick={onBack} label="Exit" />
          <ExerciseSoundControls position="header" />
        </div>
      )}
    </div>
  );
}

// Screen 1: Orientation
function OrientationScreen() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.p
        className="text-xl sm:text-2xl font-medium text-foreground mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        You're safe to pause.
      </motion.p>
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        A few minutes, just for you.
      </motion.p>
    </motion.div>
  );
}

// Screen 2: Choose Reset Type
function ChooseScreen({ onChoose }: { onChoose: (type: ResetType) => void }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.p
        className="text-lg text-muted-foreground mb-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        What would help most right now?
      </motion.p>

      <div className="space-y-3 w-full max-w-xs">
        <motion.button
          onClick={() => onChoose("breathe")}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/80 border border-border/40 text-left transition-all duration-300 hover:bg-secondary active:scale-[0.98]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <Wind className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <span className="text-foreground font-medium">Breathe</span>
        </motion.button>

        <motion.button
          onClick={() => onChoose("body")}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/80 border border-border/40 text-left transition-all duration-300 hover:bg-secondary active:scale-[0.98]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <Hand className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <span className="text-foreground font-medium">Body</span>
        </motion.button>

        <motion.button
          onClick={() => onChoose("thoughts")}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/80 border border-border/40 text-left transition-all duration-300 hover:bg-secondary active:scale-[0.98]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <Brain className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <span className="text-foreground font-medium">Thoughts</span>
        </motion.button>
      </div>

      <motion.p
        className="text-xs text-muted-foreground/60 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Or just stay here — breathing will begin gently
      </motion.p>
    </motion.div>
  );
}

// Screen 3: Reset (with variants A, B, C)
function ResetScreen({ 
  type, 
  onComplete,
  customThought,
  setCustomThought
}: { 
  type: "breathe" | "body" | "thoughts"; 
  onComplete: () => void;
  customThought: string;
  setCustomThought: (thought: string) => void;
}) {
  if (type === "breathe") {
    return <BreathingReset onComplete={onComplete} />;
  }
  if (type === "body") {
    return <BodyReset onComplete={onComplete} />;
  }
  return (
    <ThoughtsReset 
      onComplete={onComplete} 
      customThought={customThought}
      setCustomThought={setCustomThought}
    />
  );
}

// Screen 3A: Breathing Reset
function BreathingReset({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [cycles, setCycles] = useState(0);
  const totalCycles = 6; // About 60 seconds (6 x 10 second cycles)

  useEffect(() => {
    if (cycles >= totalCycles) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }

    const duration = phase === "inhale" ? 4000 : 6000;
    const timer = setTimeout(() => {
      if (phase === "exhale") {
        setCycles((c) => c + 1);
      }
      setPhase((p) => (p === "inhale" ? "exhale" : "inhale"));
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, cycles, onComplete]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breathing circle */}
      <motion.div
        className="w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-10 sm:mb-12"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(168 30% 74% / 0.35) 0%, hsl(168 30% 60% / 0.15) 50%, transparent 100%)",
          boxShadow: "0 0 60px -15px hsl(168 30% 60% / 0.4)",
        }}
        animate={{
          scale: phase === "inhale" ? 1.3 : 0.7,
          opacity: phase === "inhale" ? 1 : 0.5,
        }}
        transition={{
          duration: phase === "inhale" ? 4 : 6,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Phase text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {phase === "inhale" ? "Breathe in..." : "Let it go..."}
        </motion.p>
      </AnimatePresence>

      {/* Progress */}
      <div className="flex gap-2 mt-10">
        {[...Array(totalCycles)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i < cycles ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Screen 3B: Body Reset
function BodyReset({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const cues = [
    "Let your shoulders drop",
    "Soften your jaw",
    "Let your belly be soft",
    "Feel your feet on the ground",
    "Let your hands rest",
  ];

  useEffect(() => {
    if (step >= cues.length) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [step, cues.length, onComplete]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pulsing circle */}
      <motion.div
        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mb-10 sm:mb-12"
        style={{
          background: "radial-gradient(circle, hsl(168 30% 60% / 0.2) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Cue text */}
      <AnimatePresence mode="wait">
        {step < cues.length && (
          <motion.p
            key={step}
            className="text-xl font-medium text-foreground text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {cues[step]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex gap-2 mt-10">
        {cues.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
            style={{ width: i === step ? 24 : 8 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Screen 3C: Thoughts Reset
function ThoughtsReset({ 
  onComplete,
  customThought,
  setCustomThought
}: { 
  onComplete: () => void;
  customThought: string;
  setCustomThought: (thought: string) => void;
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (hasSubmitted) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted, onComplete]);

  const handleSubmit = () => {
    setHasSubmitted(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {!hasSubmitted ? (
          <motion.div
            key="input"
            className="w-full max-w-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-lg text-muted-foreground mb-6">
              What thought is loudest right now?
            </p>
            <input
              type="text"
              value={customThought}
              onChange={(e) => setCustomThought(e.target.value)}
              placeholder="Just let it out..."
              className="w-full px-5 py-4 rounded-2xl bg-secondary/80 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center"
            />
            <motion.button
              onClick={handleSubmit}
              className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {customThought.trim() ? "Release it" : "Skip"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="released"
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/15 mx-auto mb-8"
              animate={{
                scale: [1, 1.2, 0],
                opacity: [1, 0.5, 0],
              }}
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            />
            <p className="text-lg text-muted-foreground">
              Let it drift away...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Screen 4: Grounding & Truth
function GroundingScreen({ 
  selectedTruth, 
  setSelectedTruth,
  onComplete 
}: { 
  selectedTruth: string;
  setSelectedTruth: (truth: string) => void;
  onComplete: () => void;
}) {
  const [showTruths, setShowTruths] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTruths(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 pt-safe-top pb-safe-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-1 flex flex-col items-center justify-center">
        <motion.p
          className="text-lg text-foreground text-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Place a hand on your chest.
        </motion.p>
        <motion.p
          className="text-muted-foreground text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          What is true right now — even if it doesn't feel that way?
        </motion.p>

        {/* Suggested truths */}
        <AnimatePresence>
          {showTruths && (
            <motion.div
              className="space-y-2 w-full max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {suggestedTruths.map((truth, i) => (
                <motion.button
                  key={truth}
                  onClick={() => setSelectedTruth(selectedTruth === truth ? "" : truth)}
                  className={`w-full p-4 rounded-xl text-left text-sm transition-all duration-300 ${
                    selectedTruth === truth
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "bg-secondary/50 border border-transparent text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {truth}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="pb-8 pt-6">
        <motion.button
          onClick={onComplete}
          className="w-full max-w-xs mx-auto block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </footer>
    </motion.div>
  );
}

// Screen 5: Closing
function ClosingScreen({ 
  onBack, 
  onSaveTruth,
  hasTruth
}: { 
  onBack: () => void;
  onSaveTruth: () => void;
  hasTruth: boolean;
}) {
  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 pt-safe-top pb-safe-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.p
          className="text-lg sm:text-xl font-medium text-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          You don't have to carry this alone.
        </motion.p>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          You showed up for yourself today.
        </motion.p>
      </main>

      <footer className="pb-8 pt-6 space-y-3">
        <motion.button
          onClick={onBack}
          className="w-full max-w-xs mx-auto block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Return home
        </motion.button>
        
        {hasTruth && (
          <motion.button
            onClick={onSaveTruth}
            className="w-full max-w-xs mx-auto block px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Save a truth
          </motion.button>
        )}
      </footer>
    </motion.div>
  );
}
