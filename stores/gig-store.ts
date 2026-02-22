import { create } from "zustand"; // Your SQL insert function
import {
    generateMarketplaceGigs,
    getAvailableGigs,
    saveGeneratedGigs
} from "../services/gig-service.ts";
import { usePlayerStore } from "./player-store.ts";

interface GigsStore {
  gigs: BaseGigType[];
  getAllGigs: (clients: BaseClientType[]) => Promise<void>;
}

export const useGigsStore = create<GigsStore>((set) => ({
  gigs: [],

  getAllGigs: async (clients) => {
    const result = await getAvailableGigs();

    if (result.success && result.data && result.data.length > 0) {
      set({ gigs: result.data });
    } else {
      // Use the player's current reputation from the other store
      const currentRep = usePlayerStore.getState().player?.reputation || 0;

      // Generate exactly 5 gigs from eligible clients
      const fiveGigs = generateMarketplaceGigs(clients, currentRep, 5);

      if (fiveGigs.length > 0) {
        await saveGeneratedGigs(fiveGigs);
        const freshResult = await getAvailableGigs();
        set({ gigs: freshResult.data || [] });
      }
    }
  },
}));
