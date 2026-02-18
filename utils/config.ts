/**
 * Calculates the total XP required to complete the current level.
 * @param base_xp - From your 'skills' table (e.g., 100 or 150)
 * @param level - The player's current level in 'player_skills'
 */
export const computeMaxXp = (base_xp: number, level: number): number => {
  return Math.floor(base_xp * Math.pow(level, 1.2));
};

/**
 * Computes the cost to upgrade a skill to the next level.
 * @param baseCost - The initial price of the skill (Level 1)
 * @param level - The current level of the skill
 * @param growthRate - How fast the price increases (1.15 is standard for most games)
 */
export const computeUpgradeCost = (
  baseCost: number,
  level: number,
  growthRate: number = 1.45,
): number => {
  // Formula: Base * (Growth ^ CurrentLevel)
  // Level 1 -> Level 2 cost uses level 1 in the exponent
  const cost = baseCost * Math.pow(growthRate, level - 1);

  // Round to the nearest 10 to keep the UI clean (e.g., 1,253 -> 1,250)
  return Math.round(cost / 10) * 10;
};
