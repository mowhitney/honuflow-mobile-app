import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";

type Screen = "thought" | "feeling" | "impulse" | "truth" | "complete";
type Feeling = "grief" | "anxiety" | "guilt" | "anger" | "numb" | "other" | null;

interface ReflectionToolProps {
  onBack: () => void;
  onSaveTruth?: (truth: string) => void;
}

const feelings: { id: Feeling; label: string }[] = [
  { id: "grief", label: "Grief" },
  { id: "anxiety", label: "Anxiety" },
  { id: "guilt", label: "Guilt" },
  { id: "anger", label: "Anger" },
  { id: "numb", label: "Numb" },
  { id: "other", label: "Other" },
];

const impulseExamples = [
  "Shut down",
  "Cry",
  "Withdraw",
  "Overwork",
  "Quit",
];

const screens: Screen[] = ["thought", "feeling", "impulse", "truth"];

export function ReflectionTool({ onBack, onSaveTruth }: ReflectionToolProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("thought");
  const [thought, setThought] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling>(null);
  const [bodyLocation, setBodyLocation] = useState("");
  const [impulse, setImpulse] = useState("");
  const [truth, setTruth] = useState("");
  const [showBreathCue, setShowBreathCue] = useState(false);

  const currentIndex = screens.indexOf(currentScreen);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < screens.length) {
      setCurrentScreen(screens[nextIndex]);
    } else {
      setShowBreathCue(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentScreen(screens[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const handleSaveTruth = () => {
    if (truth.trim() && onSaveTruth) {
      onSaveTruth(truth.trim());
    }
    onBack();
  };

  const handleComplete = () => {
    onBack();
  };

  const canProceed = () => {
    switch (currentScreen) {
      case "thought":
        return thought.trim().length > 0;
      case "feeling":
        return selectedFeeling !== null;
      case "impulse":
        return true; // Optional
      case "truth":
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
      {/* Header with back button */}
      <header className="pt-4 pb-4">
        <BackButton 
          onClick={handleBack} 
          label={currentIndex === 0 ? "Exit" : "Back"} 
        />
      </header>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3 py-4">
        {screens.map((screen, i) => (
          <div
            key={screen}
            className={`h-2 rounded-full transition-all duration-400 ${
              i === currentIndex
                ? "w-8 bg-primary"
                : i < currentIndex
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Screen content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentScreen === "thought" && (
            <ThoughtScreen
              key="thought"
              thought={thought}
              setThought={setThought}
            />
          )}
          {currentScreen === "feeling" && (
            <FeelingScreen
              key="feeling"
              selectedFeeling={selectedFeeling}
              setSelectedFeeling={setSelectedFeeling}
              bodyLocation={bodyLocation}
              setBodyLocation={setBodyLocation}
            />
          )}
          {currentScreen === "impulse" && (
            <ImpulseScreen
              key="impulse"
              impulse={impulse}
              setImpulse={setImpulse}
            />
          )}
          {currentScreen === "truth" && (
            <TruthScreen
              key="truth"
              truth={truth}
              setTruth={setTruth}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer with navigation */}
      <footer className="pb-8 pt-4">
        {!showBreathCue ? (
          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full max-w-xs mx-auto block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: canProceed() ? 1.01 : 1 }}
            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
          >
            {currentScreen === "truth" ? "Complete" : "Continue"}
          </motion.button>
        ) : (
          <BreathCue 
            onComplete={handleComplete}
            onSaveTruth={truth.trim() ? handleSaveTruth : undefined}
          />
        )}
      </footer>
    </div>
  );
}

// Screen 1: Thought
function ThoughtScreen({ 
  thought, 
  setThought 
}: { 
  thought: string; 
  setThought: (t: string) => void;
}) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-sm text-center">
        <p className="text-lg sm:text-xl font-medium text-foreground mb-2">
          What thought is coming up right now?
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Just write it as it sounds.
        </p>
        
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="I keep thinking..."
          rows={4}
          className="w-full px-5 py-4 rounded-2xl bg-secondary/80 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
        />
      </div>
    </motion.div>
  );
}

// Screen 2: Feeling
function FeelingScreen({ 
  selectedFeeling, 
  setSelectedFeeling,
  bodyLocation,
  setBodyLocation
}: { 
  selectedFeeling: Feeling; 
  setSelectedFeeling: (f: Feeling) => void;
  bodyLocation: string;
  setBodyLocation: (l: string) => void;
}) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-sm text-center">
        <p className="text-lg sm:text-xl font-medium text-foreground mb-8">
          What feeling does this create?
        </p>
        
        {/* Feeling options */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {feelings.map((feeling) => (
            <button
              key={feeling.id}
              onClick={() => setSelectedFeeling(
                selectedFeeling === feeling.id ? null : feeling.id
              )}
              className={`px-5 py-3 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${
                selectedFeeling === feeling.id
                  ? "bg-primary/20 text-foreground border border-primary/30"
                  : "bg-secondary/60 text-muted-foreground border border-transparent hover:bg-secondary hover:text-foreground"
              }`}
            >
              {feeling.label}
            </button>
          ))}
        </div>

        {/* Body location prompt */}
        <AnimatePresence>
          {selectedFeeling && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground mb-3">
                Where do you feel this in your body?
              </p>
              <input
                type="text"
                value={bodyLocation}
                onChange={(e) => setBodyLocation(e.target.value)}
                placeholder="Chest, stomach, throat..."
                className="w-full px-5 py-3 rounded-xl bg-secondary/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-sm"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Screen 3: Impulse
function ImpulseScreen({ 
  impulse, 
  setImpulse 
}: { 
  impulse: string; 
  setImpulse: (i: string) => void;
}) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-sm text-center">
        <p className="text-lg sm:text-xl font-medium text-foreground mb-8">
          What does this feeling make you want to do?
        </p>
        
        {/* Example impulses */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {impulseExamples.map((example) => (
            <button
              key={example}
              onClick={() => setImpulse(impulse === example ? "" : example)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                impulse === example
                  ? "bg-primary/20 text-foreground border border-primary/30"
                  : "bg-secondary/40 text-muted-foreground/70 border border-transparent hover:bg-secondary/60 hover:text-muted-foreground"
              }`}
            >
              {example}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <input
          type="text"
          value={impulseExamples.includes(impulse) ? "" : impulse}
          onChange={(e) => setImpulse(e.target.value)}
          placeholder="Or describe your own..."
          className="w-full px-5 py-3 rounded-xl bg-secondary/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-sm mb-8"
        />

        {/* Validation message */}
        <motion.p
          className="text-sm text-muted-foreground italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This is a survival response.
        </motion.p>
      </div>
    </motion.div>
  );
}

// Screen 4: Truth
function TruthScreen({ 
  truth, 
  setTruth 
}: { 
  truth: string; 
  setTruth: (t: string) => void;
}) {
  const guidingQuestions = [
    "What facts do I know?",
    "What is out of my control?",
    "What would I say to a coworker?",
  ];

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-sm text-center">
        <p
          className="text-lg sm:text-xl font-medium text-foreground mb-6"
          style={{
            textShadow: "0 1px 8px hsl(0 0% 0% / 0.4), 0 0 2px hsl(0 0% 0% / 0.2)",
          }}
        >
          What is true right now?
        </p>
        
        {/* Guiding questions */}
        <div className="space-y-2 mb-6">
          {guidingQuestions.map((question, i) => (
            <motion.p
              key={question}
              className="text-sm text-foreground/90 font-medium"
              style={{
                textShadow: "0 1px 8px hsl(0 0% 0% / 0.5), 0 0 2px hsl(0 0% 0% / 0.3)",
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              {question}
            </motion.p>
          ))}
        </div>

        {/* Truth input */}
        <textarea
          value={truth}
          onChange={(e) => setTruth(e.target.value)}
          placeholder="The truth is..."
          rows={3}
          className="w-full px-5 py-4 rounded-2xl bg-secondary/80 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
        />
      </div>
    </motion.div>
  );
}

// Grounding breath cue at the end
function BreathCue({ 
  onComplete,
  onSaveTruth
}: { 
  onComplete: () => void;
  onSaveTruth?: () => void;
}) {
  const [phase, setPhase] = useState<"inhale" | "exhale" | "done">("inhale");

  // Single breath cycle
  useState(() => {
    const inhaleTimer = setTimeout(() => setPhase("exhale"), 4000);
    const exhaleTimer = setTimeout(() => setPhase("done"), 10000);
    return () => {
      clearTimeout(inhaleTimer);
      clearTimeout(exhaleTimer);
    };
  });

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {phase !== "done" ? (
        <>
          <motion.div
            className="w-16 h-16 rounded-full mx-auto mb-6"
            style={{
              background: "radial-gradient(circle, hsl(168 30% 60% / 0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: phase === "inhale" ? [0.8, 1.2] : [1.2, 0.8],
              opacity: phase === "inhale" ? [0.5, 1] : [1, 0.5],
            }}
            transition={{
              duration: phase === "inhale" ? 4 : 6,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
          <p className="text-muted-foreground">
            {phase === "inhale" ? "One breath in..." : "And let it go..."}
          </p>
        </>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={onComplete}
            className="w-full max-w-xs px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Return home
          </button>
          {onSaveTruth && (
            <button
              onClick={onSaveTruth}
              className="w-full max-w-xs px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium"
            >
              Save this truth
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
