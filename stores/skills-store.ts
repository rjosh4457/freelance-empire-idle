import { create } from "zustand";
import {
    fetchActiveSkills,
    fetchSchoolSkills,
    saveNewSkill,
} from "../services/skills-service.ts";
import { ActiveSkillType, BaseSkillType } from "../types/skills.d.ts";
import { usePlayerStore } from "./player-store.ts";

interface SkillState {
  activeSkills: ActiveSkillType[];
  schoolSkills: BaseSkillType[];
  // Actions
  buySkill: (
    skill: BaseSkillType,
  ) => Promise<{ success: boolean; error?: string }>;
  getActiveSkills: () => Promise<void>;
  getSchoolSkills: () => Promise<void>;
  upgradeSkill: (skillId: string, newLevel: number, newXp: number) => void;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  activeSkills: [],
  schoolSkills: [],

  getActiveSkills: async () => {
    const res = await fetchActiveSkills();
    set({ activeSkills: res.data || [] });
  },

  getSchoolSkills: async () => {
    const res = await fetchSchoolSkills();
    set({ schoolSkills: res.data || [] });
  },

  buySkill: async (skill: BaseSkillType) => {
    const previousActive = get().activeSkills;
    const previousSchool = get().schoolSkills;
    const player = usePlayerStore.getState().player;

    if (!player) {
      return { success: false, error: "Player not found" };
    }

    const tempId = `temp-${Date.now()}`;

    const newActiveSkill: ActiveSkillType = {
      ...skill,
      id: tempId,
      level: 1,
      current_xp: 0,
    };

    set({
      activeSkills: [...previousActive, newActiveSkill],
      schoolSkills: previousSchool.filter((s) => s.id !== skill.id),
    });

    const res = await saveNewSkill(skill.id, player.id);

    if (res.success && res.data) {
      set((state) => ({
        activeSkills: state.activeSkills.map((s) =>
          s.id === tempId ? { ...s, id: res.data! } : s,
        ),
      }));
      return { success: true };
    } else {
      set({
        activeSkills: previousActive,
        schoolSkills: previousSchool,
      });
      return { success: false, error: res.error || "Database error" };
    }
  },

  upgradeSkill: (skillId, newLevel, newXp) => {
    set((state) => ({
      activeSkills: state.activeSkills.map((s) =>
        s.id === skillId ? { ...s, level: newLevel, current_xp: newXp } : s,
      ),
    }));
  },
}));
