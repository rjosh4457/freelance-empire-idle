export const SEED_DATA = [
  `INSERT OR IGNORE INTO daily_milestones 
(id, name, description, icon, color, target_value, target_type, reward_money, reward_xp) 
VALUES 
  ('m1', 'Coffee Money', 'Earn your first $50 today', 'payments', '#3b82f6', 50, 'MONEY', 25, 10),
  ('m2', 'Big Leagues', 'Earn a total of $500 today', 'monetization-on','#fbbf24', 500, 'MONEY', 100, 50),
  ('m3', 'Rainmaker', 'Earn a total of $1,000 today', 'trending-up','#ef4444', 1000, 'MONEY', 250, 100),
  ('m4', 'Tax Season', 'Earn $2,500 in a single day', 'account-balance', '#10b981', 2500, 'MONEY', 500, 200),
  ('m5', 'Fast Starter', 'Complete 1 gig', 'bolt', '#f97316', 1, 'GIGS', 20, 30),
  ('m6', 'Busy Bee', 'Complete 3 gigs today', 'work', '#f43f5e', 3, 'GIGS', 100, 75),
  ('m7', 'Workaholic', 'Complete 5 gigs today', 'business-center', '#8b5cf6', 5, 'GIGS', 250, 150),
  ('m8', 'Outsourcer', 'Complete 10 gigs today', 'groups', '#06b6d4', 10, 'GIGS', 600, 400),
  ('m9', 'Self Improvement', 'Gain 100 total XP', 'school', '#6366f1', 100, 'XP', 50, 50),
  ('m10', 'Deep Work', 'Gain 500 total XP', 'psychology', '#a855f7', 500, 'XP', 200, 100),
  ('m11', 'Expertise', 'Level up any skill once', 'star', '#fbbf24', 1, 'SKILL_UP', 300, 200),
  ('m12', 'Polymath', 'Level up 3 different skills', 'auto-awesome', '#f59e0b', 3, 'SKILL_UP', 1000, 500),
  ('m13', 'Rising Star', 'Gain 5 Reputation points', 'thumb-up', '#22c55e', 5, 'REPUTATION', 100, 50),
  ('m14', 'Local Legend', 'Gain 20 Reputation points', 'verified', '#14b8a6', 20, 'REPUTATION', 500, 250),
  ('m15', 'Networking', 'Apply for 5 different gigs', 'send', '#ec4899', 5, 'APPLICATIONS', 50, 20),
  ('m16', 'High Stakes', 'Complete a gig worth over $1000', 'diamond', '#0ea5e9', 1, 'HIGH_VALUE_GIG', 250, 100),
  ('m17', 'Bug Hunter', 'Complete 2 ''Development'' type gigs', 'bug-report', '#3b82f6', 2, 'GIG_TYPE_DEV', 150, 80),
  ('m18', 'Creative Soul', 'Complete 2 ''Design'' type gigs', 'palette', '#fb923c', 2, 'GIG_TYPE_DESIGN', 150, 80),
  ('m19', 'Closer', 'Finish a gig within 1 hour of starting', 'timer', '#ef4444', 1, 'SPEED_FINISH', 200, 100),
  ('m20', 'Overachiever', 'Complete all other 4 dailies', 'workspace-premium', '#ffd700', 4, 'DAILIES_COMPLETED', 1000, 1000);`,

  `INSERT OR IGNORE INTO skills (id, code, name, description, color, icon, category, base_xp, base_upgrade_cost, unlock_at) 
VALUES
  ('s1', 'COD', 'Coding', 'Master logical thinking and syntax to build complex systems.', '#3b82f6', 'laptop', 'Technical', 100, 2500, 1),
  ('s2', 'DES', 'Design', 'Create stunning visuals and intuitive user experiences.', '#fbbf24', 'palette', 'Creative', 100, 2500, 1),
  ('s3', 'MAT', 'Mathematics', 'Advanced algorithms and data analysis capabilities.', '#6366f1', 'calculate', 'Technical', 120, 2500, 1),
  ('s4', 'DBM', 'Databases', 'Architect efficient data storage and retrieval systems.', '#06b6d4', 'storage', 'Technical', 110, 2500, 1),
  ('s5', 'SEC', 'Cybersecurity', 'Protect digital assets from external threats.', '#ef4444', 'security', 'Technical', 150, 2500, 5),
  ('s6', 'MKT', 'Marketing', 'Spread the word and build a recognizable brand.', '#f43f5e', 'campaign', 'Business', 100, 2500, 5),
  ('s7', 'NEG', 'Negotiation', 'The art of the deal: get paid what you are worth.', '#14b8a6', 'handshake', 'Business', 130, 2500, 5),
  ('s8', 'PRJ', 'Project Mgmt', 'Organize tasks and lead teams to victory.', '#8b5cf6', 'assignment', 'Business', 110, 2500, 5),
  ('s9', 'FIN', 'Finance', 'Optimize taxes, investments, and cash flow.', '#10b981', 'payments', 'Business', 140, 2500, 10),
  ('s10', 'ENG', 'English', 'Master global communication and technical writing.', '#f97316', 'translate', 'Communication', 80, 2500, 10),
  ('s11', 'PUB', 'Public Speaking', 'Confidently pitch your ideas to large audiences.', '#ec4899', 'record-voice-over', 'Communication', 120, 2500, 10),
  ('s12', 'NET', 'Networking', 'Building a high-value circle of professional contacts.', '#22c55e', 'hub', 'Communication', 110, 2500, 10),
  ('s13', 'AI', 'AI Training', 'Prompt engineering and training custom LLMs.', '#a855f7', 'memory', 'Technical', 160, 2500, 15),
  ('s14', 'CPY', 'Copywriting', 'Writing words that sell and convert users.', '#fb923c', 'history-edu', 'Creative', 90, 2500, 15),
  ('s15', 'VID', 'Video Production', 'Creating high-impact motion graphics and content.', '#ef4444', 'videocam', 'Creative', 130, 2500,15);`,
];
