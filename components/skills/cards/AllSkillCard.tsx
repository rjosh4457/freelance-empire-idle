import { MaterialIcons } from "@expo/vector-icons";
import {
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
  price: number;
  color: string;
  unlock_at: number;
  isBuyable?: boolean;
  onPurchased: () => void;
}
export const AllSkillCard = ({
  icon,
  title,
  sub,
  price,
  color,
  unlock_at,
  isBuyable,
  onPurchased,
}: SkillCardProps) => {
  return (
    <View style={[styles.card, !isBuyable && styles.lockedCard]}>
      <View style={[styles.statusTag, { backgroundColor: color }]}>
        <Text style={styles.statusTagText}>Req: LVL {unlock_at}</Text>
      </View>

      <View style={[styles.iconWrapper, { backgroundColor: `${color}10` }]}>
        <MaterialIcons name={icon} size={48} color={color} />
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardReq}>{sub}</Text>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, !isBuyable && styles.lockedBtn]}
        onPress={onPurchased}
        disabled={!isBuyable}
      >
        {isBuyable ? (
          <>
            <MaterialIcons
              name="shopping-cart"
              size={16}
              color={theme.colors.white}
            />
            <Text style={styles.buyBtnText}>${formatCurrency(price)}</Text>
          </>
        ) : (
          <>
            <MaterialIcons name="lock" size={16} color="#94a3b8" />
            <Text style={styles.lockedBtnText}>LEVEL REQUIRED</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: (width - 36) / 2,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
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
  statusTag: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusTagText: { color: "#fff", fontSize: 8, fontWeight: "900" },
  iconWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardInfo: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#18181b" },
  cardReq: { fontSize: 10, fontWeight: "600", color: theme.colors.success },
  actionBtn: {
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
  lockedBtnText: { color: "#94a3b8", fontWeight: "700", fontSize: 12 },
  lockedBtn: { backgroundColor: theme.colors.white },
  disabledBtn: { backgroundColor: "#f1f5f9" },
  actionBtnText: { color: theme.colors.white, fontWeight: "800", fontSize: 13 },
});
