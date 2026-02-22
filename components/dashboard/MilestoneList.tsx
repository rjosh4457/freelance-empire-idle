import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { useMilestoneStore } from "../../stores/milestone-store.ts";
import { MilestoneCard } from "./cards/MilestoneCard.tsx";

export const MilestoneList = () => {
  const { milestones } = useMilestoneStore();
  console.log(milestones);

  return (
    <View style={styles.milestoneSection}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Daily Milestones</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeCountText}>2/5 DONE</Text>
        </View>
      </View>

      <View style={styles.milestoneList}>
        {milestones?.map((ms) => (
          <MilestoneCard
            key={ms.id}
            icon={ms.icon}
            title={ms.name}
            sub={ms.description}
            color={ms.color}
            canClaim
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  milestoneSection: { paddingHorizontal: 16 },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0d1c12" },
  badgeCount: {
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  milestoneList: { gap: 12 },
});
