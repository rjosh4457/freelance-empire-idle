import { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface AppPressableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scaleTo?: number;
}

export const AppPressable = ({
  children,
  scaleTo = 0.95,
  style,
  disabled,
  ...rest
}: AppPressableProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        {...rest}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
