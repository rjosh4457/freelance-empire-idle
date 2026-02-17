import { create } from "zustand";
import { getProfile } from "../services/player-service.ts";

interface PlayerState {
  player: BasePlayerType | null;
  money: number;
  getPlayer: () => Promise<{ success: boolean; error?: string }>;
  setPlayer: (player: BasePlayerType) => void;
  updateMoney: (newAmount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  player: null,
  money: 0,

  getPlayer: async () => {
    const response = await getProfile();

    if (response.success && response.data) {
      set({
        player: response.data,
      });
      return { success: true };
    } else {
      console.warn("Store: No profile found in database.");
      return { success: false, error: response.error };
    }
  },
  setPlayer: (player: BasePlayerType) =>
    set({
      player,
      money: player.money,
    }),

  updateMoney: (newAmount: number) =>
    set((state) => ({
      money: newAmount,
      player: state.player ? { ...state.player, money: newAmount } : null,
    })),
}));
