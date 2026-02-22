import { SQLiteDatabase } from "expo-sqlite";
import { getDb } from "./config/db.ts";
import { SCHEMA } from "./config/schema.ts";
import { SEED_DATA } from "./config/seed.ts";

export const initDatabase = async () => {
  try {
    const db = await getDb();
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    // Execute Schema
    for (const statement of SCHEMA) {
      try {
        await db.execAsync(statement);
      } catch (err) {
        console.log("FAILED STATEMENT:", statement);
        throw err;
      }
    }

    // Execute Seeds
    for (const seed of SEED_DATA) {
      try {
        await db.runAsync(seed);
      } catch (err) {
        console.log("❌ FAILED SEED:", seed);
        throw err;
      }
    }

    await verifyTables(db);
    console.log("🚀 Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
};

// 3. Keep Verification logic separate
async function verifyTables(db: SQLiteDatabase) {
  const tables = [
    "players",
    "tools",
    "player_tools",
    "skills",
    "player_skills",
    "clients",
    "gigs",
    "player_active_gigs",
    "player_gigs_log",
    "player_client_progress",
    "daily_milestones",
    "player_daily_milestones",
  ];
  for (const table of tables) {
    const row = await db.getFirstAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
      [table],
    );
    console.log(`- ${table.padEnd(25)}: ${row ? "✅" : "❌"}`);
  }
}
