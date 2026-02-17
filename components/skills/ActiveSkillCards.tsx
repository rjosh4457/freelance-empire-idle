import { MaterialIcons } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constant/theme.ts";
import { IconNameMC } from "../../types/common.d.ts";

const { width } = Dimensions.get("window");

interface SkillCardProps {
  icon: IconNameMC;
  title: string;
  sub: string;
  price: string;
  color: string;
  level?: number;
  progress?: number;
  disabled?: boolean;
}
export const ActiveSkillCards = ({
  icon,
  title,
  sub,
  level,
  progress,
  price,
  color,
  disabled,
}: SkillCardProps) => (
  <View style={styles.card}>
    {level && (
      <View style={[styles.levelBadge, { backgroundColor: color }]}>
        <Text style={styles.levelText}>LV. {level}</Text>
      </View>
    )}

    <View style={[styles.cardImageArea, { backgroundColor: `${color}10` }]}>
      <MaterialIcons name={icon} size={48} color={color} />
      {progress !== undefined && progress > 0 && (
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%`, backgroundColor: color },
            ]}
          />
        </View>
      )}
    </View>

    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubText}>{sub}</Text>
    </View>

    <TouchableOpacity
      style={[styles.upgradeBtn, disabled && styles.disabledBtn]}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.upgradeBtnText, disabled && styles.disabledBtnText]}>
        ${price} Upgrade
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: (width - 36) / 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
    elevation: 2,
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
  levelText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
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
  progressBarFill: { height: "100%" },
  cardInfo: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#0d1c12" },
  cardSubText: { fontSize: 11, color: "#499c65", fontWeight: "500" },
  upgradeBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  upgradeBtnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#e2e8f0" },
  disabledBtnText: { color: "#94a3b8" },
});
