import { DBResponse } from "../types/common.d.ts";
import { logSQL } from "../utils/logger.ts";
import { getDb } from "./config/db.ts";

export const getAllClients = async (): Promise<
  DBResponse<BaseClientType[]>
> => {
  const start = performance.now();
  try {
    const db = await getDb();
    const clients = await db.getAllAsync<BaseClientType>(
      "SELECT * FROM clients ORDER BY reputation_required ASC",
    );
    logSQL("getAllClients", true, start, { count: clients });
    return { success: true, data: clients };
  } catch (error) {
    logSQL("getAllClients", false, start, error);
    return { success: false, error: "Failed to fetch clients." };
  }
};
