import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { LoadingIndicator } from "../components/common/LoadingIndicator.tsx";
import SkillPurchaseModal from "../components/modals/SkillPurchaseModal.tsx";
import { initDatabase } from "../services/init.ts";
import { createDailyMilestones } from "../services/milestone-service.ts";
import { updatePlayerBalance } from "../services/player-service.ts";
import { useMilestoneStore } from "../stores/milestone-store.ts";
import { useGlobalModal } from "../stores/modal-store.ts";
import { usePlayerStore } from "../stores/player-store.ts";
import { useSkillStore } from "../stores/skills-store.ts";
import { useToolStore } from "../stores/tools-store.ts";
import { useClientStore } from "../stores/client-store.ts";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();
  const { isOpen, skill, closeModal } = useGlobalModal();
  const { updateMoney } = usePlayerStore();
  const { buySkill } = useSkillStore();
  const getPlayerSkills = useSkillStore((state) => state.getPlayerSkills);
  const getAllSkills = useSkillStore((state) => state.getAllSkills);
  const getPlayer = usePlayerStore((state) => state.getPlayer);
  const getMilestones = useMilestoneStore((state) => state.getMilestones);
  const player = usePlayerStore((state) => state.player);
  const { getAllTools, getPlayerTools } = useToolStore();
  const { getAllClients } = useClientStore();
  useEffect(() => {
    async function setup() {
      try {
        // Init the DB file
        await initDatabase();
        await getPlayer();

        if (!player) return;
        await createDailyMilestones(player.id);
        // IMMEDIATELY fetch the data into the store
        // This puts the data back into the memory after a soft refresh
        await Promise.all([
          getMilestones(),
          getPlayerSkills(),
          getAllTools([]),
          getPlayerTools(),
          getAllClients(),
        ]);
        await getAllSkills();
      } catch (error) {
        console.error("Setup failed", error);
      } finally {
        setAppReady(true);
      }
    }
    setup();
  }, [player?.id]);

  useEffect(() => {
    if (!appReady) return;
    if (!player) {
      router.replace("/onboarding");
    } else {
      router.replace("./(tabs)");
    }
  }, [player?.id]);

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
