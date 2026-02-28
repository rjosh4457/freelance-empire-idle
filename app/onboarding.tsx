import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Internal Imports
import { router } from "expo-router";
import { PrimaryButton } from "../components/common/PrimaryButton.tsx";
import { PrimaryInput } from "../components/common/PrimaryInput.tsx";
import { theme } from "../constant/theme.ts";
import { createDailyMilestones } from "../services/milestone-service.ts";
import { createProfile } from "../services/player-service.ts";
import { useClientStore } from "../stores/client-store.ts";
import { useGigsStore } from "../stores/gig-store.ts";
import { useMilestoneStore } from "../stores/milestone-store.ts";
import { usePlayerStore } from "../stores/player-store.ts";
import { useSkillStore } from "../stores/skills-store.ts";
import { useToolStore } from "../stores/tools-store.ts";

export default function Onboarding() {
  const [studioName, setStudioName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const { setPlayer } = usePlayerStore();
  const { getCurrentActiveGig } = useGigsStore();
  const { getMilestones } = useMilestoneStore();
  const { getPlayerSkills, getAllSkills } = useSkillStore();
  const { getAllTools, getPlayerTools } = useToolStore();
  const { getAllClients } = useClientStore();

  useEffect(() => {
    const pulse = () => {
      pulseAnim.setValue(0);
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [pulseAnim]);

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.4, 0],
    }),
  };

  const handleLaunch = async () => {
    if (studioName.trim().length < 3) {
      Alert.alert(
        "Invalid Name",
        "Your empire needs a longer name (min 3 chars)!",
      );
      return;
    }

    setIsSubmitting(true);

    const response = await createProfile({ company_name: studioName });

    if (response.success && response.data) {
      setPlayer(response.data);

      await createDailyMilestones(response.data.id);
      await Promise.all([
        getCurrentActiveGig(),
        getMilestones(),
        getPlayerSkills(),
        getAllTools([]),
        getPlayerTools(),
        getAllClients(),
      ]);

      await getAllSkills();

      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", response.error || "Failed to create profile.");
    }

    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgWrapper} pointerEvents="none">
        <View style={styles.bgHeader}>
          <View style={styles.bgAvatar} />
          <View
            style={[
              styles.bgAvatar,
              { width: 60, height: 10, borderRadius: 4 },
            ]}
          />
        </View>
        <View style={styles.bgStatsRow}>
          <View style={styles.bgCard} />
          <View style={styles.bgCard} />
        </View>
      </View>

      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <MaterialIcons
                name="rocket-launch"
                size={42}
                color={theme.colors.success}
              />
            </View>

            <Text style={styles.modalTitle}>Name Your Empire!</Text>
            <Text style={styles.modalSub}>
              Every great journey begins with a name. What should we call your
              freelance studio?
            </Text>

            <PrimaryInput
              label="STUDIO BRAND NAME"
              placeholder="e.g. Pixel Forge, Cyber Solutions..."
              value={studioName}
              onChangeText={setStudioName}
            />

            <View style={{ width: "100%", marginTop: 10 }}>
              <PrimaryButton
                title={isSubmitting ? "INITIALIZING..." : "LAUNCH EMPIRE"}
                onPress={handleLaunch}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
  bgWrapper: { flex: 1, opacity: 0.3 },
  bgHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    marginTop: 40,
  },
  bgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  bgStatsRow: { flexDirection: "row", gap: 15, padding: 24 },
  bgCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  pulseRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success,
  },
  modalTitle: {
    color: "#18181b",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSub: {
    color: "#71717a",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
  },
});
