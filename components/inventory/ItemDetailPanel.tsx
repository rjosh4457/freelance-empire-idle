import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constant/theme.ts";

interface ItemDetailPanelProp {
  item: PlayerToolType;
}
export const ItemDetailPanel = ({ item }: ItemDetailPanelProp) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.detailsPanel,
        { marginBottom: insets.bottom + theme.spacing.md },
      ]}
    >
      <View style={styles.detailsHeader}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="keyboard"
            size={48}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              LEVEL {item.level}/{item.max_level}
            </Text>
          </View>
          <View style={styles.bonusRow}>
            <MaterialIcons name="bolt" size={16} color={theme.colors.primary} />
            <Text style={styles.bonusText}>+10% Gig Speed</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressionSection}>
        <View style={styles.progressionHeader}>
          <Text style={styles.progLabel}>PROGRESSION</Text>
          <Text style={styles.progLabel}>20%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "20%" }]} />
        </View>
        <Text style={styles.nextLevelText}>
          Next: +12% Gig Speed bonus at Level 3
        </Text>
      </View>

      <TouchableOpacity style={styles.upgradeBtn}>
        <MaterialIcons name="upgrade" size={24} color={theme.colors.black} />
        <Text style={styles.upgradeBtnText}>UPGRADE GEAR</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>$500</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsPanel: {
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.2)",
    elevation: 10,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  detailsHeader: { flexDirection: "row", gap: 16, marginBottom: 20 },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  titleGroup: { flex: 1, justifyContent: "center" },
  itemTitle: { fontSize: 18, fontWeight: "800", color: theme.colors.black },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: { fontSize: 10, fontWeight: "800", color: theme.colors.mutedV3 },
  bonusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  bonusText: { color: theme.colors.primary, fontWeight: "800", fontSize: 14 },

  progressionSection: { marginBottom: 20 },
  progressionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progLabel: { fontSize: 10, fontWeight: "800", color: theme.colors.mutedV3 },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.muted,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: theme.colors.primary },
  nextLevelText: {
    fontSize: 10,
    color: theme.colors.mutedV3,
    fontStyle: "italic",
    marginTop: 6,
  },

  upgradeBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    gap: 10,
  },
  upgradeBtnText: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.black,
  },
  priceTag: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  priceText: { fontWeight: "800", fontSize: 14 },
});
