import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TemperatureProvider } from "@/context/TemperatureContext";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutInner() {
  const { resolvedTheme } = useTheme();
  return (
    <ThemeProvider value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <TemperatureProvider>
            <RootLayoutInner />
          </TemperatureProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
