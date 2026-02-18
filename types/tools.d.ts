type BaseToolType = {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  description: string;
  price: number;
  perks: string;
  required_level: number;
  is_owned: boolean;
  required_perks: string;
  image: string;
  created_at: string;
};

type PlayerToolType = BaseToolType & {
  is_equipped: boolean;
  acquired_at: string;
};
