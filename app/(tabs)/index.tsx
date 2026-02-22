import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { DeskEmptyCard } from "../../components/dashboard/cards/DeskEmptyCard.tsx";
import { GameHeader } from "../../components/dashboard/GameHeader.tsx";
import { MilestoneList } from "../../components/dashboard/MilestoneList.tsx";
import { QuickActions } from "../../components/dashboard/QuickActions.tsx";
import { StatsOverview } from "../../components/dashboard/StatsOverview.tsx";
import { theme } from "../../constant/theme.ts";

export default function Index() {
  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.container,
        { backgroundColor: theme.colors.backgroundLight },
      ]}
    >
      <GameHeader />
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <StatsOverview />
        <DeskEmptyCard
          onFindGigs={() => router.replace("./(protected)/marketplace")}
        />
        {/* <OfficeStage /> */}
        <QuickActions />
        <MilestoneList />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 120 },
});
