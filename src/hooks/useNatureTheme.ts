import { useState, useEffect, useMemo } from "react";

// Nature environment types
export type NatureEnvironment = "ocean" | "forest" | "lake" | "river" | "mountain";

interface NatureTheme {
  id: NatureEnvironment;
  name: string;
  // Overlay gradient colors (warm, muted tones per spec)
  overlay: string;
  // Accent color for subtle animated elements
  accentHsl: string;
}

const themes: NatureTheme[] = [
  {
    id: "ocean",
    name: "Ocean Shore",
    overlay: "linear-gradient(180deg, hsl(193 38% 10% / 0.7) 0%, hsl(193 38% 8% / 0.55) 50%, hsl(193 38% 10% / 0.75) 100%)",
    accentHsl: "193 35% 50%",
  },
  {
    id: "forest",
    name: "Bamboo Forest",
    overlay: "linear-gradient(180deg, hsl(140 25% 12% / 0.75) 0%, hsl(140 20% 10% / 0.6) 50%, hsl(140 25% 12% / 0.8) 100%)",
    accentHsl: "140 25% 45%",
  },
  {
    id: "lake",
    name: "Still Lake",
    overlay: "linear-gradient(180deg, hsl(220 25% 15% / 0.7) 0%, hsl(220 20% 12% / 0.55) 50%, hsl(220 25% 15% / 0.75) 100%)",
    accentHsl: "220 25% 55%",
  },
  {
    id: "river",
    name: "Gentle River",
    overlay: "linear-gradient(180deg, hsl(160 20% 14% / 0.7) 0%, hsl(160 18% 11% / 0.55) 50%, hsl(160 20% 14% / 0.75) 100%)",
    accentHsl: "160 22% 48%",
  },
  {
    id: "mountain",
    name: "Misty Mountains",
    overlay: "linear-gradient(180deg, hsl(30 15% 14% / 0.7) 0%, hsl(30 12% 11% / 0.55) 50%, hsl(30 15% 14% / 0.75) 100%)",
    accentHsl: "30 20% 55%",
  },
];

// Map view types to preferred environments
const viewEnvironmentMap: Record<string, NatureEnvironment> = {
  home: "ocean",
  fiveminute: "lake",
  breathing: "ocean",
  grounding: "forest",
  quickreset: "river",
  euthanasia: "lake",
  reflection: "forest",
  regulate: "mountain",
};

// Map exercise categories to nature environments
export const categoryEnvironmentMap: Record<string, NatureEnvironment> = {
  breathwork: "ocean",      // Ocean waves, shoreline water
  somatic: "forest",        // Forests, bamboo, streams
  grounding: "forest",      // Earth paths, mossy ground
  polyvagal: "lake",        // Soft light, open landscapes
  quickreset: "river",      // Simple water or sky
  mindfulness: "lake",      // Lakes, still water, misty mountains
};

// Map individual exercises to specific environments
export const exerciseEnvironmentMap: Record<string, NatureEnvironment> = {
  // Breathwork - ocean themed
  "box-breathing": "ocean",
  "four-seven-eight": "ocean",
  "coherent-breathing": "ocean",
  "diaphragmatic-humming": "ocean",
  // Somatic - forest themed
  "eft-tapping": "forest",
  "grounding-sensation": "forest",
  "progressive-muscle": "forest",
  "body-scan": "forest",
  // Grounding - forest themed
  "sensory-anchoring": "forest",
  "emotion-labeling": "forest",
  // Polyvagal - lake/soft light themed
  "safe-place": "lake",
  "social-engagement": "lake",
  // Quick resets - river/simple water themed
  "cold-water": "river",
  "vocal-exhale": "river",
  // Mindfulness - lake/still water themed
  "anchor-word": "lake",
  "gentle-movement": "mountain",
};

export function useNatureTheme(currentView?: string) {
  // Select environment based on current view for consistency
  const environment = useMemo(() => {
    if (currentView && viewEnvironmentMap[currentView]) {
      return viewEnvironmentMap[currentView];
    }
    return "ocean";
  }, [currentView]);

  const theme = useMemo(() => {
    return themes.find((t) => t.id === environment) || themes[0];
  }, [environment]);

  return {
    environment,
    theme,
    themes,
  };
}

// For static access without hook
export const natureThemes = themes;
export const getThemeForView = (view: string): NatureTheme => {
  const env = viewEnvironmentMap[view] || "ocean";
  return themes.find((t) => t.id === env) || themes[0];
};
