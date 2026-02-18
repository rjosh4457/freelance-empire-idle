export const SCHEMA = [
  // 1. PLAYERS: The core profile and currency
  `CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER DEFAULT 1,
    company_name TEXT NOT NULL,
    money REAL DEFAULT 0,
    xp INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 100,
    max_energy INTEGER DEFAULT 100,
    stress INTEGER DEFAULT 0,
    max_stress INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  // 2. TOOLS: Static catalog of buyable items
  `CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,                   -- unique tool ID
    name TEXT NOT NULL,                    -- tool name, e.g., "Laptop Pro"
    category TEXT NOT NULL,                -- e.g., Software, Hardware, Office
    sub_category TEXT NOT NULL,                    -- e.g., computer, tablet, software, headset
    description TEXT,                      -- details about the tool
    price REAL NOT NULL,                   -- cost in-game currency
    perks TEXT,                            -- JSON array of modifiers/perks this tool provides
    required_level INTEGER DEFAULT 1,      -- minimum player level to buy
    is_owned INTEGER DEFAULT 0,            -- 0 = not owned, 1 = owned
    required_perks TEXT DEFAULT '[]',       -- Display to player if perks achieved
    image TEXT NOT NULL,                   -- File name
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,
  // 3. PLAYER_TOOLS: Junction table for ownership and equipment
  `CREATE TABLE IF NOT EXISTS player_tools (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    tool_id TEXT NOT NULL,
    is_equipped INTEGER DEFAULT 0,
    acquired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
  );`,
  // 4. SKILLS: Static catalog of learnable skills
  `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT,
    learn_duration_minutes INTEGER DEFAULT 0,
    base_xp INTEGER DEFAULT 100,
    base_upgrade_cost INTEGER DEFAULT 2500,
    unlock_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,
  // 5. PLAYER_SKILLS: Tracking player progression
  `CREATE TABLE IF NOT EXISTS player_skills (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    skill_id TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    learn_start_time DATETIME,
    learn_end_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(player_id, skill_id)
  );`,
  // 6. CLIENTS: Client tiers and reputation requirements
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,                  
    name TEXT NOT NULL,                          -- tier name
    tier TEXT NOT NULL,                          -- repeat for clarity (small, medium, etc.)
    description TEXT,                     
    reputation_required INTEGER DEFAULT 0,       -- threshold to unlock tier
    perks TEXT,                                  -- JSON array of perks/unlocks
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,
  // 7. GIGS: Available jobs to pick up
  `CREATE TABLE IF NOT EXISTS gigs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,                           -- category (design, dev, marketing, etc.)
    client_id TEXT,                               -- foreign key to clients
    required_skill TEXT,                          -- skill required for gig
    required_level INTEGER DEFAULT 1,             -- minimum skill level
    difficulty INTEGER DEFAULT 1,                 -- 1 = easy, 5 = hard
    reward_money REAL NOT NULL,
    reward_xp INTEGER NOT NULL,
    reward_reputation INTEGER NOT NULL,
    max_reputation INTEGER DEFAULT 0,
    energy_cost INTEGER DEFAULT 0,                -- how much energy it consumes
    stress_increase INTEGER DEFAULT 0,            -- how much stress is added
    duration INTEGER NOT NULL,                    -- in hours or days
    urgency_level TEXT DEFAULT 'normal',          -- normal / high / critical
    status TEXT DEFAULT 'open',                   -- open / in_progress / completed / failed
    is_repeatable INTEGER DEFAULT 0,              -- recurring gigs
    is_special INTEGER DEFAULT 0,                 -- special story/event gigs
    quality_score REAL DEFAULT 0,                 -- performance score
    success_score REAL DEFAULT 0,                 -- final success calculation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );`,
  // 8. PLAYER_ACTIVE_GIGS: Current workload
  `CREATE TABLE IF NOT EXISTS player_active_gigs (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    gig_id TEXT NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'in_progress',              -- in_progress / paused / failed
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
  );`,
  // 9. PLAYER_GIGS_LOG: History of finished work
  `CREATE TABLE IF NOT EXISTS player_gigs_log (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,
    gig_id TEXT NOT NULL,
    completed_at DATETIME,
    success_score REAL,
    quality_score REAL,
    money_earned REAL,
    reputation_earned INTEGER,
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (gig_id) REFERENCES gigs(id)
  );`,
  // 10. PLAYER_CLIENT_PROGRESS: Relationship status with specific clients
  `CREATE TABLE IF NOT EXISTS player_client_progress (
    id TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL,                               -- foreign key to player
    client_id TEXT NOT NULL,                                -- foreign key to client
    reputation INTEGER DEFAULT 0,                   -- current reputation with this client
    tier_progress REAL DEFAULT 0,                   -- 0–100%, progress to next tier
    last_gig_completed_at DATETIME,                 -- timestamp of last completed gig
    total_gigs_completed INTEGER DEFAULT 0,
    total_money_earned REAL DEFAULT 0,
    level INTEGER DEFAULT 1,                        -- level for client tier
    perks_unlocked TEXT,                            -- JSON array of perks unlocked
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );`,
  // 11. MILESTONES: Daily achievements
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
  // 12. PLAYER_DAILY_MILESTONES: Tracking daily progress
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

  // INDEXES for performance
  `CREATE INDEX IF NOT EXISTS idx_player_skills_player ON player_skills(player_id);`,
  `CREATE INDEX IF NOT EXISTS idx_player_tools_player ON player_tools(player_id);`,
  `CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);`,
];
