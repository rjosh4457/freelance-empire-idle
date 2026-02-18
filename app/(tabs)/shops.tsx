import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react"; // Added for tab logic
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ShopItemCard } from "../../components/shops/cards/ShopItemCard.tsx";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { useToolStore } from "../../stores/tools-store.ts";
import {
  formatCurrency,
  getRandomColor
} from "../../utils/helper.ts";

const { width } = Dimensions.get("window");

export default function Shops() {
  const { player } = usePlayerStore();
  const { tools } = useToolStore();
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    { id: "all", label: "All", icon: "grid-view", color: theme.colors.primary },
    { id: "furniture", label: "Furniture", icon: "chair", color: "#fbbf24" },
    { id: "tech", label: "Tech", icon: "devices", color: "#3b82f6" },
    { id: "decor", label: "Decor", icon: "palette", color: "#f43f5e" },
  ];

  return (
    <View style={screenStyles.container}>
      {/* Header */}
      <View style={screenStyles.header}>
        <View>
          <Text style={screenStyles.headerTitle}>SM Galleria</Text>
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

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={screenStyles.tabContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveTab(cat.label)}
              style={[
                screenStyles.tabButton,
                activeTab === cat.label && screenStyles.tabButtonActive,
              ]}
            >
              <MaterialIcons
                name={cat.icon as any}
                size={20}
                color={activeTab === cat.label ? "#0d1c12" : cat.color}
              />
              <Text
                style={[
                  screenStyles.tabText,
                  activeTab === cat.label && screenStyles.tabTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={screenStyles.gridContainer}>
          <View style={screenStyles.grid}>
            {tools.map((item) => (
              <View key={item.id} style={screenStyles.gridItem}>
                <ShopItemCard
                  {...item}
                  color={getRandomColor()}
                  onBuy={() => console.log("buy", item.name)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f8f6" },
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
  tabTextActive: { color: "#0d1c12" },

  gridContainer: { paddingHorizontal: 16, paddingBottom: 100 },
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
