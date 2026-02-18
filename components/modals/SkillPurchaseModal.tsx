import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constant/theme.ts";
import { IconNameMC } from "../../types/common.d.ts";

const { width } = Dimensions.get("window");

interface PurchaseModalProps {
  isVisible: boolean;
  skillName: string;
  price: number;
  icon: IconNameMC;
  color: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SkillPurchaseModal({
  isVisible,
  skillName,
  price,
  icon,
  color,
  onConfirm,
  onCancel,
}: PurchaseModalProps) {
  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />

        {/* Centered Card */}
        <View style={styles.modalCard}>
          {/* Skill Icon */}
          <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
            <MaterialIcons name={icon} size={44} color={color} />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>Confirm Purchase</Text>
          <Text style={styles.description}>
            Study <Text style={styles.boldText}>{skillName}</Text> for{" "}
            <Text style={[styles.boldText, { color: theme.colors.primary }]}>
              ${price.toLocaleString()}
            </Text>
            ? This will expand your empire's capabilities.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Confirm Purchase</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0d1c12",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    color: "#499c65",
    marginBottom: 24,
  },
  boldText: {
    fontWeight: "bold",
    color: "#0d1c12",
  },
  buttonGroup: {
    width: "100%",
    gap: 10,
  },
  btn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: theme.colors.primary,
  },
  cancelBtn: {
    backgroundColor: "#f5f8f6",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
});
