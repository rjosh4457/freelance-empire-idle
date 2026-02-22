type BaseToolType = {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  description: string;
  price: number;
  perks: string;
  required_level: number;
  is_owned: number;
  required_perks: string;
  image: string;
  base_xp: number;
  max_level: number;
  created_at: string;
};

type PlayerToolType = BaseToolType & {
  tool_id: string;
  is_equipped: boolean;
  acquired_at: string;
  base_upgrade_cost: number;
  level: number;
  current_xp: number;
};
