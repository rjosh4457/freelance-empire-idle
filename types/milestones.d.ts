import { IconNameMC } from "./common.d.ts";

type BaseMilestonesType = {
  id: string;
  name: string;
  description: string;
  icon: IconNameMC;
  color: string;
  target_value: number;
  target_type: string;
  reward_money: number;
  reward_xp: number;
};
type MilestoneStatusType = "active" | "completed";

type DailyMilestoneType = Pick<
  BaseMilestonesType,
  "name" | "description" | "target_value" | "icon" | "color"
> & {
  id: number;
  progress: number;
  status: MilestoneStatusType;
  percent_complete: number;
};
