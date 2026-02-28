import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { DeskCard } from "../../components/dashboard/cards/DeskCard.tsx";
import { DeskEmptyCard } from "../../components/dashboard/cards/DeskEmptyCard.tsx";
import { GameHeader } from "../../components/dashboard/GameHeader.tsx";
import { MilestoneList } from "../../components/dashboard/MilestoneList.tsx";
import { GigCompletedModal } from "../../components/dashboard/modal/GigCompletedModal.tsx";
import { QuickActions } from "../../components/dashboard/QuickActions.tsx";
import { theme } from "../../constant/theme.ts";
import { useGigsStore } from "../../stores/gig-store.ts";

export default function Index() {
  const {
    activeGig,
    saveGigStatus,
    clearActiveGig,
    saveGigProgress,
    stopGigEngine,
  } = useGigsStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    setShowModal(activeGig?.status === "completed");
  }, [activeGig?.status]);

  const onHandleComplete = async () => {
    await saveGigStatus("completed");
    await saveGigProgress();
    stopGigEngine();
  };
  const onHandleClaim = async () => {
    await saveGigStatus("claimed");
    await saveGigProgress();
    stopGigEngine();
    clearActiveGig();
  };

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
        <View style={{ marginTop: 20 }} />
        {/** TODO: ADD A MODAL FOR COMPLETING THE GIG */}
        {activeGig?.id ? (
          <DeskCard gig={activeGig} onComplete={onHandleComplete} />
        ) : (
          <DeskEmptyCard
            onFindGigs={() => router.replace("./(protected)/marketplace")}
          />
        )}
        {/* <OfficeStage /> */}
        <QuickActions />
        <MilestoneList />
      </ScrollView>

      <Navigation />
      {activeGig?.id && activeGig.status === "completed" && (
        <GigCompletedModal visible={showModal} onClaim={onHandleClaim} />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 120 },
});
