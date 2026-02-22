import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActionButton } from "./ActionButton.tsx";
import { theme } from "../../constant/theme.ts";

export const QuickActions = () => {
  return (
    <View style={styles.container}>
      <ActionButton
        icon="inventory"
        label="Equipment"
        color="#fbbf24"
        onPress={() => router.replace("./(protected)/inventory")}
      />

      <ActionButton
        icon="mail"
        label="Email"
        color={theme.colors.secondary}
        onPress={() => console.log("Email pressed")}
      />
      <ActionButton
        icon="person"
        label="Profile"
        color="#25f46a"
        onPress={() => console.log("Profile pressed")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 16,
  },
});
