import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../../constant/theme.ts";
import { useGigsStore } from "../../../stores/gig-store.ts";
import { usePlayerStore } from "../../../stores/player-store.ts";
import { useSkillStore } from "../../../stores/skills-store.ts";
import { calculateSpeedBySkillLevel } from "../../../utils/config.ts";

interface DeskCardProps {
  gig: AcceptedGigType;
  onComplete: () => void;
}
export const DeskCard = ({ gig, onComplete }: DeskCardProps) => {
  const { applyBoost, activeGig } = useGigsStore();
  const { activeSkills } = useSkillStore();
  const { player } = usePlayerStore();
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [showTap, setShowTap] = useState<boolean>(false);

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const endTime = useMemo(() => new Date(gig.end_at).getTime(), []);

  const current_skill = activeSkills.find(
    (skill) => skill.code === gig.required_skill,
  );

  const workSpeed = useMemo(() => {
    if (!player || !current_skill) return 0;
    return calculateSpeedBySkillLevel(player, current_skill.level);
  }, [current_skill]);

  // Countdown only (UI)
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setRemainingMs(0);
        clearInterval(interval);
        onComplete();
        return;
      }

      setRemainingMs(diff);
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // Boost handler (delegates to store)
  const handleBoost = () => {
    if (!showTap) return;

    applyBoost();

    floatAnim.setValue(0);
    opacityAnim.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(floatAnim, {
        toValue: -60,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTap(false);
      floatAnim.setValue(0);
    });
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const progress = activeGig?.progress ?? 0;

  return (
    <View style={styles.stageWrapper}>
      <View style={styles.stageInner}>
        <Image
          source={require("../../../assets/player/working-player.png")}
          style={styles.stageImage}
          resizeMode="contain"
        />

        {/* HUD UI */}
        <View style={styles.projectHud}>
          <View style={styles.hudHeader}>
            <Text style={styles.hudLabel}>CURRENT PROJECT</Text>
            <View style={styles.speedBadge}>
              <MaterialIcons name="bolt" size={10} color="#fff" />
              <Text style={styles.speedText}>{workSpeed.toFixed(2)}/s</Text>
            </View>
          </View>

          <Text style={styles.hudTitle} numberOfLines={1}>
            {gig.name}
          </Text>

          <View style={styles.hudProgressTrack}>
            <View style={[styles.hudProgressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.hudFooter}>
            <Text style={styles.hudPercent}>{progress.toFixed(2)}%</Text>
            <Text style={styles.hudTimer}>
              {remainingMs > 0 ? formatTime(remainingMs) : "Completed"}
            </Text>
          </View>
        </View>

        {/* Floating Boost Button */}
        {showTap && (
          <View style={styles.tapContainer}>
            <Animated.Text
              style={[
                styles.floatingText,
                {
                  transform: [{ translateY: floatAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              +{Math.max(2, workSpeed * 2).toFixed(0)}%
            </Animated.Text>

            <Animated.View
              style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TouchableOpacity onPress={handleBoost} activeOpacity={1}>
                <View style={styles.tapRipple} />
                <View style={styles.tapIconBox}>
                  <MaterialIcons
                    name="ads-click"
                    size={28}
                    color={theme.colors.primary}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stageWrapper: { paddingHorizontal: 16, marginBottom: 20 },
  stageInner: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
    elevation: 10,
  },
  stageImage: { width: "100%", height: "100%" },
  projectHud: {
    position: "absolute",
    top: "22%",
    alignSelf: "center",
    width: "75%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    zIndex: 5,
  },
  hudHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  speedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  speedText: { color: "#fff", fontSize: 9, fontWeight: "bold", marginLeft: 2 },
  hudLabel: { fontSize: 8, fontWeight: "800", color: "#94a3b8" },
  hudTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0d1c12",
    marginBottom: 8,
  },
  hudProgressTrack: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  hudProgressFill: { height: "100%", backgroundColor: theme.colors.primary },
  hudFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  hudPercent: { fontSize: 11, fontWeight: "bold", color: theme.colors.primary },
  hudTimer: { fontSize: 10, color: theme.colors.success, fontWeight: "bold" },

  tapContainer: {
    position: "absolute",
    bottom: "20%",
    right: "15%",
    alignItems: "center",
  },
  floatingText: {
    position: "absolute",
    top: -20,
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.primary,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tapIconBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  tapRipple: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: "rgba(37, 244, 106, 0.2)",
    borderRadius: 40,
  },
});
