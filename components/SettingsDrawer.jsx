import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useTemperature } from "@/context/TemperatureContext";

const { width, height } = Dimensions.get("window");

export default function SettingsDrawer({ isOpen, onClose }) {
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

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
    };
  });

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isOpen ? 0 : width, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  if (!isOpen) return null;

  const handleToggle = () => {
    toggleUnit();
  };

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, drawerStyle]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.drawerContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="thermostat" size={24} color="white" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Temperature Unit</Text>
                <Text style={styles.settingDescription}>
                  Choose between Celsius and Fahrenheit
                </Text>
              </View>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggle} onPress={handleToggle}>
                <Animated.View style={[styles.slider, animatedStyle]} />
                <Text style={[styles.unit, unit === "C" && styles.activeUnit]}>
                  °C
                </Text>
                <Text style={[styles.unit, unit === "F" && styles.activeUnit]}>
                  °F
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Weather App v1.0</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  overlayTouch: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.8,
    height: height,
    zIndex: 1001,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
  toggleContainer: {
    alignItems: "center",
  },
  toggle: {
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
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
