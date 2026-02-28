import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { ActionButton } from "./ActionButton.tsx";

export const QuickActions = () => {
  return (
    <View style={styles.container}>
      <ActionButton
        icon="archive"
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
        icon="account"
        label="Profile"
        color="#25f46a"
        onPress={() => console.log("Profile pressed")}
      />
      <ActionButton
        icon="trophy"
        label="Leaderboard"
        color="#f45525"
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
