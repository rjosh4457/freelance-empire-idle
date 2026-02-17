/**
 * Calculates the total XP required to complete the current level.
 * @param base_xp - From your 'skills' table (e.g., 100 or 150)
 * @param level - The player's current level in 'player_skills'
 */
export const computeMaxXp = (base_xp: number, level: number): number => {
  return Math.floor(base_xp * Math.pow(level, 1.2));
};
