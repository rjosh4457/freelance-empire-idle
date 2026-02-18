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
