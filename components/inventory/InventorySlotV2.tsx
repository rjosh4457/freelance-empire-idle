import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { ToolImages } from "../../constant/registry.ts";
import { theme } from "../../constant/theme.ts";
import { formatCurrency, formatPerkLabel } from "../../utils/helper.ts";
import { AppPressable } from "../common/AppPressable.tsx";

interface UpgradeCardProps {
  image: string;
  title: string;
  level: string;
  perks: Record<string, number>;
  progress: number; // 0 to 1
  nextBonus: string;
  price: number;
  accentColor: string;
  isLocked?: boolean;
  onUpgrade: () => void;
}

export const InventorySlotV2 = ({
  image,
  title,
  level,
  perks,
  progress,
  nextBonus,
  price,
  accentColor,
  onUpgrade,
  isLocked,
}: UpgradeCardProps) => {
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
      <View style={styles.mainRow}>
        {/* Icon Container */}
        <View style={styles.imageContainer}>
          <Image
            source={ToolImages[image]}
            style={styles.itemImage}
            resizeMode="contain"
          />
        </View>

        {/* Content Info */}
        <View style={styles.infoCol}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </View>
          {Object.entries(perks).map(([key, value]) => (
            <View key={key} style={styles.bonusRow}>
              <Text style={[styles.bonusText, { color: accentColor }]}>
                {formatPerkLabel(key)}: +{value}%
              </Text>
            </View>
          ))}
          {/* Progress Bar */}
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: widthInterpolation, backgroundColor: accentColor },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.nextText}>{nextBonus}</Text>
        <AppPressable
          style={[styles.upgradeBtn, isLocked && styles.lockedBtn]}
          onPress={onUpgrade}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <MaterialIcons name="lock" size={16} color="#94a3b8" />
              <Text style={styles.lockedBtnText}>MAXED</Text>
            </>
          ) : (
            <>
              <Text style={styles.btnLabel}>UPGRADE</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {`$${formatCurrency(price)}`}
                </Text>
              </View>
            </>
          )}
        </AppPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.light,
    // Subtle shadow matching shadow-[0_4px_12px_rgba(0,0,0,0.05)]
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: theme.spacing.sm,
  },
  mainRow: {
    flexDirection: "row",
    gap: 16,
  },

  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 4,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },

  infoCol: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.black,
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(73, 156, 101, 0.1)", // Using text-muted hex with alpha
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.mutedV3,
  },
  bonusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  bonusText: {
    fontSize: 11,
    lineHeight: 12,
    fontWeight: "600",
  },
  progressBg: {
    height: 6,
    backgroundColor: theme.colors.muted,
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 16,
  },
  nextText: {
    fontSize: 12,
    color: theme.colors.mutedV3,
    fontWeight: "500",
    flex: 0.8,
  },
  upgradeBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: theme.borderRadius.lg,
    gap: 8,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.black,
  },
  priceContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.black,
  },

  lockedBtn: { backgroundColor: theme.colors.muted },
  lockedBtnText: { color: "#94a3b8", fontWeight: "700", fontSize: 12 },
});
