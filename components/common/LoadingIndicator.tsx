import { ActivityIndicator, View } from "react-native";
import { theme } from "../../constant/theme.ts";

export const LoadingIndicator = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.backgroundLight,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};
