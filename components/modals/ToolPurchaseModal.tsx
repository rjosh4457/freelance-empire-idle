import { BlurView } from "expo-blur";
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ToolImages } from "../../constant/registry.ts";
import { theme } from "../../constant/theme.ts";

const { width } = Dimensions.get("window");

interface ToolPurchaseModalProps {
  isVisible: boolean;
  toolName: string;
  price: number;
  image: string; // URL or local path to tool image
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ToolPurchaseModal({
  isVisible,
  toolName,
  price,
  image,
  onConfirm,
  onCancel,
}: ToolPurchaseModalProps) {
  if (!isVisible) return null;
  const imageSource = ToolImages[image];
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
          {/* Tool Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={imageSource}
              style={styles.toolImage}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>Confirm Purchase</Text>
          <Text style={styles.description}>
            Buy <Text style={styles.boldText}>{toolName}</Text> for{" "}
            <Text style={[styles.boldText, { color: theme.colors.primary }]}>
              ${price.toLocaleString()}
            </Text>
            ? This tool will boost your freelance empire's productivity.
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
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f8f6",
  },
  toolImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
