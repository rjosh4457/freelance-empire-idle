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
  // 1. Select gig template
  const pool = GIG_POOLS[client.tier] || GIG_POOLS.small;
  const gigTemplate = pool[Math.floor(Math.random() * pool.length)];

  // 2. Difficulty (1-5)
  const difficulty = Math.floor(Math.random() * 5) + 1;

  // 3. Duration Logic
  const durationRanges: Record<string, { min: number; max: number }> = {
    small: { min: 5, max: 20 },
    medium: { min: 20, max: 40 },
    startup: { min: 30, max: 50 },
    national: { min: 40, max: 80 },
    global: { min: 50, max: 120 },
  };

  const range = durationRanges[client.tier] || durationRanges.small;

  // Generate duration within range
  const duration =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // 4. Urgency Based on Duration (lowest 25% = High)
  const urgency_level =
    duration <= range.min + (range.max - range.min) * 0.25 ? "High" : "Normal";

  const tierMultiplier =
    {
      small: 1,
      medium: 1.5,
      startup: 2,
      national: 3,
      global: 4,
    }[client.tier] || 1;

  const difficultyMultiplier = 0.6 + difficulty * 0.2; // 1.6 max

  // Base reward
  const baseReward = 50 * tierMultiplier * difficultyMultiplier;

  // High urgency multiplier (1.5x)
  const urgencyMultiplier = urgency_level === "High" ? 1.5 : 1; //1.5 max

  const reward_money = Math.floor(baseReward * urgencyMultiplier);
  const reward_xp = Math.floor(
    10 * tierMultiplier * difficultyMultiplier * urgencyMultiplier,
  );
  const reward_reputation = Math.min(
    30,
    Math.max(
      1,
      Math.floor(2 * tierMultiplier * difficultyMultiplier * urgencyMultiplier),
    ),
  );

  // Expiration (1 hour)
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000);

  return {
    name: gigTemplate.title,
    description: `${client.name} requires assistance with: ${gigTemplate.title}. Level ${difficulty} clearance required.`,
    type: gigTemplate.skill,
    client_id: client.id.toString(),
    client_name: client.name,
    required_skill: gigTemplate.skill,
    required_level: Math.max(1, Math.floor(tierMultiplier * 1.5)),
    difficulty,
    reward_money,
    reward_xp,
    reward_reputation,
    energy_cost: Math.floor(10 + difficulty * 2 + duration / 300),
    stress_increase: 5 + difficulty,
    duration,
    urgency_level,
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
            name, description, type, client_id, client_name, required_skill, 
            required_level, difficulty, reward_money, reward_xp, 
            reward_reputation, energy_cost, stress_increase, 
            duration, urgency_level, quality_score, success_score, 
            created_at, expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            gig.name,
            gig.description,
            gig.type,
            gig.client_id,
            gig.client_name,
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

export const fetchCurrentActiveGig = async (
  playerId: number,
): Promise<DBResponse<AcceptedGigType | null>> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const current_gig = await db.getFirstAsync<AcceptedGigType | null>(
      `SELECT  pag.id, pag.gig_id, g.name, g.description, g.type, g.client_id, g.client_name, g.required_skill, g.required_level, g.difficulty, g.reward_money, g.reward_xp, g.reward_reputation, g.energy_cost, g.stress_increase, g.duration, g.urgency_level, g.quality_score, g.success_score, pag.started_at, pag.end_at, pag.status, pag.progress FROM player_active_gigs pag JOIN gigs g ON pag.gig_id = g.id WHERE pag.player_id = ? AND pag.status != 'claimed'`,
      [playerId],
    );

    if (!current_gig) {
      logSQL("getAcceptedGigs", true, start, "No current gig.");
      return { success: true, data: null };
    }

    logSQL("getAcceptedGigs", true, start, {
      playerId,
      count: current_gig,
    });
    return { success: true, data: current_gig };
  } catch (error) {
    logSQL("getAcceptedGigs", false, start, { playerId, error });
    return { success: false, error: "Failed to fetch accepted gigs." };
  }
};
export const saveAcceptedGig = async (
  playerId: number,
  gig_id: number,
  duration: number,
): Promise<DBResponse<number>> => {
  const start = performance.now();

  const startedAt = new Date();
  const endAt = new Date(startedAt.getTime() + duration * 60 * 1000);
  try {
    const db = await getDb();
    const result = await db.runAsync(
      "INSERT INTO player_active_gigs (player_id, gig_id, started_at, end_at, status, progress) VALUES (?,?,?,?,?,?)",
      [
        playerId,
        gig_id,
        startedAt.toISOString(),
        endAt.toISOString(),
        "in_progress",
        0,
      ],
    );
    logSQL("saveAcceptedGig", true, start, { playerId, gigId: gig_id });
    return {
      success: true,
      data: result.lastInsertRowId,
    };
  } catch (error) {
    logSQL("saveAcceptedGig", false, start, error);
    return { success: false, error: "Failed to accept gig." };
  }
};

export const updateGigProgress = async (
  progress: number,
  gigId: number,
): Promise<DBResponse<void>> => {
  const start = performance.now();

  try {
    const db = await getDb();
    const result = await db.runAsync(
      `UPDATE player_active_gigs 
       SET progress = ?
       WHERE id = ?`,
      [progress, gigId],
    );
    if (result.changes === 0) {
      return { success: false, error: "Gig not found." };
    }

    logSQL("updateGigProgress", true, start, {
      gigId,
      progress,
      changes: result.changes,
    });

    return { success: true };
  } catch (error) {
    logSQL("updateGigProgress", false, start, error);
    return { success: false, error: "Failed to save gig progress." };
  }
};

export const updateGigStatus = async (
  status: string,
  gigId: number,
): Promise<DBResponse<void>> => {
  const start = performance.now();

  try {
    const db = await getDb();
    const result = await db.runAsync(
      `UPDATE player_active_gigs 
       SET status = ?
       WHERE id = ?`,
      [status, gigId],
    );
    if (result.changes === 0) {
      return { success: false, error: "Gig not found." };
    }

    logSQL("updateGigStatus", true, start, {
      gigId,
      status,
      changes: result.changes,
    });

    return { success: true };
  } catch (error) {
    logSQL("updateGigStatus", false, start, error);
    return { success: false, error: "Failed to save gig status." };
  }
};
