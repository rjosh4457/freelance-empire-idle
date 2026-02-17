import { IconNameMC } from "./common.d.ts";

type BaseSkillType = {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: IconNameMC;
  category: string;
  unlock_at: number;
  base_xp: number;
  base_upgrade_cost: number;
};

type ActiveSkillType = Pick<
  BaseSkillType,
  | "id"
  | "name"
  | "category"
  | "icon"
  | "color"
  | "description"
  | "base_upgrade_cost"
  | "base_xp"
> & {
  level: number;
  current_xp: number;
};
