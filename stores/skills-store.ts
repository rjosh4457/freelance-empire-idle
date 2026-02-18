import { create } from "zustand";
import {
  fetchActiveSkills,
  fetchAllSkills,
  saveNewSkill,
  updateSkillLevel,
} from "../services/skills-service.ts";
import { ActiveSkillType, BaseSkillType } from "../types/skills.d.ts";
import { computeMaxXp } from "../utils/config.ts";
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
  getPlayerSkills: () => Promise<void>;
  getAllSkills: () => Promise<void>;
  upgradeSkill: (skillId: string, xpGained: number) => Promise<void>;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  activeSkills: [], // Fully learned skills
  studyingSkills: [], // Skills currently on a timer
  allSkills: [], // The library of all possible skills

  getPlayerSkills: async () => {
    const res = await fetchActiveSkills();
    if (!res.data) return;

    const now = new Date();
    // Using getTime() for safer comparison
    const active = res.data.filter(
      (a) => new Date(a.learn_end_time).getTime() <= now.getTime(),
    );

    const studying = res.data.filter(
      (a) => new Date(a.learn_end_time).getTime() > now.getTime(),
    );

    set({
      activeSkills: active,
      studyingSkills: studying,
    });
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
    const tempId = `temp-${Date.now()}`;
    const finishAt = getFinishAt(skill.learn_duration_minutes);

    const newBoughtSkill: ActiveSkillType = {
      ...skill,
      id: tempId,
      level: 1,
      current_xp: 0,
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

  upgradeSkill: async (skillId, xpGained) => {
    // Get current state for calculation and potential rollback
    const previousSkills = get().activeSkills;
    const skillToUpgrade = previousSkills.find((s) => s.id === skillId);
    console.log(skillId);

    if (!skillToUpgrade) return;

    // Calculate new values outside the 'set' for clean logic
    let newLevel = skillToUpgrade.level;
    let newXp = (skillToUpgrade.current_xp || 0) + xpGained;

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
