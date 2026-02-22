import { Animated } from "react-native";
import { useRef } from "react";

export const scaleAnim = useRef(new Animated.Value(1)).current;

export const handlePressIn = () => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    useNativeDriver: true,
    speed: 20,
    bounciness: 4,
  }).start();
};

export const handlePressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    useNativeDriver: true,
    speed: 20,
    bounciness: 6,
  }).start();
};
