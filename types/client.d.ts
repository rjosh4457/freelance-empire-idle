type BaseClientType = {
  id: string;
  name: string;
  tier: string;
  description: string;
  reputation_required: number;
  perks: string; // JSON array of perks/unlocks
};
