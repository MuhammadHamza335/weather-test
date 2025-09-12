import { Tabs } from "expo-router";
import React from "react";
import { View, useColorScheme as useSystemColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const systemScheme = useSystemColorScheme();
  const insets = useSafeAreaInsets();
  const baseBarHeight = 60;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: baseBarHeight + insets.bottom,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={
                colorScheme === "dark"
                  ? ["#1f2937", "#111827", "#0b1020"]
                  : ["#667eea", "#764ba2", "#f093fb"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: insets.bottom,
                top: 0,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: insets.bottom,
                top: 0,
                backgroundColor: "rgba(102, 126, 234, 0.95)",

                borderTopWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 15,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: insets.bottom,
                backgroundColor: systemScheme === "dark" ? "#000" : "#fff",
              }}
            />
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 0,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
