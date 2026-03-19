import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronDown, Pause, Play } from "lucide-react";
import { useAmbientSound, SoundType } from "@/hooks/useAmbientSound";
import { SoundLibrary } from "@/components/SoundLibrary";

interface ExerciseSoundControlsProps {
  /** Position variant */
  position?: "header" | "floating";
  /** Whether to show expanded controls by default */
  defaultExpanded?: boolean;
}

const quickSounds: { id: SoundType; label: string }[] = [
  { id: "bilateral-ocean", label: "Bilateral" },
  { id: "ocean-swell", label: "Ocean" },
  { id: "rain-water", label: "Rain" },
  { id: "brown-noise", label: "Brown noise" },
];

export function ExerciseSoundControls({ 
  position = "header",
  defaultExpanded = false 
}: ExerciseSoundControlsProps) {
  const { isPlaying, currentSound, volume, toggle, stop, setVolume } = useAmbientSound();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showLibrary, setShowLibrary] = useState(false);

  const currentSoundLabel = currentSound 
    ? quickSounds.find(s => s.id === currentSound)?.label || "Sound"
    : null;

  // Header position - compact toggle in top-right
  if (position === "header") {
    return (
      <>
        <div className="relative">
          {/* Main toggle button */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground border border-transparent"
            }`}
            whileTap={{ scale: 0.98 }}
            aria-label="Sound controls"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs font-medium">{currentSoundLabel}</span>
                <div className="flex gap-0.5 ml-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-primary rounded-full"
                      animate={{ height: [3, 8, 3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs">Sound</span>
              </>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </motion.button>

          {/* Expanded controls dropdown */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-64 bg-background border border-border/40 rounded-2xl shadow-lg overflow-hidden z-50"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="p-4 space-y-4">
                  {/* Quick sound options */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Layer ambient sound</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickSounds.map((sound) => {
                        const isActive = currentSound === sound.id && isPlaying;
                        return (
                          <button
                            key={sound.id}
                            onClick={() => toggle(sound.id)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-primary/15 text-primary border border-primary/20"
                                : "bg-secondary/50 text-foreground/80 border border-transparent hover:bg-secondary/80"
                            }`}
                          >
                            {isActive && <Pause className="w-3 h-3" />}
                            {!isActive && sound.id === currentSound && <Play className="w-3 h-3" />}
                            <span>{sound.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Volume control - only when playing */}
                  {isPlaying && currentSound !== "visual-only" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-xs text-muted-foreground mb-2">Volume</p>
                      <div className="flex items-center gap-3">
                        <VolumeX className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
                        />
                        <Volume2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </motion.div>
                  )}

                  {/* More sounds link */}
                  <button
                    onClick={() => {
                      setExpanded(false);
                      setShowLibrary(true);
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    More sounds →
                  </button>

                  {/* Stop button when playing */}
                  {isPlaying && (
                    <button
                      onClick={() => {
                        stop();
                        setExpanded(false);
                      }}
                      className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border/30 -mx-4 px-4 -mb-4 mt-2"
                    >
                      Stop sound
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sound Library Modal */}
        <SoundLibrary 
          isOpen={showLibrary} 
          onClose={() => setShowLibrary(false)} 
        />

        {/* Click outside to close */}
        {expanded && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setExpanded(false)} 
          />
        )}
      </>
    );
  }

  // Floating position - bottom corner pill
  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
            isPlaying
              ? "bg-primary/15 text-primary border border-primary/20 backdrop-blur-md"
              : "bg-background/95 text-muted-foreground border border-border/40 backdrop-blur-md hover:text-foreground"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {isPlaying ? (
            <>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-primary rounded-full"
                    animate={{ height: [4, 10, 4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{currentSoundLabel}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm">Add sound</span>
            </>
          )}
        </motion.button>

        {/* Expanded controls */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 w-64 bg-background border border-border/40 rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-4 space-y-4">
                {/* Quick sound options */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Layer ambient sound</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickSounds.map((sound) => {
                      const isActive = currentSound === sound.id && isPlaying;
                      return (
                        <button
                          key={sound.id}
                          onClick={() => toggle(sound.id)}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/20"
                              : "bg-secondary/50 text-foreground/80 border border-transparent hover:bg-secondary/80"
                          }`}
                        >
                          {isActive && <Pause className="w-3 h-3" />}
                          {!isActive && sound.id === currentSound && <Play className="w-3 h-3" />}
                          <span>{sound.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume control */}
                {isPlaying && currentSound !== "visual-only" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-xs text-muted-foreground mb-2">Volume</p>
                    <div className="flex items-center gap-3">
                      <VolumeX className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
                      />
                      <Volume2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </motion.div>
                )}

                {/* More sounds */}
                <button
                  onClick={() => {
                    setExpanded(false);
                    setShowLibrary(true);
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  More sounds →
                </button>

                {/* Stop */}
                {isPlaying && (
                  <button
                    onClick={() => {
                      stop();
                      setExpanded(false);
                    }}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border/30 -mx-4 px-4 -mb-4 mt-2"
                  >
                    Stop sound
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sound Library Modal */}
      <SoundLibrary 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)} 
      />

      {/* Click outside to close */}
      {expanded && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setExpanded(false)} 
        />
      )}
    </>
  );
}
