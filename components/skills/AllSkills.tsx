import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { useGlobalModal } from "../../stores/modal-store.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { BaseSkillType } from "../../types/skills.d.ts";
import { AllSkillCard } from "./cards/AllSkillCard.tsx";
interface AllSkillsProps {
  skills: BaseSkillType[];
}
export const AllSkills = ({ skills }: AllSkillsProps) => {
  const player = usePlayerStore().player;
  const openModal = useGlobalModal((state) => state.openBuySkill);

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Core Expertise</Text>
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedBadgeText}>{skills.length} TOTAL</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {player &&
          skills?.map((skill) => {
            const isBuyable = skill.unlock_at <= player.level;
            return (
              <AllSkillCard
                key={skill.id}
                icon={skill.icon}
                title={skill.name}
                sub={skill.description}
                price={skill.price}
                unlock_at={skill.unlock_at}
                color={skill.color}
                isBuyable={isBuyable}
                onPurchased={() => openModal(skill)}
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
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 12 },
});
