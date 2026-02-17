export const theme = {
  colors: {
    // --- Freelance Empire / Onboarding UI ---
    primary: "#25f46a", // High-vis green
    secondary: "#3b82f6", // Professional blue
    backgroundLight: "#f5f8f6", // Clean surface
    backgroundDark: "#102216", // Deep forest obsidian

    // --- Expedition / RPG UI ---
    yellow: "#eead2b", // Radiant gold
    goldPale: "#f3d192", // Muted parchment gold
    borderV2: "rgba(238, 173, 43, 0.3)", // Subtle gold borders
    mutedV3: "#57534e", // Stone/Grey for inactive states
    light: "#e7e5e4", // Soft white for readability

    // --- Functional Colors ---
    danger: "#ef4444", // Extreme danger red
    warning: "#eab308", // Leveling up yellow
    success: "#22c55e", // Milestone completion green
    obsidian: "#141416", // Dark card backgrounds
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  typography: {
    // Note: Ensure fonts are loaded in your App.ts via expo-font
    display: "Spline Sans",
    serif: "Newsreader", // Used for the RPG / Expedition text
  },
};

export type Theme = typeof theme;
