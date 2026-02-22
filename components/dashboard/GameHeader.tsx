import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { formatCurrency, getPercentage } from "../../utils/helper.ts";

export const GameHeader = () => {
  const { player } = usePlayerStore();
  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Balance and Rating */}
      <View style={styles.topRow}>
        <View style={styles.balanceGroup}>
          <View style={styles.iconBadge}>
            <MaterialIcons
              name="payments"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.balanceText}>
            ${formatCurrency(player?.money ?? 0)}
          </Text>
        </View>

        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>{player?.reputation}</Text>
        </View>
      </View>

      {/* Middle Row: Passive Income Status */}
      <View style={styles.incomeRow}>
        <View style={styles.statusGroup}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusLabel}>PASSIVE INCOME</Text>
        </View>
        <Text style={styles.incomeText}>+$15.50/sec</Text>
      </View>

      {/* Bottom Row: Energy and Stress Bars */}
      <View style={styles.statsGrid}>
        {/* Energy Bar */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={styles.statLabelGroup}>
              <MaterialIcons
                name="bolt"
                size={12}
                color={theme.colors.danger}
              />
              <Text style={styles.statLabel}>ENERGY</Text>
            </View>
            <Text style={styles.statValue}>
              {player?.energy}/{player?.max_energy}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: "#fbbf24", width: "84%" },
              ]}
            />
          </View>
        </View>

        {/* Stress Bar */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={styles.statLabelGroup}>
              <MaterialIcons
                name="psychology"
                size={12}
                color={theme.colors.secondary}
              />
              <Text style={styles.statLabel}>STRESS</Text>
            </View>
            <Text style={styles.statValue}>
              {getPercentage(player?.stress ?? 0, player?.max_stress ?? 100)}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: theme.colors.secondary, width: "12%" },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop:
      Platform.OS === "ios"
        ? 50
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + 10
          : 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(37, 244, 106, 0.1)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBadge: {
    backgroundColor: "rgba(37, 244, 106, 0.2)",
    padding: 6,
    borderRadius: 8,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0d1c12",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0d1c12",
  },
  incomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(37, 244, 106, 0.8)",
    letterSpacing: 0.5,
  },
  incomeText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
  },
  statValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 99,
  },
});
