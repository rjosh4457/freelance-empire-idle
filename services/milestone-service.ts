import { DBResponse } from "../types/common.d.ts";
import {
  BaseMilestonesType,
  DailyMilestoneType,
} from "../types/milestones.d.ts";
import { logSQL } from "../utils/logger.ts";
import { getDb } from "./config/db.ts";

export const createDailyMilestones = async (playerId: number) => {
  const start = performance.now();
  const today = new Date().toISOString().split("T")[0];

  try {
    const db = await getDb();

    // Check if milestones already exist for today
    const existing = await db.getFirstAsync(
      "SELECT id FROM player_daily_milestones WHERE player_id = ? AND date = ? LIMIT 1",
      [playerId, today],
    );

    if (!existing) {
      const templates = await db.getAllAsync<BaseMilestonesType>(
        "SELECT * FROM daily_milestones ORDER BY RANDOM() LIMIT 5",
      );

      for (const m of templates) {
        const uniqueId = `${playerId}_${m.id}_${today}`;
        await db.runAsync(
          `INSERT OR IGNORE INTO player_daily_milestones 
          (id, player_id, milestone_id, progress, status, date) 
          VALUES (?, ?, ?, 0, 'active', ?)`,
          [uniqueId, playerId, m.id, today],
        );
      }

      logSQL("createDailyMilestones", true, start, {
        generated: templates.length,
        date: today,
      });
    } else {
      logSQL(
        "createDailyMilestones",
        true,
        start,
        "Milestones already exist for today.",
      );
    }
  } catch (error) {
    logSQL("createDailyMilestones", false, start, error);
    console.error("Failed to refresh dailies:", error);
  }
};

export const getDailyMilestone = async (
  playerId: number,
): Promise<DBResponse<DailyMilestoneType[]>> => {
  const start = performance.now();
  const today = new Date().toISOString().split("T")[0];

  try {
    const db = await getDb();
    const milestones = await db.getAllAsync<DailyMilestoneType>(
      `SELECT 
      pdm.id,
      dm.name, 
      dm.description, 
      dm.icon,
      dm.target_value, 
      pdm.progress,
      pdm.status,
      (CAST(pdm.progress AS FLOAT) / dm.target_value) as percent_complete
    FROM player_daily_milestones pdm
    JOIN daily_milestones dm ON pdm.milestone_id = dm.id
    WHERE pdm.player_id = ? AND pdm.date = ?`,
      [playerId, today],
    );

    if (!milestones || milestones.length === 0) {
      logSQL(
        "getDailyMilestone",
        true,
        start,
        "No milestones found for today.",
      );
      return {
        success: false,
        error: "No Milestone found today.",
      };
    }

    logSQL("getDailyMilestone", true, start, { count: milestones.length });
    return {
      success: true,
      data: milestones,
    };
  } catch (error) {
    logSQL("getDailyMilestone", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};
