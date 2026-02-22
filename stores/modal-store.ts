import { create } from "zustand";
import { BaseSkillType } from "../types/skills.d.ts";

interface GlobalModalStore {
  isOpen: boolean;
  skill: BaseSkillType | null;
  tool: BaseToolType | null;

  openBuySkill: (skill: BaseSkillType) => void;
  openBuyTool: (tool: BaseToolType) => void;
  closeModal: () => void;
}

export const useGlobalModal = create<GlobalModalStore>((set) => ({
  isOpen: false,
  skill: null,
  tool: null,

  openBuySkill: (skill) => set({ isOpen: true, skill }),
  openBuyTool: (tool) => set({ isOpen: true, tool }),
  closeModal: () => set({ isOpen: false, skill: null }),
}));
