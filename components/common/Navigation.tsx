import { usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { NavItem } from "./NavItem.tsx";

export const Navigation = () => {
  const pathname = usePathname();

  // Helper to check if the current route matches the tab
  // We use "includes" or exact match depending on how nested your routes get
  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.bottomNav}>
      <NavItem
        icon="work"
        label="Dashboard"
        path="../(tabs)/"
        active={isActive("/dashboard")}
      />
      <NavItem
        icon="trending-up"
        label="Skills"
        path="./skills"
        active={isActive("/skills")}
      />
      <NavItem
        icon="group"
        label="Clients"
        path="./(tabs)/clients"
        active={isActive("/clients")}
      />
      <NavItem
        icon="storefront"
        label="Shop"
        path="./(tabs)/skills"
        active={isActive("/shop")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(37, 244, 106, 0.1)", // Your signature green
    paddingBottom: 20,
    // Add a slight shadow for a "floating" feel if you want
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
});
