import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

export const ActionButton = ({
  icon,
  label,
  color,
  onPress,
}: ActionButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.btnWrapper}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.iconBox,
            {
              backgroundColor: `${color}30`,
              borderColor: `${color}20`,
              transform: [{ scale }],
            },
          ]}
        >
          <MaterialIcons name={icon} size={28} color={color} />
        </Animated.View>
      </Pressable>

      <Text style={styles.btnLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  btnLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
