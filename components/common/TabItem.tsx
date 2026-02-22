import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../constant/theme.ts";
import { IconNameMC } from "../../types/common.d.ts";

interface TabItemProps {
  tabId: string;
  currentTab: string;
  label: string;
  color: string;
  icon: IconNameMC;
  onSelectTab: (tab: string) => void;
}
export const TabItem = ({
  tabId,
  currentTab,
  label,
  color,
  icon,
  onSelectTab,
}: TabItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelectTab(tabId)}
      style={[styles.tabButton, currentTab === tabId && styles.tabButtonActive]}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={currentTab === tabId ? "#0d1c12" : color}
      />
      <Text
        style={[styles.tabText, currentTab === tabId && styles.tabTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primary,

    borderColor: theme.colors.primary,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  tabTextActive: { color: theme.colors.black },
});
