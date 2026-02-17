import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../constant/theme.ts";

interface TabButtonProps {
  tabId: string;
  currentTab: string;

  label: string;
  onSelectTab: (tab: string) => void;
}
export const TabButtons = ({
  tabId,
  label,
  currentTab,
  onSelectTab,
}: TabButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelectTab(tabId)}
      style={[styles.tab, currentTab === tabId && styles.activeTab]}
    >
      <Text
        style={currentTab === tabId ? styles.activeTabText : styles.tabText}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: theme.colors.primary, elevation: 2 },
  activeTabText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  tabText: { color: "#499c65", fontWeight: "bold", fontSize: 14 },
});
