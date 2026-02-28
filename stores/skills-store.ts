import { create } from "zustand";
import {
  fetchActiveSkills,
  fetchAllSkills,
  saveNewSkill,
  updateSkillLevel,
} from "../services/skills-service.ts";
import { ActiveSkillType, BaseSkillType } from "../types/skills.d.ts";
import { computeMaxXp, computeXpGained } from "../utils/config.ts";
import { getFinishAt } from "../utils/helper.ts";
import { usePlayerStore } from "./player-store.ts";

interface SkillState {
  activeSkills: ActiveSkillType[];
  studyingSkills: ActiveSkillType[];
  allSkills: BaseSkillType[];

  // Actions
  buySkill: (
    skill: BaseSkillType,
  ) => Promise<{ success: boolean; error?: string }>;
  getPlayerSkills: () => Promise<{ success: boolean; error?: string }>;
  getAllSkills: () => Promise<void>;
  upgradeSkill: (skillId: string, cost: number) => Promise<void>;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  activeSkills: [], // Fully learned skills
  studyingSkills: [], // Skills currently on a timer
  allSkills: [], // The library of all possible skills

  getPlayerSkills: async () => {
    const res = await fetchActiveSkills();
    if (!res.data)
      return { success: false, error: "Cannot fetch active skills" };

    const now = Date.now();

    const active: typeof res.data = [];
    const studying: typeof res.data = [];

    for (const skill of res.data) {
      const endTime = new Date(skill.learn_end_time).getTime();

      if (endTime <= now) {
        active.push(skill);
      } else {
        studying.push(skill);
      }
    }

    set({
      activeSkills: active,
      studyingSkills: studying,
    });

    return { success: true };
  },

  getAllSkills: async () => {
    const { activeSkills, studyingSkills } = get();
    const res = await fetchAllSkills();

    if (!res.data) {
      set({ allSkills: [] });
      return;
    }

    const filtered = res.data.filter((skill) => {
      const isMastered = activeSkills.some((a) => a.id === skill.id);
      const isStudying = studyingSkills.some((s) => s.id === skill.id);

      return !isMastered && !isStudying;
    });

    set({ allSkills: filtered });
  },
  buySkill: async (skill: BaseSkillType) => {
    const { activeSkills, studyingSkills, allSkills } = get();
    const player = usePlayerStore.getState().player;

    const now = new Date();

    if (!player) return { success: false, error: "Player not found" };
    if (player.money < skill.price) {
      return { success: false, error: "Insufficient funds" };
    }
    const tempId = `temp-${Date.now()}`;
    const finishAt = getFinishAt(skill.learn_duration_minutes);
    const baseUpgradeCost = Math.floor(skill.price * 0.3);
    const newBoughtSkill: ActiveSkillType = {
      ...skill,
      id: tempId,
      level: 1,
      current_xp: 0,
      base_upgrade_cost: baseUpgradeCost,
      learn_start_time: now.toISOString(),
      learn_end_time: finishAt,
    };

    set({
      studyingSkills: [...studyingSkills, newBoughtSkill],
      allSkills: allSkills.filter((s) => s.id !== skill.id),
    });

    const res = await saveNewSkill(
      skill.id,
      player.id,
      now.toISOString(),
      finishAt,
      baseUpgradeCost,
    );

    if (res.success && res.data) {
      set((state) => ({
        studyingSkills: state.studyingSkills.map((s) =>
          s.id === tempId ? { ...s, id: res.data! } : s,
        ),
      }));
      return { success: true };
    } else {
      set({ activeSkills, studyingSkills, allSkills });
      return { success: false, error: res.error || "Database error" };
    }
  },

  upgradeSkill: async (skillId, cost) => {
    // Get current state for calculation and potential rollback
    const previousSkills = get().activeSkills;
    const skillToUpgrade = previousSkills.find((s) => s.id === skillId);
    const updateMoney = usePlayerStore.getState().updateMoney;
    const player = usePlayerStore.getState().player;

    if (!skillToUpgrade || !player) return;
    if (player.money < cost) {
      console.error("Insufficient funds for upgrade");
      return;
    }

    /** Update Player Money, Local Only */
    const newBalance = player.money - cost;
    updateMoney(newBalance);

    // Calculate new values outside the 'set' for clean logic
    let newLevel = skillToUpgrade.level;
    let newXp =
      (skillToUpgrade.current_xp || 0) +
      computeXpGained(skillToUpgrade.level, 1);

    while (true) {
      const maxXpForCurrentLevel = computeMaxXp(
        skillToUpgrade.base_xp,
        newLevel,
      );
      if (newXp >= maxXpForCurrentLevel) {
        newXp -= maxXpForCurrentLevel;
        newLevel += 1;
      } else {
        break;
      }
    }

    // OPTIMISTIC UPDATE: Update UI immediately
    set((state) => ({
      activeSkills: state.activeSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, level: newLevel, current_xp: newXp }
          : skill,
      ),
    }));

    // DATABASE SYNC: Perform the side effect after the UI has updated
    try {
      const res = await updateSkillLevel(skillId, newLevel, newXp);

      if (!res.success) {
        throw new Error(res.error);
      }
    } catch (error) {
      // ROLLBACK: If DB fails, revert to the old state
      console.error("Failed to persist skill upgrade:", error);
      set({ activeSkills: previousSkills });
    }
  },
}));
