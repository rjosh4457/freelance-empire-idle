import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { ActiveSkills } from "../../components/skills/ActiveSkills.tsx";
import { AllSkills } from "../../components/skills/AllSkills.tsx";
import { CurrencyBar } from "../../components/skills/CurrencyBar.tsx";
import { EmptySkillData } from "../../components/skills/EmptySkillData.tsx";
import { StudyingSkills } from "../../components/skills/StudyingSkills.tsx";
import { TabButtons } from "../../components/skills/TabButtons.tsx";
import { theme } from "../../constant/theme.ts";
import { useSkillStore } from "../../stores/skills-store.ts";

type TabType = "active" | "studying" | "all";

export default function Skills() {
  const [currentTab, setCurrentTab] = useState<TabType>("active");
  const { activeSkills, allSkills, studyingSkills } = useSkillStore();

  const config = useMemo(() => {
    switch (currentTab) {
      case "all":
        return {
          data: allSkills,
          Component: AllSkills,
          emptyDesc:
            "Visit the skill shop to purchase your first skill and start your empire.",
        };
      case "studying":
        return {
          data: studyingSkills,
          Component: StudyingSkills,
          emptyDesc:
            "You aren't currently studying anything. Go buy a skill to start learning!",
        };
      default:
        return {
          data: activeSkills,
          Component: ActiveSkills,
          emptyDesc:
            "You haven't mastered any expertise yet. Head to the shop to begin.",
        };
    }
  }, [currentTab, activeSkills, allSkills, studyingSkills]);

  const isEmpty = config.data.length === 0;

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <CurrencyBar />

      <View style={styles.tabContainer}>
        <View style={styles.tabTrack}>
          {(["active", "studying", "all"] as TabType[]).map((tab) => (
            <TabButtons
              key={tab}
              tabId={tab}
              label={
                tab === "all"
                  ? "Buy Skills"
                  : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Skills`
              }
              onSelectTab={() => setCurrentTab(tab)}
              currentTab={currentTab}
            />
          ))}
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollBody,
          isEmpty && styles.centerEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <EmptySkillData
            description={config.emptyDesc}
            onCTAPress={() => setCurrentTab("all")}
          />
        ) : (
          <config.Component skills={config.data as any} />
        )}
      </KeyboardAwareScrollView>

      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollBody: {
    paddingBottom: 100,
    flexGrow: 1, // Crucial for vertical centering
  },
  centerEmpty: {
    justifyContent: "center", // Vertically centers EmptySkillData
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  tabTrack: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    padding: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
  },
});
