import { create } from "zustand";
import { fetchAllTools } from "../services/tools-service.ts";

interface ToolState {
  tools: BaseToolType[];
  playerTools: PlayerToolType[];

  getAllTools: (playerPerks: string[]) => Promise<void>;
}

export const useToolStore = create<ToolState>((set) => ({
  tools: [],
  playerTools: [],

  getAllTools: async (playerPerks: string[]) => {
    const res = await fetchAllTools();

    if (!res.data) {
      set({ tools: [] });
      return;
    }

    const filtered = res.data.filter((tool) => {
      const requiredPerks: string[] = JSON.parse(tool.required_perks || "[]");
      return requiredPerks.every((perks) => playerPerks.includes(perks));
    });

    set({ tools: filtered });
  },
}));
