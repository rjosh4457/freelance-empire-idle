import { create } from "zustand";
import { getDailyMilestone } from "../services/milestone-service.ts";
import { DailyMilestoneType } from "../types/milestones.d.ts";
import { usePlayerStore } from "./player-store.ts";

interface MilestoneState {
  milestones: DailyMilestoneType[];
  // Updated return type to match your store patterns
  getMilestones: () => Promise<{ success: boolean; error?: string }>;
}

export const useMilestoneStore = create<MilestoneState>((set) => ({
  milestones: [],

  getMilestones: async () => {
    // 1. Get player from the other store
    const player = usePlayerStore.getState().player;

    // 2. If no player, we can't fetch milestones.
    if (!player) {
      return { success: false, error: "Player not loaded yet." };
    }

    const response = await getDailyMilestone(player.id);

    if (response.success && response.data) {
      set({ milestones: response.data });
      return { success: true };
    } else {
      // If no milestones found, we should probably clear the list
      // so we don't show yesterday's data by accident.
      set({ milestones: [] });
      console.warn("MilestoneStore: Could not fetch milestones.");
      return { success: false, error: response.error };
    }
  },
}));
