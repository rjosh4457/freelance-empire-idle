import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ToolImages } from "../../../constant/registry.ts";
import { theme } from "../../../constant/theme.ts";
import { formatCurrency } from "../../../utils/helper.ts";

interface ShopItemProps extends BaseToolType {
  isLocked?: boolean;
  color?: string;
  onBuy: () => void;
}

export const ShopItemCard = ({
  image,
  name,
  perks,
  price,
  isLocked,
  description,
  onBuy,
  color,
}: ShopItemProps) => {
  const imageSource = ToolImages[image];
  const [showPerk, setShowPerk] = useState(false);

  return (
    <View style={[styles.card, isLocked && styles.lockedCard]}>
      <View style={styles.topSection}>
        {/* Image Container */}
        <View
          style={[styles.imageContainer, { backgroundColor: `${color}10` }]}
        >
          <Image
            source={imageSource}
            style={styles.itemImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <View style={[styles.description]}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                styles.descriptionText,
                { color: theme.colors["mutedV3"] },
              ]}
            >
              {description}
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonsRow}>
        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.buyBtn, isLocked && styles.lockedBtn]}
          onPress={onBuy}
          disabled={isLocked}
          activeOpacity={0.8}
        >
          {isLocked ? (
            <>
              <MaterialIcons name="lock" size={16} color="#94a3b8" />
              <Text style={styles.lockedBtnText}>LOCKED</Text>
            </>
          ) : (
            <>
              <MaterialIcons
                name="shopping-cart"
                size={16}
                color={theme.colors.white}
              />
              <Text style={styles.buyBtnText}>${formatCurrency(price)}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Perks Icon Button */}
        <TouchableOpacity
          style={styles.perksBtn}
          onPress={() => setShowPerk(true)}
          disabled={isLocked}
          activeOpacity={0.8}
        >
          <MaterialIcons name="error-outline" size={20} color={color} />
        </TouchableOpacity>
      </View>

      {/* Perks Modal */}
      <Modal
        visible={showPerk}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPerk(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowPerk(false)}
        >
          <View style={styles.perkPopup}>
            <Text style={styles.perkText}>{perks}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    justifyContent: "space-between",
    minHeight: 150,
    position: "relative",
  },
  lockedCard: { opacity: 0.7 },

  topSection: { alignItems: "center", marginBottom: 12 },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  itemImage: { width: "80%", height: "80%" },
  info: { width: "100%" },
  title: { fontSize: 14, fontWeight: "800", color: theme.colors["black"] },
  description: {
    marginTop: 2,
  },
  descriptionText: { fontSize: 10, fontWeight: "800" },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  buyBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buyBtnText: { color: theme.colors.white, fontWeight: "800", fontSize: 13 },

  perksBtn: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },

  lockedBtn: { backgroundColor: theme.colors.white },
  lockedBtnText: { color: "#94a3b8", fontWeight: "700", fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  perkPopup: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: 12,
    maxWidth: "80%",
  },
  perkText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
