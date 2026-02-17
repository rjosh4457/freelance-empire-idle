import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { Header } from "../../components/dashboard/Header.tsx";
import { MilestoneList } from "../../components/dashboard/MilestoneList.tsx";
import { OfficeStage } from "../../components/dashboard/OfficeStage.tsx";
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
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <StatsOverview />
        <OfficeStage />
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
