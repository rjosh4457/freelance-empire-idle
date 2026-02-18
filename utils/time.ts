/**
 * Calculates progress percentage (0 to 1)
 * based on start time and end time relative to now.
 */
export const getStudyProgress = (
  startedAt: string | Date,
  finishAt: string | Date,
): number => {
  const start = new Date(startedAt).getTime();
  const end = new Date(finishAt).getTime();
  const now = Date.now();

  if (now >= end) return 1;
  if (now <= start) return 0;

  const totalDuration = end - start;
  const elapsed = now - start;

  return elapsed / totalDuration;
};

/**
 * Calculates time remaining from now until the target date.
 * Returns formatted string like "02h 15m 10s" or "Expired"
 */
export const getTimeRemaining = (targetDate: string | Date): string => {
  const total = Date.parse(targetDate.toString()) - Date.now();

  // If the time has already passed
  if (total <= 0) return "Completed";

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0)
    parts.push(`${hours.toString().padStart(2, "0")}h`);
  parts.push(`${minutes.toString().padStart(2, "0")}m`);

  // Only show seconds if there are no days left to keep the UI clean
  if (days === 0) {
    parts.push(`${seconds.toString().padStart(2, "0")}s`);
  }

  return parts.join(" ");
};
