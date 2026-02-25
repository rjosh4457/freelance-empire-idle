import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../constant/theme.ts";

interface GigCardProps {
  title: string;
  difficulty: string;
  rating: number;
  reward: string;
  xp: string;
  requirement: string;
  accentColor?: string;
  opacity?: number;
}

export const GigCard = ({
  title,
  difficulty,
  rating,
  reward,
  xp,
  requirement,
  accentColor = theme.colors.primary,
  opacity = 1,
}: GigCardProps) => {
  return (
    <View
      style={[styles.card, { borderBottomColor: `${accentColor}4D`, opacity }]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <MaterialIcons
                key={s}
                name="star"
                size={14}
                color={s <= rating ? "#fbbf24" : "#e2e8f0"}
              />
            ))}
          </View>
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${accentColor}1A` },
          ]}
        >
          <Text style={[styles.categoryText, { color: accentColor }]}>
            {difficulty}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconBox}>
            <MaterialIcons
              name="payments"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View>
            <Text style={styles.statLabel}>REWARD</Text>
            <Text style={styles.rewardValue}>{reward}</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: "rgba(59, 130, 246, 0.1)" },
            ]}
          >
            <MaterialIcons name="trending-up" size={20} color="#3b82f6" />
          </View>
          <View>
            <Text style={styles.statLabel}>REP GAIN</Text>
            <Text style={styles.xpValue}>{xp}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.reqRow}>
          <MaterialIcons name="verified" size={14} color="#fbbf24" />
          <Text style={styles.reqText}>
            Req: <Text style={{ fontWeight: "800" }}>{requirement}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.acceptBtnText}>ACCEPT GIG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    borderBottomWidth: 4,
    marginBottom: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0d1c12" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    marginLeft: 6,
  },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  statsGrid: { flexDirection: "row", marginVertical: 16, gap: 20 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  statIconBox: {
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    padding: 8,
    borderRadius: 8,
  },
  statLabel: { fontSize: 9, fontWeight: "800", color: "#94a3b8" },
  rewardValue: { fontSize: 16, fontWeight: "800", color: theme.colors.primary },
  xpValue: { fontSize: 16, fontWeight: "800", color: "#3b82f6" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundLight,
    padding: 10,
    borderRadius: 8,
  },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  reqText: { fontSize: 11, color: "#1e293b" },
  acceptBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  acceptBtnText: { fontSize: 12, fontWeight: "900", color: "#0d1c12" },
});
