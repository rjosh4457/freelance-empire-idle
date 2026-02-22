import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ToolImages } from "../../constant/registry.ts";
import { theme } from "../../constant/theme.ts";

interface InventorySlotProps {
  image: string;
  level?: number;
  isSelected?: boolean;
  isLocked?: boolean;
  onPress?: () => void;
}

export const InventorySlot = ({
  image,
  level,
  isSelected = false,
  onPress,
}: InventorySlotProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.slot, isSelected && styles.slotSelected]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={ToolImages[image]}
          style={styles.itemImage}
          resizeMode="contain"
        />
      </View>

      {level && (
        <View
          style={[
            styles.levelBadge,
            isSelected
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: theme.colors.light },
          ]}
        >
          <Text style={styles.levelText}>LVL {level}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slot: {
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.light,
    justifyContent: "center",
    alignItems: "center",
  },
  slotSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    borderWidth: 2,
  },
  levelBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 8,
    fontWeight: "900",
    color: theme.colors.black,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
});
