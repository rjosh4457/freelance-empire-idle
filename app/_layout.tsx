import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { LoadingIndicator } from "../components/common/LoadingIndicator.tsx";
import SkillPurchaseModal from "../components/modals/SkillPurchaseModal.tsx";
import { initDatabase } from "../services/init.ts";
import { createDailyMilestones } from "../services/milestone-service.ts";
import { updatePlayerBalance } from "../services/player-service.ts";
import { useClientStore } from "../stores/client-store.ts";
import { useGigsStore } from "../stores/gig-store.ts";
import { useMilestoneStore } from "../stores/milestone-store.ts";
import { useGlobalModal } from "../stores/modal-store.ts";
import { usePlayerStore } from "../stores/player-store.ts";
import { useSkillStore } from "../stores/skills-store.ts";
import { useToolStore } from "../stores/tools-store.ts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const { isOpen, skill, closeModal } = useGlobalModal();
  const { updateMoney } = usePlayerStore();
  const { buySkill } = useSkillStore();
  const getPlayerSkills = useSkillStore((state) => state.getPlayerSkills);
  const getAllSkills = useSkillStore((state) => state.getAllSkills);
  const getPlayer = usePlayerStore((state) => state.getPlayer);
  const getMilestones = useMilestoneStore((state) => state.getMilestones);
  const player = usePlayerStore((state) => state.player);
  const { saveLastActive } = usePlayerStore();
  const { getAllTools, getPlayerTools } = useToolStore();
  const { getAllClients } = useClientStore();
  const {
    getCurrentActiveGig,
    startGigEngine,
    stopGigEngine,
    applyOfflineProgress,
    activeGig,
  } = useGigsStore();
  const { activeSkills } = useSkillStore();

  const [dbReady, setDbReady] = useState(false);

  // DB Init (run once)
  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (error) {
        console.error("DB init failed", error);
        setAppReady(true);
      }
    }

    init();
  }, []);

  // Game data load (after DB ready)
  useEffect(() => {
    if (!dbReady) return;

    async function loadGame() {
      try {
        const playerRes = await getPlayer();
        if (!playerRes.success) {
          setAppReady(true);
          return;
        }
        const storedPlayer = usePlayerStore.getState().player;
        if (!storedPlayer) {
          setAppReady(true);
          return;
        }

        const playerSkillRes = await getPlayerSkills();
        if (!playerSkillRes.success) return;

        await createDailyMilestones(storedPlayer.id);
        await Promise.all([
          getCurrentActiveGig(),
          getMilestones(),
          getAllTools([]),
          getPlayerTools(),
          getAllClients(),
        ]);

        await getAllSkills();

        setAppReady(true);
      } catch (error) {
        console.error("Boot failed", error);
        setAppReady(true);
      }
    }

    loadGame();
  }, [dbReady]);

  //BUG 1: Offline Progress should not be applied to the newly accepted gig.
  //Issue: when accepting new gig. the last active that is save in state is being used.
  //since we called the applyOfflineProgress() every time active gig id changes
  //FIX: Do some conditional approach when applying offline progress

  //BUG 2: When gig status is completed, progress should stop

  // Gig engine lifecycle
  useEffect(() => {
    if (!activeGig) return;
    applyOfflineProgress();
    startGigEngine();
  }, [activeGig?.id]);

  // AppState lifecycle
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        saveLastActive();
        stopGigEngine();

        if (useGigsStore.getState().activeGig) {
          useGigsStore.getState().saveGigProgress();
        }
      }

      if (state === "active") {
        useGigsStore.getState().applyOfflineProgress();
        useGigsStore.getState().startGigEngine();
      }
    });

    return () => subscription.remove();
  }, []);

  if (!appReady) return <LoadingIndicator />;

  const handleBuySkill = async () => {
    if (!skill || !player) return;

    const newBalance = player.money - skill.price;

    const skillRes = await buySkill(skill);
    if (skillRes.success) {
      const moneyRes = await updatePlayerBalance(player.id, newBalance);

      if (moneyRes.success) {
        updateMoney(newBalance);
        closeModal();
      } else {
        console.log("Error saving transaction. Money not deducted.");
      }
    } else {
      console.log("Purchase failed.", skillRes.error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!player}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(protected)" />
        </Stack.Protected>
        <Stack.Screen name="onboarding" />
      </Stack>

      {/* GLOBAL MODAL LAYER */}
      {skill && (
        <SkillPurchaseModal
          isVisible={isOpen}
          skillName={skill.name}
          price={skill.price}
          icon={skill.icon}
          color={skill.color}
          onConfirm={handleBuySkill}
          onCancel={closeModal}
        />
      )}
    </View>
  );
}
