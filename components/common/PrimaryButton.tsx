import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../constant/theme.ts";

export const PrimaryButton = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => {
  // 1. Create the scale value
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    // 2. Shrink to 96% of original size
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    // 3. Bounce back to original size
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
      style={{ width: "100%" }}
    >
      <Animated.View
        style={[styles.launchBtn, { transform: [{ scale: scaleValue }] }]}
      >
        <Text style={styles.launchBtnText}>{title}</Text>
        <MaterialIcons
          name="arrow-forward"
          size={22}
          color={theme.colors.backgroundDark}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  launchBtn: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  launchBtnText: {
    color: theme.colors.backgroundDark,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
