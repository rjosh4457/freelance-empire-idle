import * as SQLite from "expo-sqlite";

// Do NOT use await here at the top level
export const dbPromise = SQLite.openDatabaseAsync("game-v1.0.0.4.db");

// Helper to get the db instance easily
export const getDb = async () => {
  return await dbPromise;
};
