import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  createAnimatedComponent,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Navigation } from "../../components/common/Navigation.tsx";
import { TabList } from "../../components/common/TabList.tsx";
import { ActiveSkills } from "../../components/skills/ActiveSkills.tsx";
import { AllSkills } from "../../components/skills/AllSkills.tsx";
import { CurrencyBar } from "../../components/skills/CurrencyBar.tsx";
import { EmptySkillData } from "../../components/skills/EmptySkillData.tsx";
import { StudyingSkills } from "../../components/skills/StudyingSkills.tsx";
import { theme } from "../../constant/theme.ts";
import { useSkillStore } from "../../stores/skills-store.ts";
import { TabListTypes } from "../../types/common.d.ts";

const AnimatedView = createAnimatedComponent(View);

export default function Skills() {
  const { activeSkills, allSkills, studyingSkills } = useSkillStore();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [prevIndex, setPrevIndex] = useState<number>(0);

  const categories: TabListTypes[] = [
    { id: "active", label: "Active Skills", icon: "school", color: "#fbbf24" },
    {
      id: "studying",
      label: "Studying Skills",
      icon: "menu-book",
      color: theme.colors.secondary,
    },
    {
      id: "all",
      label: "Buy Skills",
      icon: "storefront",
      color: theme.colors.primary,
    },
  ];

  const currentIndex = categories.findIndex((c) => c.id === activeTab);
  const isForward = currentIndex > prevIndex;

  const handleTabChange = (tabId: string) => {
    setPrevIndex(currentIndex);
    setActiveTab(tabId);
  };

  const config = useMemo(() => {
    switch (activeTab) {
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
  }, [activeTab, activeSkills, allSkills, studyingSkills]);

  const isEmpty = config.data.length === 0;

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <CurrencyBar />

      <TabList
        tabs={categories}
        onTabChange={(tab) => handleTabChange(tab)}
        activeTab={activeTab}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollBody,
          isEmpty && styles.centerEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView
          key={activeTab}
          entering={
            isForward ? SlideInRight.duration(250) : SlideInLeft.duration(250)
          }
          exiting={
            isForward ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)
          }
          style={{ flex: 1 }}
        >
          {isEmpty ? (
            <EmptySkillData
              description={config.emptyDesc}
              onCTAPress={() => handleTabChange("all")}
            />
          ) : (
            <config.Component skills={config.data as any} />
          )}
        </AnimatedView>
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
    flexGrow: 1,
  },
  centerEmpty: {
    justifyContent: "center",
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  tabTrack: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
  },
});
