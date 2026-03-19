import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, VolumeX, X, Waves, CloudRain, Wind, Zap, Eye, TreePine, 
  Droplets, Music, Radio, Play, Pause, Moon, Flame, Bug, Headphones, Activity 
} from "lucide-react";
import { useAmbientSound, SoundType, SoundCategory } from "@/hooks/useAmbientSound";

interface SoundLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  minimal?: boolean;
}

interface SoundOption {
  id: SoundType;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface SoundCategoryData {
  id: SoundCategory;
  label: string;
  description: string;
  sounds: SoundOption[];
}

const categories: SoundCategoryData[] = [
  {
    id: "bilateral",
    label: "Bilateral Stimulation",
    description: "Left-right panning for nervous system regulation (headphones recommended)",
    sounds: [
      { id: "bilateral-ocean", label: "Ocean bilateral", description: "Gentle waves alternating L/R", icon: Headphones },
      { id: "bilateral-rain", label: "Rain bilateral", description: "Soft rainfall with L/R movement", icon: Headphones },
      { id: "bilateral-forest", label: "Forest bilateral", description: "Nature sounds panning gently", icon: Headphones },
    ],
  },
  {
    id: "ocean",
    label: "Ocean & Water",
    description: "Calming water sounds for deep relaxation",
    sounds: [
      { id: "ocean-swell", label: "Maui ocean morning", description: "Peaceful waves from Kamaole Beach", icon: Waves },
      { id: "distant-waves", label: "Distant waves", description: "Soft, far-away shore", icon: Waves },
      
      { id: "underwater", label: "Underwater ambience", description: "Deep, muffled water sounds", icon: Droplets },
    ],
  },
  {
    id: "rain",
    label: "Rain & Storm",
    description: "Rainfall and gentle storm sounds",
    sounds: [
      { id: "rain-water", label: "Iao Valley River", description: "Iao valley river in Maui", icon: CloudRain },
      { id: "rainforest-rain", label: "Rainforest rain", description: "Steady rain with forest ambient", icon: CloudRain },
      { id: "thunderstorm", label: "Distant thunderstorm", description: "Rain with gentle thunder", icon: Zap },
    ],
  },
  {
    id: "forest",
    label: "Forest & Night",
    description: "Natural forest and evening sounds",
    sounds: [
      { id: "wind-trees", label: "Forest love", description: "Nature sounds in the forest", icon: TreePine },
      { id: "evening-crickets", label: "Evening crickets", description: "Gentle nighttime chorus", icon: Bug },
      { id: "stream-river", label: "Flowing stream", description: "Oregon Cascades river", icon: Droplets },
    ],
  },
  {
    id: "fire",
    label: "Fire & Evening",
    description: "Warm, cozy ambient sounds",
    sounds: [
      { id: "campfire", label: "Campfire crackle", description: "Warm fire with night ambience", icon: Flame },
    ],
  },
  {
    id: "air",
    label: "Air & Breath",
    description: "Light, airy ambient sounds",
    sounds: [
      { id: "breath-pacing", label: "Breath pacing", description: "Slow rhythmic tone", icon: Wind },
      { id: "white-air", label: "Soft white air", description: "Light, neutral static", icon: Wind },
    ],
  },
  {
    id: "grounding",
    label: "Grounding Ambience",
    description: "Deep, stabilizing tones",
    sounds: [
      { id: "low-hum", label: "Low-frequency hum", description: "Deep, steady vibration", icon: Radio },
      { id: "brown-noise", label: "Warm brown noise", description: "Deep, cozy static", icon: Radio },
    ],
  },
  {
    id: "frequency",
    label: "Frequency (Hz) Sounds",
    description: "Specific frequencies for regulation and calm",
    sounds: [
      { id: "hz-432", label: "432 Hz – Grounding & Gentle Calm", description: "Grounding, gentle, emotionally calming", icon: Activity },
      { id: "hz-528", label: "528 Hz – Mood-Lifting & Heart-Centered", description: "Supports mood lifting and heart-centered calm", icon: Activity },
      { id: "hz-174", label: "174 Hz – Deep Body Calm", description: "Very soothing, body-based calm for acute anxiety", icon: Activity },
      { id: "hz-10-alpha", label: "10 Hz – Alpha Calm & Focus", description: "Relaxed focus, reduces overthinking", icon: Activity },
      { id: "hz-6-theta", label: "6 Hz – Theta Nervous System Ease", description: "Deep regulation for overwhelmed nervous system", icon: Activity },
    ],
  },
  {
    id: "silent",
    label: "Silent Regulation",
    description: "Visual-only, no audio",
    sounds: [
      { id: "visual-only", label: "Visual breathing only", description: "Animations without sound", icon: Eye },
    ],
  },
];

const allSounds = categories.flatMap((cat) => cat.sounds);

const SLEEP_TIMER_OPTIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 20, label: "20 min" },
];

export function SoundLibrary({ isOpen, onClose, minimal = false }: SoundLibraryProps) {
  const { isPlaying, currentSound, volume, toggle, stop, setVolume } = useAmbientSound();
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showTimerOptions, setShowTimerOptions] = useState(false);

  // Sleep timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          stop();
          setSleepTimer(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, stop]);

  const startSleepTimer = useCallback((minutes: number) => {
    setSleepTimer(minutes);
    setTimeRemaining(minutes * 60);
    setShowTimerOptions(false);
  }, []);

  const cancelSleepTimer = useCallback(() => {
    setSleepTimer(null);
    setTimeRemaining(null);
    setShowTimerOptions(false);
  }, []);

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (minimal) {
    return (
      <MinimalSoundToggle
        isPlaying={isPlaying}
        currentSound={currentSound}
        onToggle={() => (currentSound ? stop() : toggle("ocean-swell"))}
        onOpenLibrary={onClose}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 flex-shrink-0">
              <div>
                <h2 className="text-lg font-medium text-foreground">Sound library</h2>
                <p className="text-sm text-muted-foreground">Steady sounds for regulation</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable categories */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">{category.label}</h3>
                      {category.id === "bilateral" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="space-y-2">
                    {category.sounds.map((sound) => {
                      const isActive = currentSound === sound.id && isPlaying;
                      const Icon = sound.icon;

                      return (
                        <motion.button
                          key={sound.id}
                          onClick={() => toggle(sound.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                            isActive
                              ? "bg-primary/15 border border-primary/30"
                              : "bg-secondary/50 border border-transparent hover:bg-secondary/80"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-primary/20" : "bg-muted/40"}`}>
                            <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                              {sound.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                          </div>
                          {isActive && sound.id !== "visual-only" && (
                            <motion.div className="flex gap-0.5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 bg-primary rounded-full"
                                  animate={{ height: [6, 12, 6] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                                />
                              ))}
                            </motion.div>
                          )}
                          {isActive && sound.id === "visual-only" && (
                            <motion.div
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Minimal player controls - only show when audio is playing */}
            <AnimatePresence>
              {isPlaying && currentSound !== "visual-only" && (
                <motion.div
                  className="px-6 pb-8 pt-4 border-t border-border/30 flex-shrink-0 bg-background"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {/* Play controls and timer */}
                  <div className="flex items-center justify-between mb-4">
                    {/* One-tap play/pause */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => toggle(currentSound!)}
                        className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        whileTap={{ scale: 0.95 }}
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" strokeWidth={1.5} /> : <Play className="w-5 h-5" strokeWidth={1.5} />}
                      </motion.button>
                      <div className="flex gap-0.5">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-primary/60 rounded-full"
                            animate={{ height: [4, 10, 4] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Sleep timer */}
                    <div className="relative">
                      <motion.button
                        onClick={() => setShowTimerOptions(!showTimerOptions)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                          sleepTimer ? "bg-primary/10 text-primary" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Moon className="w-4 h-4" strokeWidth={1.5} />
                        {timeRemaining ? (
                          <span className="font-medium">{formatTimeRemaining(timeRemaining)}</span>
                        ) : (
                          <span>Sleep</span>
                        )}
                      </motion.button>

                      {/* Timer options dropdown */}
                      <AnimatePresence>
                        {showTimerOptions && (
                          <motion.div
                            className="absolute bottom-full right-0 mb-2 bg-background border border-border/40 rounded-xl shadow-lg overflow-hidden"
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                          >
                            {sleepTimer && (
                              <button
                                onClick={cancelSleepTimer}
                                className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors border-b border-border/30"
                              >
                                Cancel timer
                              </button>
                            )}
                            {SLEEP_TIMER_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => startSleepTimer(option.value)}
                                className={`w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors ${
                                  sleepTimer === option.value ? "text-primary bg-primary/5" : "text-foreground"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Volume slider */}
                  <div className="flex items-center gap-4">
                    <VolumeX className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                    />
                    <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Minimal toggle for use within exercise screens
function MinimalSoundToggle({
  isPlaying,
  currentSound,
  onToggle,
  onOpenLibrary,
}: {
  isPlaying: boolean;
  currentSound: SoundType | null;
  onToggle: () => void;
  onOpenLibrary: () => void;
}) {
  const currentSoundData = currentSound ? allSounds.find((s) => s.id === currentSound) : null;

  return (
    <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <button
        onClick={onToggle}
        className={`p-2 rounded-full transition-all duration-300 ${
          isPlaying ? "bg-primary/20 text-primary" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
        }`}
        aria-label={isPlaying ? "Stop sound" : "Play sound"}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" strokeWidth={1.5} /> : <VolumeX className="w-5 h-5" strokeWidth={1.5} />}
      </button>
      {isPlaying && currentSoundData && (
        <motion.button
          onClick={onOpenLibrary}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {currentSoundData.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// Floating mini player - shows when sound is playing and library is closed
export function FloatingMiniPlayer({
  onOpenLibrary,
}: {
  onOpenLibrary: () => void;
}) {
  const { isPlaying, currentSound, stop, toggle } = useAmbientSound();
  const currentSoundData = currentSound ? allSounds.find((s) => s.id === currentSound) : null;

  if (!isPlaying || !currentSoundData || currentSound === "visual-only") return null;

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-30"
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-md border border-border/40 rounded-full shadow-lg">
        {/* Play/pause */}
        <motion.button
          onClick={() => toggle(currentSound!)}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4" strokeWidth={1.5} /> : <Play className="w-4 h-4" strokeWidth={1.5} />}
        </motion.button>

        {/* Sound info - tap to open library */}
        <button
          onClick={onOpenLibrary}
          className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-primary/60 rounded-full"
                animate={{ height: [3, 8, 3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
          <span className="max-w-[120px] truncate">{currentSoundData.label}</span>
        </button>

        {/* Stop button */}
        <motion.button
          onClick={stop}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label="Stop"
        >
          <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
