import { DBResponse } from "../types/common.d.ts";
import { ActiveSkillType, BaseSkillType } from "../types/skills.d.ts";
import { logSQL } from "../utils/logger.ts";
import { getDb } from "./config/db.ts";

/**
 * Retrieves the complete library of all possible skills available in the game.
 * Used for the 'All Skills' tab or shop views to show what can be unlocked.
 * * @returns A promise resolving to a DBResponse containing an array of BaseSkillType.
 */
export const fetchAllSkills = async (): Promise<
  DBResponse<BaseSkillType[]>
> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const skills = await db.getAllAsync<BaseSkillType>(`SELECT * FROM skills`);

    if (!skills || skills.length === 0) {
      logSQL("fetchAllSkills", true, start, "Result: Empty Table");
      return {
        success: false,
        error: "No Skills Found.",
      };
    }
    logSQL("fetchAllSkills", true, start, { count: skills });
    return {
      success: true,
      data: skills,
    };
  } catch (error) {
    logSQL("fetchAllSkills", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};

/**
 * Retrieves only the skills that the player has already unlocked.
 * Performs a JOIN between player progress (player_skills) and skill metadata (skills).
 * * @returns A promise resolving to a DBResponse containing an array of ActiveSkillType with level/XP data.
 */
export const fetchActiveSkills = async (): Promise<
  DBResponse<ActiveSkillType[]>
> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const skills = await db.getAllAsync<ActiveSkillType>(
      `SELECT 
          ps.id AS id,   
          ps.player_id,      
          ps.skill_id,           
          ps.level,
          ps.current_xp,
          ps.learn_start_time,
          ps.learn_end_time,  
          s.name,
          s.code,
          s.description,
          s.category,
          s.icon,
          s.color,
          s.base_xp,
          s.base_upgrade_cost,
          s.learn_duration_minutes,
          s.unlock_at,
          ps.created_at
        FROM player_skills ps 
        JOIN skills s ON ps.skill_id = s.id`,
    );

    if (!skills || skills.length === 0) {
      logSQL(
        "fetchActiveSkills",
        true,
        start,
        "Result: No active skills for player",
      );
      return {
        success: false,
        error: "No Skills Found For this Player.",
      };
    }
    logSQL("fetchActiveSkills", true, start, { count: skills });
    return {
      success: true,
      data: skills,
    };
  } catch (error) {
    logSQL("fetchActiveSkills", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};

/**
 * Saves or unlocks a new skill for the player.
 * @param skillId The unique string ID of the skill from the master skills table.
 * @param playerId The player ID (defaults to 1 for single-player context).
 * @returns A promise resolving to a DBResponse with the new row ID if successful.
 */
export const saveNewSkill = async (
  skillId: string,
  playerId: number,
  startAt: string,
  finishAt: string,
): Promise<DBResponse<string>> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const entryId = `${playerId}_${skillId}`;

    const result = await db.runAsync(
      `INSERT OR IGNORE INTO player_skills (id, player_id, skill_id, level, current_xp, learn_start_time, learn_end_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [entryId, playerId, skillId, 1, 0, startAt, finishAt],
    );

    if (result.changes > 0) {
      logSQL("saveNewSkill", true, start, {
        entryId,
        lastInsertRowId: result.lastInsertRowId,
      });
      return {
        success: true,
        data: entryId,
      };
    }
    logSQL(
      "saveNewSkill",
      false,
      start,
      "Record already exists (INSERT IGNORED)",
    );
    return {
      success: false,
      error: "Skill already unlocked or duplicate entry.",
    };
  } catch (error) {
    logSQL("saveNewSkill", false, start, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
};

export const updateSkillLevel = async (
  skillId: string,
  newLevel: number,
  newXp: number,
): Promise<DBResponse<number>> => {
  const start = performance.now();
  try {
    const db = await getDb();

    const result = await db.runAsync(
      `UPDATE player_skills 
       SET level = ?, current_xp = ? 
       WHERE id = ?`,
      [newLevel, newXp, skillId],
    );

    if (result.changes > 0) {
      logSQL("updateSkillLevel", true, start, {
        skillId,
        newLevel,
        newXp,
      });
      return {
        success: true,
        data: result.lastInsertRowId,
      };
    }

    logSQL(
      "updateSkillLevel",
      false,
      start,
      `No record found for ID: ${skillId}`,
    );
    return {
      success: false,
      error: `Skill record ${skillId} not found.`,
    };
  } catch (error) {
    logSQL("updateSkillLevel", false, start, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database update failed",
    };
  }
};
