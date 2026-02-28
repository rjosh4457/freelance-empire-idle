export const calculateSpeedBySkillLevel = (
  player: BasePlayerType,
  skill_level: number,
) => {
  const baseSpeed = 0.005;

  // High energy = faster | High stress = slower
  // (Assuming stress and energy are 0-100)
  const energyBonus = player.energy * 0.002;
  const stressPenalty = player.stress * 0.005;

  // Add skill_level into the mix so leveling up actually matters
  const skillBonus = skill_level * 0.002;

  const speed = baseSpeed + energyBonus + skillBonus - stressPenalty;

  // Clamp speed so it never goes below a minimum work rate (e.g., 0.01)
  const finalSpeed = Math.max(0.01, speed);

  return Math.round(finalSpeed * 10000) / 10000;
};

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
  growthRate: number = 1.05,
): number => {
  // Formula: Base * (Growth ^ CurrentLevel)
  // Level 1 -> Level 2 cost uses level 1 in the exponent
  const cost = baseCost * Math.pow(growthRate, level - 1);

  // Round to the nearest 10 to keep the UI clean (e.g., 1,253 -> 1,250)
  return Math.round(cost / 10) * 10;
};

type XpConfig = {
  growthRate: number; // exponential growth (1.4 - 1.8 recommended)
  baseReward: number; // base XP reward per action
  levelScaling: number; // scaling factor for tool/player level (0.02 - 0.05)
};

const defaultConfig: XpConfig = {
  growthRate: 1.6,
  baseReward: 100,
  levelScaling: 0.25,
};

export const computeXpGained = (
  level: number,
  difficulty: number = 1, // 1 For Tool/Player Upgrade, 2 for Daily Milestone, 3 for Gig Completion
  config: XpConfig = defaultConfig,
) => {
  const levelMultiplier = 1 + level * config.levelScaling;

  return Math.floor(config.baseReward * difficulty * levelMultiplier);
};

type AnyPerks = Record<string, number>;

export function getScaledPerks(
  perks: AnyPerks,
  level: number,
  growthPerLevel: number = 0.05,
) {
  const result: Record<string, number> = {};

  Object.entries(perks).forEach(([key, value]) => {
    const scaled = value * (1 + (level - 1) * growthPerLevel);
    result[key] = Math.round(scaled * 100) / 100;
  });
  return result;
}
