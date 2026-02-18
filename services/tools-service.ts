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
