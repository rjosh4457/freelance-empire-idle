import { DBResponse } from "../types/common.d.ts";
import { logSQL } from "../utils/logger.ts";
import { getDb } from "./config/db.ts";

export const getProfile = async (): Promise<DBResponse<BasePlayerType>> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const player = await db.getFirstAsync<BasePlayerType>(
      "SELECT * FROM players LIMIT 1",
    );

    if (!player) {
      logSQL("getProfile", true, start, "No player records exist.");
      return {
        success: false,
        error: "No profile found. Please create one.",
      };
    }

    logSQL("getProfile", true, start, {
      player: player,
    });
    return {
      success: true,
      data: player,
    };
  } catch (error) {
    logSQL("getProfile", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};

export const createProfile = async (
  player: Pick<BasePlayerType, "company_name">,
): Promise<DBResponse<BasePlayerType>> => {
  const start = performance.now();
  console.log(
    `%c[SQL] ⚡ START | createProfile | Name: ${player.company_name}`,
    "color: #2196F3; font-weight: bold;",
  );

  try {
    const db = await getDb();
    const { company_name } = player;

    const result = await db.runAsync(
      `INSERT INTO players (company_name) 
       VALUES (?)`,
      [company_name],
    );

    const newPlayerData = await db.getFirstAsync<BasePlayerType>(
      `SELECT * FROM players WHERE id = ?`,
      [result.lastInsertRowId],
    );

    if (!newPlayerData) {
      throw new Error("Failed to retrieve player after creation.");
    }
    logSQL("createProfile", true, start, {
      lastInsertRowId: result.lastInsertRowId,
    });
    return {
      success: true,
      data: newPlayerData,
    };
  } catch (error) {
    logSQL("createProfile", false, start, error);
    return {
      success: false,
      error: "Could not create player profile.",
    };
  }
};

/**
 * Persists the player's new balance to the database.
 */
export const updatePlayerBalance = async (
  playerId: number,
  newAmount: number,
): Promise<DBResponse<void>> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const result = await db.runAsync(
      "UPDATE players SET money = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newAmount, playerId],
    );

    logSQL("updatePlayerBalance", true, start, {
      playerId,
      newAmount,
      changes: result.changes,
    });
    return { success: true };
  } catch (error) {
    logSQL("updatePlayerBalance", false, start, error);
    return { success: false, error: "Failed to sync balance to storage." };
  }
};

export const updateLastActive = async (
  playerId: number,
  lastActive: string,
): Promise<DBResponse<void>> => {
  const start = performance.now();

  try {
    const db = await getDb();
    const result = await db.runAsync(
      `UPDATE players 
       SET last_active_at = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [lastActive, playerId],
    );
    if (result.changes === 0) {
      return { success: false, error: "Player not found." };
    }

    logSQL("updateLastActive", true, start, {
      playerId,
      lastActive: lastActive,
      changes: result.changes,
    });

    return { success: true };
  } catch (error) {
    logSQL("updateLastActive", false, start, error);
    return { success: false, error: "Failed to update last active." };
  }
};
