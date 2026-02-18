import { MaterialIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../constant/theme.ts";
import { IconNameMC } from "../../types/common.d.ts";
interface NavItemProps {
  icon: IconNameMC;
  label: string;
  path: Href;
  active?: boolean;
}
export const NavItem = ({ icon, label, path, active }: NavItemProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.navItem} onPress={() => router.push(path)}>
      <MaterialIcons
        name={icon}
        size={26}
        color={active ? theme.colors.primary : "#499c65"}
      />
      <Text style={[styles.navLabel, active && styles.activeNavLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  navItem: { flex: 1, justifyContent: "center", alignItems: "center", gap: 4 },
  navLabel: { fontSize: 11, fontWeight: "500", color: "#499c65" },
  activeNavLabel: { fontWeight: "bold", color: theme.colors.primary },
});
