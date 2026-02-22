import { create } from "zustand";
import { updatePlayerBalance } from "../services/player-service.ts";
import {
  fetchAllTools,
  fetchPlayerTools,
  saveBoughtItem,
  upgradeToolLevel,
} from "../services/tools-service.ts";
import { computeMaxXp, computeXpGained } from "../utils/config.ts";
import { usePlayerStore } from "./player-store.ts";

interface ToolState {
  tools: BaseToolType[];
  playerTools: PlayerToolType[];

  getAllTools: (playerPerks: string[]) => Promise<void>;
  getPlayerTools: () => Promise<void>;
  saveNewTool: (
    tool: BaseToolType,
  ) => Promise<{ success: boolean; error?: string }>;
  upgradeTool: (toolId: string, cost: number) => Promise<void>;
}

export const useToolStore = create<ToolState>((set, get) => ({
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
  getPlayerTools: async () => {
    const res = await fetchPlayerTools();
    if (!res.success && !res.data) return;

    set({
      playerTools: res.data,
    });
  },
  saveNewTool: async (tool: BaseToolType) => {
    const { tools, playerTools } = get();
    const player = usePlayerStore.getState().player;

    if (!player) return { success: false, error: "Player not found" };
    if (player.money < tool.price) {
      return { success: false, error: "Insufficient funds" };
    }

    const tempId = `temp-${Date.now()}`;
    const updatedTools = tools.map((t) =>
      t.id === tool.id ? { ...t, is_owned: 1 } : t,
    );
    const baseUpgradeCost = Math.floor(tool.price * 0.3);
    const newTool: PlayerToolType = {
      ...tool,
      id: tempId,
      tool_id: tool.id,
      base_upgrade_cost: baseUpgradeCost,
      is_equipped: false,
      acquired_at: new Date().toISOString(),
      current_xp: 0,
      level: 1,
    };

    set({
      tools: updatedTools,
      playerTools: [...playerTools, newTool],
    });

    // Try saving to DB
    const res = await saveBoughtItem(player.id, tool.id, baseUpgradeCost);

    if (res.success && res.data) {
      set((state) => ({
        playerTools: state.playerTools.map((pt) =>
          pt.id === tempId ? { ...pt, id: res.data! } : pt,
        ),
      }));
      return { success: true };
    } else {
      set({ tools, playerTools });
      return { success: false, error: res.error || "Database error" };
    }
  },
  upgradeTool: async (toolId, cost) => {
    const prevPlayerTool = get().playerTools;
    const updateMoney = usePlayerStore.getState().updateMoney;
    const player = usePlayerStore.getState().player;

    const toolToUpgrade = prevPlayerTool.find((tool) => tool.id === toolId);
    if (!toolToUpgrade || !player) return;
    if (player.money < cost) {
      console.error("Insufficient funds for upgrade");
      return;
    }
    /** Update Player Money, Local Only */
    const newBalance = player.money - cost;
    updateMoney(newBalance);

    let newLevel = toolToUpgrade.level;
    let newXp =
      (toolToUpgrade.current_xp || 0) + computeXpGained(toolToUpgrade.level, 1);

    while (true) {
      const maxXpForCurrentLevel = computeMaxXp(
        toolToUpgrade.base_xp,
        newLevel,
      );

      if (newXp >= maxXpForCurrentLevel) {
        newXp -= maxXpForCurrentLevel;
        newLevel += 1;
      } else {
        break;
      }
    }

    set((state) => ({
      playerTools: state.playerTools.map((tool) =>
        tool.id === toolId
          ? { ...tool, level: newLevel, current_xp: newXp }
          : tool,
      ),
    }));

    try {
      const [upgradeRes, moneyRes] = await Promise.all([
        upgradeToolLevel(toolId, newLevel, newXp),
        updatePlayerBalance(player.id, newBalance),
      ]);

      if (!upgradeRes.success || !moneyRes.success) {
        throw new Error(
          upgradeRes.error || moneyRes.error || "Failed to upgrade tool",
        );
      }
    } catch (error) {
      // ROLLBACK: If DB fails, revert to the old state
      console.error("Failed to persist tool upgrade:", error);
      set({ playerTools: prevPlayerTool });
      updateMoney(player.money);
    }
  },
}));
