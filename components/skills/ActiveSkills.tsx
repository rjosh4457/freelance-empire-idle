import { StyleSheet, Text, View } from "react-native";
import { usePlayerStore } from "../../stores/player-store.ts";
import { useSkillStore } from "../../stores/skills-store.ts";
import { ActiveSkillType } from "../../types/skills.d.ts";
import { computeMaxXp, computeUpgradeCost } from "../../utils/config.ts";
import { ActiveSkillCards } from "./cards/ActiveSkillCards.tsx";

interface ActiveSkillProps {
  skills: ActiveSkillType[];
}
export const ActiveSkills = ({ skills }: ActiveSkillProps) => {
  const player = usePlayerStore().player;
  const upgradeSkill = useSkillStore().upgradeSkill;
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Expertise</Text>
      </View>

      <View style={styles.grid}>
        {player &&
          skills.map((skill) => {
            const xp = computeMaxXp(skill.base_xp, skill.level);
            const level_progress = skill.current_xp / xp;
            const can_upgrade = player.money < skill.base_upgrade_cost;
            const upgrade_cost = computeUpgradeCost(
              skill.base_upgrade_cost,
              skill.level,
            );
            return (
              <ActiveSkillCards
                key={skill.id}
                icon={skill.icon}
                title={skill.name}
                level={skill.level}
                sub={skill.description}
                color={skill.color}
                progress={level_progress}
                disabled={can_upgrade}
                price={String(upgrade_cost)}
                onUpgrade={() => upgradeSkill(skill.id, 50)}
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d1c12",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
});
