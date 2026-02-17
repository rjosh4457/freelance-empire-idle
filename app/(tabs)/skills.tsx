import { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { ActiveSkills } from "../../components/skills/ActiveSkills.tsx";
import { UnlockableSkills } from "../../components/skills/AllSkills.tsx";
import { CurrencyBar } from "../../components/skills/CurrencyBar.tsx";
import { TabButtons } from "../../components/skills/TabButtons.tsx";
import { theme } from "../../constant/theme.ts";
import { useSkillStore } from "../../stores/skills-store.ts";

const { width } = Dimensions.get("window");

export default function Skills() {
  const [currentTab, setCurrentTab] = useState<"active" | "all">("active");
  const { activeSkills, schoolSkills } = useSkillStore();

  const buyableSkills = useMemo(() => {
    return schoolSkills.filter(
      (skill) => !activeSkills.some((active) => active.id === skill.id),
    );
  }, [schoolSkills, activeSkills]);

  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.container,
        { backgroundColor: theme.colors.backgroundLight },
      ]}
    >
      <CurrencyBar />
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContainer}>
          <View style={styles.tabTrack}>
            <TabButtons
              tabId="active"
              label="Active Skills"
              onSelectTab={() => setCurrentTab("active")}
              currentTab={currentTab}
            />
            <TabButtons
              tabId="all"
              label="Buy Skills"
              onSelectTab={() => setCurrentTab("all")}
              currentTab={currentTab}
            />
          </View>
        </View>

        {currentTab === "all" ? (
          <UnlockableSkills skills={buyableSkills} />
        ) : (
          <ActiveSkills skills={activeSkills} />
        )}
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollBody: { paddingBottom: 100 },
  tabContainer: { padding: 16, paddingTop: 20 },
  tabTrack: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
  },

  lockedCard: {
    width: (width - 36) / 2,
    height: 220,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(241, 245, 249, 0.5)",
  },
  lockIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "bold",
    textAlign: "center",
  },

  navItem: { flex: 1, justifyContent: "center", alignItems: "center", gap: 4 },
  navLabel: { fontSize: 11, fontWeight: "500", color: "#499c65" },
  activeNavLabel: { fontWeight: "bold", color: theme.colors.primary },
});
