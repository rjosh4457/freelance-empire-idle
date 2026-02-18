import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { theme } from "../../../constant/theme.ts";
import { IconNameMC } from "../../../types/common.d.ts";

interface MilestoneCardProps {
  icon: IconNameMC;
  title: string;
  sub: string;
  color: string;
  canClaim?: boolean;
  locked?: boolean;
}
export const MilestoneCard = ({
  icon,
  title,
  sub,
  color,
  locked,
}: MilestoneCardProps) => {
  return (
    <View style={[styles.mCard, locked && { opacity: 0.5 }]}>
      <View style={[styles.mIconBox, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.mTextContent}>
        <Text style={styles.mTitle}>{title}</Text>
        <Text style={styles.mSub}>{sub}</Text>
      </View>
      {locked ? (
        <View style={styles.lockIcon}>
          <MaterialIcons name="lock" size={18} color="#94a3b8" />
        </View>
      ) : (
        <TouchableOpacity style={styles.claimBtn}>
          <Text style={styles.claimBtnText}>CLAIM</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  mIconBox: { padding: 10, borderRadius: 12 },
  mTextContent: { flex: 1, marginLeft: 12 },
  mTitle: { fontSize: 14, fontWeight: "bold", color: "#0d1c12" },
  mSub: { fontSize: 11, color: "#64748b" },
  claimBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  claimBtnText: { color: "#fff", fontSize: 11, fontWeight: "bold" },

  lockIcon: { padding: 8, backgroundColor: "#f8fafc", borderRadius: 8 },
});
