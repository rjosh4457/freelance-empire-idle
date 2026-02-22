import { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import {
  createAnimatedComponent,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabList } from "../../components/common/TabList.tsx";
import { InventoryHeader } from "../../components/inventory/InventoryHeader.tsx";
import { InventorySlotV2 } from "../../components/inventory/InventorySlotV2.tsx";
import { theme } from "../../constant/theme.ts";
import { useToolStore } from "../../stores/tools-store.ts";
import { TabListTypes } from "../../types/common.d.ts";
import {
  computeMaxXp,
  computeUpgradeCost,
  getScaledPerks,
} from "../../utils/config.ts";
import { getColorByLevel } from "../../utils/helper.ts";

const { width } = Dimensions.get("window");
const AnimatedView = createAnimatedComponent(View);
const COLUMN_COUNT = 4;
const GRID_GAP = 10;
const CONTAINER_PADDING = theme.spacing.md * 2;
const SLOT_SIZE =
  (width - CONTAINER_PADDING - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("all");
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const { playerTools, upgradeTool } = useToolStore();

  const categories: TabListTypes[] = [
    { id: "all", label: "All", icon: "grid-view", color: theme.colors.primary },
    { id: "office", label: "Office", icon: "chair", color: "#fbbf24" },
    { id: "hardware", label: "Hardware", icon: "devices", color: theme.colors.secondary },
    { id: "software", label: "Software", icon: "terminal", color: "#f43f5e" },
    { id: "utility", label: "Utility", icon: "build", color: "#513ff4" },
  ];

  const currentIndex = categories.findIndex((c) => c.id === activeTab);
  const isForward = currentIndex > prevIndex;

  const handleTabChange = (tabId: string) => {
    setPrevIndex(currentIndex);
    setActiveTab(tabId);
  };

  const filteredTools = useMemo(() => {
    if (activeTab === "all") return playerTools;
    return playerTools.filter(
      (tool) => tool.category.toLowerCase() === activeTab,
    );
  }, [activeTab, playerTools]);
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <InventoryHeader />
      {/* Content Wrapper */}
      <View style={styles.mainContent}>
        {/* Tabs */}
        <TabList
          tabs={categories}
          onTabChange={(tabId) => handleTabChange(tabId)}
          activeTab={activeTab}
        />

        {/* Inventory Grid - Scrollable */}
        <AnimatedView
          key={activeTab}
          entering={
            isForward ? SlideInRight.duration(250) : SlideInLeft.duration(250)
          }
          exiting={
            isForward ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)
          }
          style={{ flex: 1 }}
        >
          <FlatList
            data={filteredTools}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridScrollBody}
            renderItem={({ item }) => {
              const xp = computeMaxXp(item.base_xp, item.level);
              const upgrade_cost = computeUpgradeCost(
                item.base_upgrade_cost,
                item.level,
              );
              const isMaxed = item.level >= item.max_level;
              const level_progress = isMaxed ? 1 : item.current_xp / xp;
              const basePerks = JSON.parse(item.perks);
              const scaledPerks = getScaledPerks(basePerks, item.level);

              return (
                <View style={{ width: "100%" }}>
                  <InventorySlotV2
                    title={item.name}
                    image={item.image}
                    level={`LVL ${item.level}/${item.max_level}`}
                    perks={scaledPerks}
                    progress={level_progress}
                    nextBonus="Upgrade to increase perks"
                    price={upgrade_cost}
                    accentColor={getColorByLevel(item.level)}
                    isLocked={isMaxed}
                    onUpgrade={() => upgradeTool(item.id, upgrade_cost)}
                  />
                </View>
              );
            }}
          />
        </AnimatedView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
  mainContent: { flex: 1 }, // Takes up all space between header and bottom

  tabContainer: { padding: theme.spacing.md },
  tabWrapper: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 4,
    borderRadius: theme.borderRadius.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: { fontSize: 14, fontWeight: "700", color: theme.colors.mutedV3 },
  tabLabelActive: { color: theme.colors.black },

  gridScrollBody: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE, // Forces exact square
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.light,
    justifyContent: "center",
    alignItems: "center",
  },
  slotSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    borderWidth: 2,
  },
  slotLocked: { opacity: 0.4, borderStyle: "dashed" },
  levelBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  levelText: { fontSize: 8, fontWeight: "900", color: theme.colors.black },

  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  itemImage: { width: "100%", height: "100%" },
});
