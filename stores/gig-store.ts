import { create } from "zustand"; // Your SQL insert function
import {
  fetchCurrentActiveGig,
  generateMarketplaceGigs,
  getAvailableGigs,
  saveAcceptedGig,
  saveGeneratedGigs,
  updateGigProgress,
  updateGigStatus,
} from "../services/gig-service.ts";
import { calculateSpeedBySkillLevel } from "../utils/config.ts";
import { usePlayerStore } from "./player-store.ts";
import { useSkillStore } from "./skills-store.ts";

interface GigsStore {
  gigs: BaseGigType[];
  activeGig: AcceptedGigType | null;
  getAllGigs: (clients: BaseClientType[]) => Promise<void>;
  saveAcceptedGig: (
    gig: BaseGigType,
  ) => Promise<{ success: boolean; error?: string }>;
  getCurrentActiveGig: () => Promise<{ success: boolean; error?: string }>;
  saveGigProgress: () => Promise<void>;
  startGigEngine: () => void;
  stopGigEngine: () => void;
  applyBoost: () => void;
  saveGigStatus: (status: string) => Promise<void>;
  clearActiveGig: () => void;
  applyOfflineProgress: () => void;
}

let gigInterval: ReturnType<typeof setInterval> | null = null;

export const useGigsStore = create<GigsStore>((set, get) => ({
  gigs: [],
  activeGig: null,

  getAllGigs: async (clients) => {
    const result = await getAvailableGigs();

    if (result.success && result.data && result.data.length > 0) {
      set({ gigs: result.data });
    } else {
      // Use the player's current reputation from the other store
      const currentRep = usePlayerStore.getState().player?.reputation || 0;

      // Generate exactly 10 gigs from eligible clients
      const fiveGigs = generateMarketplaceGigs(clients, currentRep, 15);

      if (fiveGigs.length > 0) {
        await saveGeneratedGigs(fiveGigs);
        const freshResult = await getAvailableGigs();
        set({ gigs: freshResult.data || [] });
      }
    }
  },

  saveAcceptedGig: async (gig) => {
    const player = usePlayerStore.getState().player;
    const activeSkill = useSkillStore.getState().activeSkills;
    if (!player) return { success: false };

    const required_skill = activeSkill.find(
      (skill) => skill.code === gig.required_skill,
    );

    if (!required_skill) return { success: false };

    const res = await saveAcceptedGig(player.id, gig.id, gig.duration);

    if (res.success) {
      await get().getCurrentActiveGig();
    }
    return res;
  },
  getCurrentActiveGig: async () => {
    const player = usePlayerStore.getState().player;
    if (!player) return { success: false };

    const result = await fetchCurrentActiveGig(player.id);

    if (result.success && result.data) {
      set({ activeGig: result.data });
      return { success: true, data: result.data };
    }

    set({ activeGig: null });
    return { success: false };
  },
  saveGigProgress: async () => {
    const { activeGig } = get();
    if (!activeGig) return;

    const progress = activeGig.progress;
    const result = await updateGigProgress(progress, activeGig.id);
    if (result.success) {
      set({
        activeGig: {
          ...activeGig,
          progress,
        },
      });
    }
  },
  saveGigStatus: async (status) => {
    const { activeGig } = get();
    if (!activeGig) return;
    const result = await updateGigStatus(status, activeGig.id);
    if (result.success) {
      set({
        activeGig: {
          ...activeGig,
          status,
        },
      });
    }
  },
  stopGigEngine: () => {
    if (gigInterval) {
      clearInterval(gigInterval);
      gigInterval = null;
    }
  },
  startGigEngine: () => {
    if (gigInterval) return;

    gigInterval = setInterval(() => {
      const player = usePlayerStore.getState().player;
      const skills = useSkillStore.getState().activeSkills;
      const { activeGig } = get();
      if (!activeGig || !player) return;

      if (activeGig.progress >= 100) {
        get().saveGigStatus("completed");
        get().stopGigEngine();
        return;
      }

      const requiredSkill = skills.find(
        (s) => s.code === activeGig.required_skill,
      );
      if (!requiredSkill) return;

      const speed = calculateSpeedBySkillLevel(player, requiredSkill.level);

      const newProgress = Math.min(100, activeGig.progress + speed);

      set({
        activeGig: {
          ...activeGig,
          progress: newProgress,
        },
      });
    }, 1000);
  },

  applyOfflineProgress: () => {
    const player = usePlayerStore.getState().player;
    const skills = useSkillStore.getState().activeSkills;
    const { activeGig } = get();
    if (!activeGig || !player || !skills) return;

    const now = Date.now();
    const lastActiveTime = player.last_active_at
      ? new Date(player.last_active_at).getTime()
      : now;

    const diffSeconds = Math.max(0, Math.floor((now - lastActiveTime) / 1000));

    console.log("diffSeconds", diffSeconds);
    console.log("activeGig.required_skill", activeGig.required_skill);
    console.log("skills", skills);
    const requiredSkill = skills.find(
      (s) => s.code === activeGig.required_skill,
    );
    console.log("requiredSkill", requiredSkill);

    if (!requiredSkill) return;

    const speed = calculateSpeedBySkillLevel(player, requiredSkill.level);
    console.log("speed", speed);

    const offlineProgress = diffSeconds * speed;

    const newProgress = Math.min(100, activeGig.progress + offlineProgress);

    set({
      activeGig: {
        ...activeGig,
        progress: newProgress,
      },
    });

    // reset last active to now
    usePlayerStore.getState().saveLastActive();
  },

  applyBoost: () => {
    const { activeGig } = get();
    if (!activeGig) return;

    const player = usePlayerStore.getState().player;
    const skills = useSkillStore.getState().activeSkills;
    if (!player) return;

    const requiredSkill = skills.find(
      (s) => s.code === activeGig.required_skill,
    );
    if (!requiredSkill) return;
    const speed = calculateSpeedBySkillLevel(player, requiredSkill.level);
    const boostAmount = Math.max(2, speed * 2);
    const newProgress = Math.min(100, activeGig.progress + boostAmount);

    set({
      activeGig: {
        ...activeGig,
        progress: newProgress,
      },
    });
  },
  clearActiveGig: () => {
    set({
      activeGig: null,
    });
  },
}));
