import { IconNameMC } from "./common.d.ts";

type BaseSkillType = {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: IconNameMC;
  category: string;
  learn_duration_minutes: number;
  unlock_at: number;
  base_xp: number;
  price: number;
};

type ActiveSkillType = Pick<
  BaseSkillType,
  "id" | "name" | "category" | "icon" | "color" | "description" | "base_xp"
> & {
  code: string;
  level: number;
  current_xp: number;
  base_upgrade_cost: number;
  learn_start_time: string;
  learn_end_time: string;
};

export type SkillCode =
  | "COD"
  | "DBM"
  | "MAT"
  | "SEC"
  | "AI"
  | "DES"
  | "CPY"
  | "VID"
  | "MKT"
  | "NEG"
  | "PRJ"
  | "FIN"
  | "ENG"
  | "PUB"
  | "NET";
