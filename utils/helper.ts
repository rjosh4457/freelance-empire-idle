import { GLOBAL_STATUS } from "./mapping.ts";

/**
 * Returns an ISO date string for a point in time
 * 'minutes' from the current moment.
 * * @param {number} minutes - The duration to add
 * @returns {string} - ISO 8601 formatted date
 */
export const getFinishAt = (minutes: number) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + minutes * 60000);

  return futureDate.toISOString();
};

/**
 * Formats a number to a string with commas and two decimal places.
 * Example: 2500 -> "2,500.00"
 */
export const formatCurrency = (value: number | string): string => {
  const amount = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(amount)) return "0.00";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
};

const COLORS = [
  "#fbbf24",
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#f472b6",
];
export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};
export const getColorByUrgency = (urgency: string) => {
  if (urgency === "High") return "#ef4444";
  return "#3b82f6";
};
export const getColorByLevel = (level: number) => {
  if (level >= 15) return "#ef4444"; // Red for high levels
  if (level >= 10) return "#f59e0b"; // Orange for mid levels
  if (level >= 5) return "#3b82f6"; // Blue for low levels
  return "#10b981"; // Green for low levels
};
export const formatPerkLabel = (key: string) =>
  key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const getPercentage = (current: number, max: number): string => {
  const value = current >= max ? 1 : current / max;
  return `${(value * 100).toFixed(0)}%`;
};

export const getGlobalStatus = (reputation: number) => {
  return GLOBAL_STATUS.find(
    (status) => reputation >= status.min && reputation < status.max,
  );
};

/**
 * Helper to map numeric difficulty (1-5) to a human-readable label
 */
export const getDifficultyLabel = (level: number): string => {
  // Ensure we stay within the 1-5 range
  const safeLevel = Math.round(level);

  switch (safeLevel) {
    case 1:
      return "Easy";
    case 2:
      return "Novice";
    case 3:
      return "Intermediate";
    case 4:
      return "Advanced";
    case 5:
      return "Expert";
    default:
      return "";
  }
};
