import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constant/theme.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { formatCurrency } from "../../utils/helper.ts";

export const CurrencyBar = () => {
  const insets = useSafeAreaInsets();
  const player = usePlayerStore().player;
  return (
    <View style={[styles.headerArea, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.balanceRow}>
          <View style={styles.walletIconBox}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View>
            <Text style={styles.balanceLabel}>BALANCE</Text>
            <Text style={styles.balanceValue}>
              ${formatCurrency(player?.money ?? 0)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(37, 244, 106, 0.1)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  balanceRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  walletIconBox: {
    backgroundColor: "rgba(37, 244, 106, 0.15)",
    padding: 8,
    borderRadius: 50,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(37, 244, 106, 0.7)",
    letterSpacing: 1,
  },
  balanceValue: { fontSize: 20, fontWeight: "bold", color: "#0d1c12" },
  addBtn: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 10,
    elevation: 4,
  },
});
