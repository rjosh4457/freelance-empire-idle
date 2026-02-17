import { StyleSheet, Text, View } from "react-native";
import { usePlayerStore } from "../../stores/player-store.ts";
import { ActiveSkillType } from "../../types/skills.d.ts";
import { computeMaxXp } from "../../utils/helper.ts";
import { ActiveSkillCards } from "./ActiveSkillCards.tsx";

interface ActiveSkillProps {
  skills: ActiveSkillType[];
}
export const ActiveSkills = ({ skills }: ActiveSkillProps) => {
  const player = usePlayerStore().player;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Expertise</Text>
      </View>
      <View style={styles.grid}>
        {player &&
          skills?.map((skill) => {
            const xp = computeMaxXp(skill.base_xp, skill.level);
            const level_progress = skill.current_xp / xp;
            
            return (
              <ActiveSkillCards
                key={skill.id}
                icon={skill.icon}
                title={skill.name}
                level={skill.level}
                sub={skill.description}
                color={skill.color}
                progress={level_progress}
                price="2445"
              />
            );
          })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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

  grid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 12 },
});
