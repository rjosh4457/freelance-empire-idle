import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react"; // Added for tab logic
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  createAnimatedComponent,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";
import { TabList } from "../../components/common/TabList.tsx";
import ToolPurchaseModal from "../../components/modals/ToolPurchaseModal.tsx";
import { ShopItemCard } from "../../components/shops/cards/ShopItemCard.tsx";
import { theme } from "../../constant/theme.ts";
import { updatePlayerBalance } from "../../services/player-service.ts";
import { useGlobalModal } from "../../stores/modal-store.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { useToolStore } from "../../stores/tools-store.ts";
import { TabListTypes } from "../../types/common.d.ts";
import { formatCurrency, getRandomColor } from "../../utils/helper.ts";

const { width } = Dimensions.get("window");
const AnimatedView = createAnimatedComponent(View);
export default function Shops() {
  const { player, updateMoney } = usePlayerStore();
  const { tools, saveNewTool } = useToolStore();
  const [activeTab, setActiveTab] = useState("all");
  const [prevIndex, setPrevIndex] = useState(0);
  const { isOpen, tool, closeModal } = useGlobalModal();
  const openModal = useGlobalModal((state) => state.openBuyTool);
  const categories: TabListTypes[] = [
    { id: "all", label: "All", icon: "grid-view", color: theme.colors.primary },
    { id: "office", label: "Office", icon: "chair", color: "#fbbf24" },
    {
      id: "hardware",
      label: "Hardware",
      icon: "devices",
      color: theme.colors.secondary,
    },
    { id: "software", label: "Software", icon: "terminal", color: "#f43f5e" },
    { id: "utility", label: "Utility", icon: "build", color: "#513ff4" },
  ];

  const currentIndex = categories.findIndex((c) => c.id === activeTab);
  const isForward = currentIndex > prevIndex;

  const handleTabChange = (tabId: string) => {
    setPrevIndex(currentIndex);
    setActiveTab(tabId);
  };
  const handleBuyItem = async () => {
    if (!tool || !player) return;

    const cost = tool.price;
    const newBalance = player.money - cost;
    const res = await saveNewTool(tool);

    if (res.success) {
      const moneyRes = await updatePlayerBalance(player.id, newBalance);
      if (moneyRes.success) {
        updateMoney(newBalance);
        closeModal();
      } else {
        console.log("Error saving transaction. Money not deducted.");
      }
    } else {
      console.log("Error purchasing tool:", res.error);
    }
  };
  const filteredTools = useMemo(() => {
    if (activeTab === "all") return tools;
    return tools.filter((tool) => tool.category.toLowerCase() === activeTab);
  }, [activeTab, tools]);

  return (
    <View style={screenStyles.container}>
      {/* Header */}
      <View style={screenStyles.header}>
        <View>
          <Text style={screenStyles.headerTitle}>Mall</Text>
          <Text style={screenStyles.headerSub}>FREELANCE EMPIRE</Text>
        </View>
        <View style={screenStyles.balanceBadge}>
          <MaterialIcons
            name="payments"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={screenStyles.balanceText}>
            ${formatCurrency(player?.money ?? 0)}
          </Text>
        </View>
      </View>

      <TabList
        tabs={categories}
        onTabChange={(tabId) => handleTabChange(tabId)}
        activeTab={activeTab}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedView
          key={activeTab}
          entering={
            isForward ? SlideInRight.duration(250) : SlideInLeft.duration(250)
          }
          style={screenStyles.gridContainer}
        >
          <View style={screenStyles.gridContainer}>
            <View style={screenStyles.grid}>
              {filteredTools.map((item) => (
                <View key={item.id} style={screenStyles.gridItem}>
                  <ShopItemCard
                    {...item}
                    isOwned={Boolean(item.is_owned)}
                    color={getRandomColor()}
                    onBuy={() => openModal(item)}
                  />
                </View>
              ))}
            </View>
          </View>
        </AnimatedView>
      </ScrollView>
      {tool && (
        <ToolPurchaseModal
          isVisible={isOpen}
          toolName={tool.name}
          price={tool.price}
          image={tool.image}
          onConfirm={handleBuyItem}
          onCancel={closeModal}
        />
      )}
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  headerSub: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  balanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  balanceText: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

  // Tab Styles
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primary,

    borderColor: theme.colors.primary,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  tabTextActive: { color: theme.colors.black },

  gridContainer: { paddingHorizontal: 8, paddingBottom: 50 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1e293b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: (width - 40) / 2,
    marginBottom: 8,
  },
});
