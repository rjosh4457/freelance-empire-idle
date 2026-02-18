import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { formatCurrency } from "../../utils/helper.ts";

export const Header = () => {
  const insets = useSafeAreaInsets();
  const player = usePlayerStore().player;
  return (
    <View style={[styles.headerArea, { paddingTop: insets.top }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.moneyIconBox}>
            <MaterialIcons
              name="payments"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.balanceText}>
            ${formatCurrency(player?.money ?? 0)}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>
            LVL{player?.level} {player?.company_name}
          </Text>
        </View>
      </View>

      <View style={styles.headerBottom}>
        <View style={styles.passiveRow}>
          <View style={styles.liveIndicator} />
          <Text style={styles.passiveLabel}>PASSIVE INCOME</Text>
        </View>
        <Text style={styles.incomeRate}>+$15.50/sec</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  moneyIconBox: {
    backgroundColor: "rgba(37, 244, 106, 0.15)",
    padding: 6,
    borderRadius: 8,
  },
  balanceText: { fontSize: 20, fontWeight: "bold", color: "#0d1c12" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: { fontSize: 13, fontWeight: "bold", color: "#0d1c12" },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  passiveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  passiveLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    letterSpacing: 1,
  },
  incomeRate: { fontSize: 14, fontWeight: "bold", color: theme.colors.primary },
});
