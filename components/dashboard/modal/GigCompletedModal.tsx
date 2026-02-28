import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { theme } from "../../../constant/theme.ts";

interface GigCompletedProps {
  visible: boolean;
  onClaim: () => void;
}

export const GigCompletedModal = ({ visible, onClaim }: GigCompletedProps) => {
  // --- Animation Refs ---
  const scaleAnim = useRef(new Animated.Value(0)).current; // Trophy Pop
  const rewardsAnim = useRef(new Animated.Value(30)).current; // Rewards Slide
  const opacityAnim = useRef(new Animated.Value(0)).current; // Rewards Fade
  const pulseAnim = useRef(new Animated.Value(1)).current; // Button Pulse

  useEffect(() => {
    if (visible) {
      // 1. Reset values
      scaleAnim.setValue(0);
      rewardsAnim.setValue(30);
      opacityAnim.setValue(0);

      // 2. Entrance Sequence
      Animated.sequence([
        // Trophy Springs Up
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        // Rewards slide up and fade in together
        Animated.parallel([
          Animated.timing(rewardsAnim, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.back(1)),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // 3. Loop Pulse Animation for the Button
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Semi-transparent Backdrop */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.blurBackdrop} />
        </View>

        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            {/* Animated Trophy Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.iconBlur} />
              <View style={styles.iconCircle}>
                <MaterialIcons name="emoji-events" size={48} color="#102216" />
              </View>
            </Animated.View>

            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>COMPLETED!</Text>
            </View>

            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Success Score</Text>
              <Text style={styles.scoreValue}>98%</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "98%" }]} />
              </View>
            </View>

            {/* Animated Rewards Grid */}
            <Animated.View
              style={[
                styles.rewardsGrid,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: rewardsAnim }],
                },
              ]}
            >
              <RewardItem icon="payments" value="+$2,500" iconColor="#eab308" />
              <RewardItem
                icon="bolt"
                value="+50 XP"
                iconColor={theme.colors.primary}
              />
              <RewardItem icon="verified" value="+2 Rep" iconColor="#60a5fa" />
            </Animated.View>

            {/* Animated Pulsing Claim Button */}
            <Animated.View
              style={{ width: "100%", transform: [{ scale: pulseAnim }] }}
            >
              <TouchableOpacity
                style={styles.claimButton}
                onPress={onClaim}
                activeOpacity={0.8}
              >
                <Text style={styles.claimButtonText}>CLAIM REWARDS</Text>
                <MaterialIcons name="redeem" size={20} color="#102216" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.backButton}>
              <Text style={styles.backButtonText}>Claim your Rewards</Text>
            </View>
          </ScrollView>

          {/* Background Decorative Blurs */}
          <View
            style={[
              styles.cornerDecor,
              { top: -20, right: -20, backgroundColor: "#facc1515" },
            ]}
          />
          <View
            style={[
              styles.cornerDecor,
              { bottom: -20, left: -20, backgroundColor: "#25f46a15" },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
};

const RewardItem = ({
  icon,
  value,
  iconColor,
}: {
  icon: any;
  value: string;
  iconColor: string;
}) => (
  <View style={styles.rewardCard}>
    <MaterialIcons name={icon} size={24} color={iconColor} />
    <Text style={styles.rewardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 34, 22, 0.8)",
  },
  blurBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(37, 244, 106, 0.2)",
    maxHeight: "90%",
    paddingBottom: 20,
    elevation: 24,
    overflow: "hidden",
  },

  content: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBlur: {
    position: "absolute",
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary,
    borderRadius: 40,
    opacity: 0.2,
    transform: [{ scale: 2 }],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 44,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
    marginTop: 10,
  },
  scoreCard: {
    width: "100%",
    backgroundColor: "rgba(37, 244, 106, 0.08)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.15)",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreLabel: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: "900",
    color: "#0f172a",
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  rewardsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },
  rewardCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  rewardValue: {
    fontWeight: "800",
    fontSize: 15,
    color: "#0f172a",
    marginTop: 6,
  },
  claimButton: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 20,
    gap: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  claimButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#102216",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: 14,
  },
  cornerDecor: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: -1,
  },
});
