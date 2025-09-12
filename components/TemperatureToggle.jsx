import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTemperature } from "@/context/TemperatureContext";

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();
  const slideValue = useSharedValue(unit === "F" ? 1 : 0);

  React.useEffect(() => {
    slideValue.value = withSpring(unit === "F" ? 1 : 0);
  }, [unit, slideValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideValue.value * 44 }],
    };
  });

  const handleToggle = () => {
    toggleUnit();
  };

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <TouchableOpacity style={styles.toggleContainer} onPress={handleToggle}>
        <Animated.View style={[styles.slider, animatedStyle]} />
        <Text style={[styles.unit, unit === "C" && styles.activeUnit]}>°C</Text>
        <Text style={[styles.unit, unit === "F" && styles.activeUnit]}>°F</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    padding: 3,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  slider: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 0,
    paddingVertical: 15,
    width: 44,
    height: 44,
    textAlign: "center",
    lineHeight: 14,
  },
  activeUnit: {
    color: "#667eea",
  },
});
