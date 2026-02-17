import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constant/theme.ts";

export const StatsOverview = () => {
  return (
    <View style={styles.statsGrid}>
      <View
        style={[
          styles.statCard,
          { backgroundColor: "rgba(37, 244, 106, 0.1)" },
        ]}
      >
        <Text style={[styles.statLabel, { color: theme.colors.success }]}>
          EFFICIENCY
        </Text>
        <Text style={styles.statValue}>92%</Text>
        <View style={styles.miniProgressTrack}>
          <View
            style={[
              styles.miniProgressFill,
              { width: "92%", backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
      </View>
      <View
        style={[
          styles.statCard,
          { backgroundColor: "rgba(59, 130, 246, 0.1)" },
        ]}
      >
        <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
          STREAK
        </Text>
        <Text style={styles.statValue}>12 Days</Text>
        <Text style={styles.bonusText}>+20% Bonus Active</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: { flexDirection: "row", padding: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 16 },
  statLabel: { fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d1c12",
    marginVertical: 4,
  },
  miniProgressTrack: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 2,
  },
  miniProgressFill: { height: "100%", borderRadius: 2 },
  bonusText: { fontSize: 10, color: theme.colors.secondary, fontWeight: "600" },
});
