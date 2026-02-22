import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { formatCurrency } from "../../utils/helper.ts";

export const InventoryHeader = () => {
  const insets = useSafeAreaInsets();
  const player = usePlayerStore().player;
  return (
    <View style={[styles.header, { marginTop: insets.top + 10 }]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.black}
          />

          <Text style={styles.headerTitle}>Upgrades</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.currencyBadge}>
        <MaterialIcons name="payments" size={18} color={theme.colors.primary} />
        <Text style={styles.currencyText}>
          ${formatCurrency(player?.money ?? 0)}
        </Text>
        <TouchableOpacity>
          <MaterialIcons
            name="add-circle"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  backButton: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.black,
    fontFamily: theme.typography.display,
  },
  currencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.2)",
  },
  currencyText: { fontWeight: "800", color: theme.colors.black },
});
