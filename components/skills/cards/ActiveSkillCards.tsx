import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react"; // Added useRef and useEffect
import {
  Animated, // Added Animated
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../../constant/theme.ts";
import { IconNameMC } from "../../../types/common.d.ts";
import { formatCurrency } from "../../../utils/helper.ts";

const { width } = Dimensions.get("window");

interface SkillCardProps {
  icon: IconNameMC;
  title: string;
  sub: string;
  price: string;
  color: string;
  level?: number;
  progress?: number; // Expected as 0 to 1
  disabled?: boolean;
  onUpgrade: () => void;
}

export const ActiveSkillCards = ({
  icon,
  title,
  sub,
  level,
  progress = 0,
  price,
  color,
  disabled,
  onUpgrade,
}: SkillCardProps) => {
  // Initialize the animated value
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  // Animate when the progress prop changes
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500, // 500ms for a smooth slide
      useNativeDriver: false, // width doesn't support native driver
    }).start();
  }, [progress]);

  // Interpolate the value to a percentage string
  const widthInterpolation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>
      {level && (
        <View style={[styles.levelBadge, { backgroundColor: color }]}>
          <Text style={styles.levelText}>LV. {level}</Text>
        </View>
      )}

      <View style={[styles.cardImageArea, { backgroundColor: `${color}10` }]}>
        <MaterialIcons name={icon} size={48} color={color} />

        {/* Animated Progress Bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: widthInterpolation, // Use the animated width
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.cardSubText}>{sub}</Text>
      </View>

      <TouchableOpacity
        style={[styles.upgradeBtn, disabled && styles.disabledBtn]}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onUpgrade}
      >
        <Text
          style={[styles.upgradeBtnText, disabled && styles.disabledBtnText]}
        >
          ${formatCurrency(price)} Upgrade
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 44) / 2, // Fine-tuned for grid spacing
    backgroundColor: theme.colors["white"],
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  levelBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: { color: theme.colors["white"], fontSize: 10, fontWeight: "bold" },
  cardImageArea: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  progressBarFill: {
    height: "100%",
  },
  cardInfo: { marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#0d1c12" },
  cardSubText: { fontSize: 11, color: "#499c65", fontWeight: "500" },
  upgradeBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  upgradeBtnText: {
    color: theme.colors["white"],
    fontSize: 13,
    fontWeight: "bold",
  },
  disabledBtn: { backgroundColor: theme.colors["backgroundLight"] },
  disabledBtnText: { color: "#94a3b8" },
});
