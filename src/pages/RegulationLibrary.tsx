import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { ExerciseSoundControls } from "@/components/ExerciseSoundControls";
import { ExerciseBackground } from "@/components/ExerciseBackground";
import {
  Wind,
  Hand,
  Eye,
  Heart,
  Sparkles,
  Waves,
  Circle,
  ChevronRight,
} from "lucide-react";

// Guided exercise imports
import { BoxBreathingExercise } from "@/components/exercises/BoxBreathingExercise";
import { FourSevenEightBreathing } from "@/components/exercises/FourSevenEightBreathing";
import { CoherentBreathing } from "@/components/exercises/CoherentBreathing";
import { DiaphragmaticHumming } from "@/components/exercises/DiaphragmaticHumming";
import { EFTTapping } from "@/components/exercises/EFTTapping";
import { GroundingSensation } from "@/components/exercises/GroundingSensation";
import { ProgressiveMuscleRelease } from "@/components/exercises/ProgressiveMuscleRelease";
import { BodyScan } from "@/components/exercises/BodyScan";
import { SensoryAnchoring } from "@/components/exercises/SensoryAnchoring";
import { EmotionLabeling } from "@/components/exercises/EmotionLabeling";
import { SafePlaceVisualization } from "@/components/exercises/SafePlaceVisualization";
import { SocialEngagementCues } from "@/components/exercises/SocialEngagementCues";
import { ColdWaterReset } from "@/components/exercises/ColdWaterReset";
import { VocalExhale } from "@/components/exercises/VocalExhale";
import { AnchorWordBreathing } from "@/components/exercises/AnchorWordBreathing";
import { GentleMovement } from "@/components/exercises/GentleMovement";

interface RegulationLibraryProps {
  onBack: () => void;
}

type Category = 
  | "breathwork" 
  | "somatic" 
  | "grounding" 
  | "polyvagal" 
  | "quickreset" 
  | "mindfulness";

type ExerciseId = 
  | "box-breathing"
  | "four-seven-eight"
  | "coherent-breathing"
  | "diaphragmatic-humming"
  | "eft-tapping"
  | "grounding-sensation"
  | "progressive-muscle"
  | "body-scan"
  | "sensory-anchoring"
  | "emotion-labeling"
  | "safe-place"
  | "social-engagement"
  | "cold-water"
  | "vocal-exhale"
  | "anchor-word"
  | "gentle-movement";

interface Exercise {
  id: ExerciseId;
  name: string;
  duration: string;
  description: string;
}

interface CategoryData {
  id: Category;
  name: string;
  icon: typeof Wind;
  description: string;
  exercises: Exercise[];
}

const categories: CategoryData[] = [
  {
    id: "breathwork",
    name: "Breathwork",
    icon: Wind,
    description: "Slow your heart rate and calm your nervous system",
    exercises: [
      {
        id: "four-seven-eight",
        name: "4-7-8 Breathing",
        duration: "1-2 min",
        description: "Inhale 4, hold 7, exhale 8. Activates rest response.",
      },
      {
        id: "box-breathing",
        name: "Box Breathing",
        duration: "2 min",
        description: "Inhale/hold/exhale/hold for 4 counts each. Repeat 5 cycles.",
      },
      {
        id: "coherent-breathing",
        name: "Coherent Breathing",
        duration: "2 min",
        description: "Inhale 5 seconds, exhale 5 seconds. Steady rhythm.",
      },
      {
        id: "diaphragmatic-humming",
        name: "Humming Exhale",
        duration: "1 min",
        description: "Belly inhale, slow humming exhale. Vagal activation.",
      },
    ],
  },
  {
    id: "somatic",
    name: "Body-Based",
    icon: Hand,
    description: "Release tension through physical awareness",
    exercises: [
      {
        id: "eft-tapping",
        name: "EFT Tapping",
        duration: "1-2 min",
        description: "Gentle tapping on calming points: hand, eyebrow, collarbone.",
      },
      {
        id: "grounding-sensation",
        name: "Grounding Sensation",
        duration: "30 sec",
        description: "Feet on floor, press hands into chair, notice texture.",
      },
      {
        id: "progressive-muscle",
        name: "Progressive Release",
        duration: "2 min",
        description: "Feet → legs → belly → shoulders → face. Tense and release.",
      },
      {
        id: "body-scan",
        name: "Quick Body Scan",
        duration: "20 sec",
        description: "Brief scan, noticing sensations without judgment.",
      },
    ],
  },
  {
    id: "grounding",
    name: "Grounding",
    icon: Eye,
    description: "Anchor your attention to the present moment",
    exercises: [
      {
        id: "sensory-anchoring",
        name: "5-4-3-2-1",
        duration: "1-2 min",
        description: "5 see, 4 feel, 3 hear, 2 smell, 1 taste. Sensory anchoring.",
      },
      {
        id: "emotion-labeling",
        name: "Emotion Labeling",
        duration: "30 sec",
        description: "\"I'm noticing tension / fear / warmth...\" Name what's here.",
      },
    ],
  },
  {
    id: "polyvagal",
    name: "Polyvagal",
    icon: Heart,
    description: "Activate your body's safety signals",
    exercises: [
      {
        id: "safe-place",
        name: "Safe Place",
        duration: "1-2 min",
        description: "Visualize a memory of safety. Notice body sensations.",
      },
      {
        id: "social-engagement",
        name: "Social Cues",
        duration: "30 sec",
        description: "Soft gaze, slow voice, gentle nodding. Signals of safety.",
      },
    ],
  },
  {
    id: "quickreset",
    name: "Quick Resets",
    icon: Sparkles,
    description: "Immediate nervous system shifts",
    exercises: [
      {
        id: "cold-water",
        name: "Cold Water Reset",
        duration: "30 sec",
        description: "Cold water on face or wrists. Dive reflex activation.",
      },
      {
        id: "vocal-exhale",
        name: "Vocal Exhale",
        duration: "30 sec",
        description: "Slow exhale with \"ah\" or \"mmm\" sound. Vagal toning.",
      },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: Circle,
    description: "Gentle presence and movement",
    exercises: [
      {
        id: "anchor-word",
        name: "Anchor Word",
        duration: "1 min",
        description: "Repeat a word on exhale: \"safe,\" \"grounded,\" \"here.\"",
      },
      {
        id: "gentle-movement",
        name: "Gentle Movement",
        duration: "1 min",
        description: "Shoulder rolls, gentle neck stretches. Slow and intentional.",
      },
    ],
  },
];

export function RegulationLibrary({ onBack }: RegulationLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseId | null>(null);

  const handleSelectCategory = (categoryId: Category) => {
    setSelectedCategory(categoryId);
  };

  const handleSelectExercise = (exerciseId: ExerciseId) => {
    setSelectedExercise(exerciseId);
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
  };

  const handleBackFromExercise = () => {
    setSelectedExercise(null);
  };

  const handleExerciseComplete = () => {
    setSelectedExercise(null);
  };

  // Render active exercise
  if (selectedExercise) {
    return renderExercise(selectedExercise, handleBackFromExercise, handleExerciseComplete);
  }

  // Render category detail view
  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return null;

    return (
      <CategoryView
        category={category}
        onBack={handleBackFromCategory}
        onSelectExercise={handleSelectExercise}
      />
    );
  }

  // Render main library view - use sunlit background for uplifting feel
  return (
    <ExerciseBackground variant="image" category="mindfulness" sunlit>
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
        <header className="pt-4 pb-6 flex items-center justify-between shrink-0">
          <BackButton onClick={onBack} label="Home" />
          <ExerciseSoundControls position="header" />
        </header>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl sm:text-2xl font-medium text-foreground mb-2">Regulate</h1>
          <p className="text-muted-foreground">
            Short practices for immediate relief
          </p>
        </motion.div>

        <main className="flex-1 pb-8 -mx-6 px-6">
          <div className="space-y-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl card-glass text-left transition-all duration-300 hover:bg-secondary/70 active:scale-[0.99]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <category.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {category.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    </ExerciseBackground>
  );
}

// Categories that should use sunlit backgrounds for warmth
const sunlitCategories: Category[] = ["polyvagal", "mindfulness", "grounding"];

// Category detail view
function CategoryView({
  category,
  onBack,
  onSelectExercise,
}: {
  category: CategoryData;
  onBack: () => void;
  onSelectExercise: (id: ExerciseId) => void;
}) {
  const useSunlit = sunlitCategories.includes(category.id);
  
  return (
    <ExerciseBackground variant="image" category={category.id} sunlit={useSunlit}>
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top pb-safe-bottom relative z-10">
        <header className="pt-4 pb-6 flex items-center justify-between shrink-0">
          <BackButton onClick={onBack} label="Library" />
          <ExerciseSoundControls position="header" />
        </header>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <category.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-foreground">{category.name}</h1>
          </div>
          <p className="text-muted-foreground text-sm">{category.description}</p>
        </motion.div>

        <main className="flex-1 pb-8 -mx-6 px-6">
          <div className="space-y-3">
            {category.exercises.map((exercise, index) => (
              <motion.button
                key={exercise.id}
                onClick={() => onSelectExercise(exercise.id)}
                className="w-full p-5 rounded-2xl card-glass text-left transition-all duration-300 hover:bg-secondary/70 active:scale-[0.99]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-foreground font-medium">{exercise.name}</p>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full shrink-0">
                    {exercise.duration}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exercise.description}
                </p>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    </ExerciseBackground>
  );
}

// Exercise renderer
function renderExercise(
  exerciseId: ExerciseId,
  onBack: () => void,
  onComplete: () => void
) {
  const exerciseProps = { onBack, onComplete };

  switch (exerciseId) {
    case "box-breathing":
      return <BoxBreathingExercise {...exerciseProps} />;
    case "four-seven-eight":
      return <FourSevenEightBreathing {...exerciseProps} />;
    case "coherent-breathing":
      return <CoherentBreathing {...exerciseProps} />;
    case "diaphragmatic-humming":
      return <DiaphragmaticHumming {...exerciseProps} />;
    case "eft-tapping":
      return <EFTTapping {...exerciseProps} />;
    case "grounding-sensation":
      return <GroundingSensation {...exerciseProps} />;
    case "progressive-muscle":
      return <ProgressiveMuscleRelease {...exerciseProps} />;
    case "body-scan":
      return <BodyScan {...exerciseProps} />;
    case "sensory-anchoring":
      return <SensoryAnchoring {...exerciseProps} />;
    case "emotion-labeling":
      return <EmotionLabeling {...exerciseProps} />;
    case "safe-place":
      return <SafePlaceVisualization {...exerciseProps} />;
    case "social-engagement":
      return <SocialEngagementCues {...exerciseProps} />;
    case "cold-water":
      return <ColdWaterReset {...exerciseProps} />;
    case "vocal-exhale":
      return <VocalExhale {...exerciseProps} />;
    case "anchor-word":
      return <AnchorWordBreathing {...exerciseProps} />;
    case "gentle-movement":
      return <GentleMovement {...exerciseProps} />;
    default:
      return null;
  }
}
