import { DBResponse } from "../types/common.d.ts";
import { logSQL } from "../utils/logger.ts";
import { getDb } from "./config/db.ts";

export const fetchAllTools = async (): Promise<DBResponse<BaseToolType[]>> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const tools = await db.getAllAsync<BaseToolType>(`SELECT * FROM tools`);

    if (!tools || tools.length === 0) {
      logSQL("fetchAllTools", true, start, "Result: Empty Table");
      return {
        success: false,
        error: "No tools Found.",
      };
    }
    logSQL("fetchAllTools", true, start, { count: tools });
    return {
      success: true,
      data: tools,
    };
  } catch (error) {
    logSQL("fetchAllTools", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};
export const fetchPlayerTools = async () => {
  const start = performance.now();
  try {
    const db = await getDb();
    const tools = await db.getAllAsync<PlayerToolType>(
      `SELECT 
        pt.id,
        pt.tool_id,
        t.name,
        t.category,
        t.sub_category,
        t.description,
        t.price,
        t.perks,
        t.required_level,
        t.is_owned,
        t.required_perks,
        t.image,
        t.base_xp,
        t.max_level,
        pt.base_upgrade_cost,
        pt.level,
        pt.current_xp
      FROM player_tools pt 
      JOIN tools t ON pt.tool_id = t.id`,
    );

    if (!tools || tools.length === 0) {
      logSQL("fetchPlayerTools", true, start, "Result: Empty Table");
      return {
        success: false,
        error: "No tools Found.",
      };
    }
    logSQL("fetchPlayerTools", true, start, { count: tools });
    return {
      success: true,
      data: tools,
    };
  } catch (error) {
    logSQL("fetchPlayerTools", false, start, error);
    return {
      success: false,
      error: "Internal database error.",
    };
  }
};
export const saveBoughtItem = async (
  playerId: number,
  toolId: string,
  baseUpgradeCost: number,
): Promise<DBResponse<string>> => {
  const start = performance.now();
  const db = await getDb();
  try {
    const entryId = `${toolId + "_" + Date.now()}`;

    await db.runAsync("BEGIN TRANSACTION;");
    // Insert into player_tools (ignore duplicates)
    const result = await db.runAsync(
      `INSERT OR IGNORE INTO player_tools (id, player_id, tool_id, base_upgrade_cost) VALUES (?,?,?,?)`,
      [entryId, playerId, toolId, baseUpgradeCost],
    );
    // Update tools table to mark as owned
    if (result.changes > 0) {
      await db.runAsync(`UPDATE tools SET is_owned = 1 WHERE id = ?`, [toolId]);
      await db.runAsync("COMMIT;");

      logSQL("saveBoughtItem", true, start, {
        entryId,
        lastInsertRowId: result.lastInsertRowId,
      });

      return {
        success: true,
        data: entryId,
      };
    }

    await db.runAsync("ROLLBACK;");
    logSQL(
      "saveBoughtItem",
      false,
      start,
      "Record already exists (INSERT IGNORED)",
    );

    return {
      success: false,
      error: "Tool duplicate entry.",
    };
  } catch (error) {
    await db.runAsync("ROLLBACK;");
    logSQL("saveBoughtItem", false, start, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
};

export const upgradeToolLevel = async (
  toolId: string,
  newLevel: number,
  newXp: number,
): Promise<DBResponse<number>> => {
  const start = performance.now();
  try {
    const db = await getDb();

    const result = await db.runAsync(
      `UPDATE player_tools 
       SET level = ?, current_xp = ? 
       WHERE id = ?`,
      [newLevel, newXp, toolId],
    );

    if (result.changes > 0) {
      logSQL("upgradeToolLevel", true, start, {
        toolId,
        newLevel,
        newXp,
      });
      return {
        success: true,
        data: result.changes,
      };
    }

    logSQL(
      "upgradeToolLevel",
      false,
      start,
      `No record found for ID: ${toolId}`,
    );
    return {
      success: false,
      error: `Tool record ${toolId} not found.`,
    };
  } catch (error) {
    logSQL("upgradeToolLevel", false, start, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database update failed",
    };
  }
};
