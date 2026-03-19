import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NatureBackground } from "@/components/NatureBackground";
import { useNatureTheme } from "@/hooks/useNatureTheme";
import { Home } from "@/pages/Home";
import { FiveMinuteReset } from "@/pages/FiveMinuteReset";
import { BreathingExercise } from "@/pages/BreathingExercise";
import { GroundingExercise } from "@/pages/GroundingExercise";
import { QuickReset } from "@/pages/QuickReset";
import { EuthanasiaReset } from "@/pages/EuthanasiaReset";
import { ReflectionTool } from "@/pages/ReflectionTool";
import { RegulationLibrary } from "@/pages/RegulationLibrary";

type View = "home" | "fiveminute" | "breathing" | "grounding" | "quickreset" | "euthanasia" | "reflection" | "regulate";

// Views that should show full image backgrounds for more grounding
const imageBackgroundViews: View[] = ["home", "fiveminute", "euthanasia", "reflection"];

// Views that should show sunlit backgrounds for warmth and hope
const sunlitBackgroundViews: View[] = ["home", "reflection", "fiveminute"];

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [savedTruths, setSavedTruths] = useState<string[]>([]);

  // Get nature theme based on current view
  const { environment } = useNatureTheme(currentView);

  const handleSelectTool = (tool: string) => {
    setCurrentView(tool as View);
  };

  const handleBack = () => {
    setCurrentView("home");
  };

  const handleSaveTruth = (truth: string) => {
    if (truth && !savedTruths.includes(truth)) {
      setSavedTruths((prev) => [...prev, truth]);
    }
  };

  // Use image background for calmer screens, gradient for focused exercises
  const useImageBackground = imageBackgroundViews.includes(currentView);
  // Use sunlit imagery for warmth and hope on key screens
  const useSunlit = sunlitBackgroundViews.includes(currentView);

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden">
      <NatureBackground 
        environment={environment} 
        variant={useImageBackground ? "image" : "gradient"}
        sunlit={useSunlit}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10"
        >
          {currentView === "home" && (
            <Home onSelectTool={handleSelectTool} />
          )}
          {currentView === "fiveminute" && (
            <FiveMinuteReset onBack={handleBack} onSaveTruth={handleSaveTruth} />
          )}
          {currentView === "breathing" && (
            <BreathingExercise onBack={handleBack} />
          )}
          {currentView === "grounding" && (
            <GroundingExercise onBack={handleBack} />
          )}
          {currentView === "quickreset" && (
            <QuickReset onBack={handleBack} />
          )}
          {currentView === "euthanasia" && (
            <EuthanasiaReset onBack={handleBack} />
          )}
          {currentView === "reflection" && (
            <ReflectionTool onBack={handleBack} onSaveTruth={handleSaveTruth} />
          )}
          {currentView === "regulate" && (
            <RegulationLibrary onBack={handleBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
