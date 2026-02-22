type BaseGigType = {
  id: number;
  name: string;
  description: string;
  type: string;
  client_id: string; // id in BaseClientType
  required_skill: string;
  required_level: number;
  difficulty: number;
  reward_money: number;
  reward_xp: number;
  reward_reputation: number;
  energy_cost: number;
  stress_increase: number;
  duration: number;
  urgency_level: string;
  quality_score: number;
  success_score: number;
  created_at: string;
  expires_at: string;
};
