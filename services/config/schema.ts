export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER DEFAULT 1,
    company_name TEXT NOT NULL,
    money REAL DEFAULT 0,
    xp INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT,
    base_xp INTEGER DEFAULT 100,
    base_upgrade_cost INTEGER DEFAULT 2500,
    unlock_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS player_skills (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    skill_id TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(player_id, skill_id)
  );`,

  `CREATE TABLE IF NOT EXISTS gigs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    reward_money REAL NOT NULL,
    reward_xp INTEGER NOT NULL,
    reward_reputation INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    urgency_level TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  );`,

  `CREATE TABLE IF NOT EXISTS daily_milestones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    target_type TEXT NOT NULL,
    reward_money REAL DEFAULT 0,
    reward_xp INTEGER DEFAULT 0,
    reward_reputation INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS player_daily_milestones (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    milestone_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES daily_milestones(id) ON DELETE CASCADE
  );`,
];
