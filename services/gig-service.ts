import { DBResponse } from "../types/common.d.ts";
import { logSQL } from "../utils/logger.ts";
import { GIG_POOLS } from "../utils/mapping.ts";
import { getDb } from "./config/db.ts";

export const generateMarketplaceGigs = (
  allClients: BaseClientType[],
  playerReputation: number,
  targetCount: number = 5,
) => {
  // 1. Filter for eligible clients first
  const eligibleClients = allClients.filter(
    (client) => playerReputation >= client.reputation_required,
  );

  // Safety check: If no clients are unlocked, return empty
  if (eligibleClients.length === 0) return [];

  const generatedGigs = [];

  // 2. Loop until we reach our target count
  for (let i = 0; i < targetCount; i++) {
    // Pick a random client from the eligible list
    const randomClient =
      eligibleClients[Math.floor(Math.random() * eligibleClients.length)];

    // Generate a gig for that client and add to our list
    const newGig = generateGigForClient(randomClient);
    generatedGigs.push(newGig);
  }

  return generatedGigs;
};
export const generateGigForClient = (
  client: BaseClientType,
): Omit<BaseGigType, "id"> => {
  const tierMultipliers: Record<string, number> = {
    Bronze: 1,
    Silver: 2.5,
    Gold: 5,
    Platinum: 10,
  };

  const scale = tierMultipliers[client.tier] || 1;

  // Difficulty Clamping (1-5)
  // Bronze/Silver mostly 1-3 | Gold/Platinum mostly 3-5
  const baseDiff = client.tier === "Bronze" || client.tier === "Silver" ? 1 : 3;
  const difficulty = Math.min(5, baseDiff + Math.floor(Math.random() * 3));

  // Tier-Based Task Selection
  const pool = GIG_POOLS[client.tier] || GIG_POOLS.Bronze;
  const gigTemplate = pool[Math.floor(Math.random() * pool.length)];

  // Duration Logic (in seconds)
  const durationRanges: Record<string, { min: number; max: number }> = {
    Bronze: { min: 30, max: 120 },
    Silver: { min: 300, max: 900 },
    Gold: { min: 3600, max: 14400 },
    Platinum: { min: 28800, max: 57600 },
  };

  const range = durationRanges[client.tier] || durationRanges["Bronze"];
  const duration =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // Balanced Rewards
  const timeBonus = Math.floor(duration * 0.05 * scale);
  const reward_money = Math.floor(
    (Math.random() * 100 + 50) * scale + timeBonus,
  );
  const reward_xp = Math.floor(20 * scale + duration / 60);
  const reward_reputation = Math.floor(5 * scale);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000);

  return {
    name: gigTemplate.title,
    description: `${client.tier} Project: ${gigTemplate.title}. Complexity is ${difficulty}/5.`,
    type: gigTemplate.skill,
    client_id: client.id.toString(),
    required_skill: gigTemplate.skill,
    required_level: Math.max(1, Math.floor(scale * 1.5)),
    difficulty,
    reward_money,
    reward_xp,
    reward_reputation,
    energy_cost: Math.floor(10 + difficulty * 2 + duration / 300),
    stress_increase: 5 + difficulty,
    duration,
    urgency_level: difficulty >= 4 ? "High" : "Normal", // High for 4 & 5
    quality_score: 0,
    success_score: 0,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };
};

export const saveGeneratedGigs = async (
  gigs: Omit<BaseGigType, "id">[],
): Promise<DBResponse<number>> => {
  const start = performance.now();

  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      for (const gig of gigs) {
        await db.runAsync(
          `INSERT INTO gigs (
            name, description, type, client_id, required_skill, 
            required_level, difficulty, reward_money, reward_xp, 
            reward_reputation, energy_cost, stress_increase, 
            duration, urgency_level, quality_score, success_score, 
            created_at, expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            gig.name,
            gig.description,
            gig.type,
            gig.client_id,
            gig.required_skill,
            gig.required_level,
            gig.difficulty,
            gig.reward_money,
            gig.reward_xp,
            gig.reward_reputation,
            gig.energy_cost,
            gig.stress_increase,
            gig.duration,
            gig.urgency_level,
            gig.quality_score,
            gig.success_score,
            gig.created_at,
            gig.expires_at,
          ],
        );
      }
    });

    logSQL("saveGeneratedGigs", true, start, { count: gigs.length });
    return { success: true, data: gigs.length };
  } catch (error) {
    logSQL("saveGeneratedGigs", false, start, error);
    return { success: false, error: "Failed to refresh Gig Board." };
  }
};

export const getAvailableGigs = async (): Promise<
  DBResponse<BaseGigType[]>
> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const gigs = await db.getAllAsync<BaseGigType>(
      `SELECT * FROM gigs WHERE expires_at > ? ORDER BY created_at DESC`,
      [new Date().toISOString()],
    );
    logSQL("getAvailableGigs", true, start, { count: gigs });
    return { success: true, data: gigs };
  } catch (error) {
    logSQL("getAvailableGigs", false, start, error);
    return { success: false, error: "Failed to fetch available gigs." };
  }
};
