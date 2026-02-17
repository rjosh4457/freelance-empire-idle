import { create } from "zustand";
import { BaseSkillType } from "../types/skills.d.ts";

interface GlobalModalStore {
  isOpen: boolean;
  skill: BaseSkillType | null;
  openBuySkill: (skill: BaseSkillType) => void;
  closeBuySkill: () => void;
}

export const useGlobalModal = create<GlobalModalStore>((set) => ({
  isOpen: false,
  skill: null,
  openBuySkill: (skill) => set({ isOpen: true, skill }),
  closeBuySkill: () => set({ isOpen: false, skill: null }),
}));
