import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { ActiveSkillType } from "../../types/skills.d.ts";
import { StudyingSkillCard } from "./cards/StudyingSkillCard.tsx";

interface StudyingSkillsProps {
  skills: ActiveSkillType[];
}
export const StudyingSkills = ({ skills }: StudyingSkillsProps) => {
  const player = usePlayerStore().player;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>In Progress</Text>
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedBadgeText}>{skills.length} SKILLS</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {player &&
          skills.map((skill) => {
            return (
              <StudyingSkillCard
                key={skill.id}
                icon={skill.icon}
                title={skill.name}
                color={skill.color}
                startedAt={skill.learn_start_time}
                finishAt={skill.learn_end_time}
              />
            );
          })}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    padding: 16,
    marginTop: 50,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#0d1c12" },
  unlockedBadge: {
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
});
