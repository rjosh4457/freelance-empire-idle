import { Tabs } from "expo-router";
import { Navigation } from "../../components/common/Navigation.tsx";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <Navigation />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: "Skills",
        }}
      />
      <Tabs.Screen
        name="shops"
        options={{
          title: "Shops",
        }}
      />
    </Tabs>
  );
}
