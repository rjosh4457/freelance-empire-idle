import { ScrollView, StyleSheet, View } from "react-native";
import { TabListTypes } from "../../types/common.d.ts";
import { TabItem } from "./TabItem.tsx";

interface TabListProps {
  tabs: TabListTypes[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
export const TabList = ({ tabs, activeTab, onTabChange }: TabListProps) => {
  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
  };
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tabId={tab.id}
            label={tab.label}
            icon={tab.icon}
            color={tab.color}
            onSelectTab={() => handleTabChange(tab.id)}
            currentTab={activeTab}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 6,
  },
});
