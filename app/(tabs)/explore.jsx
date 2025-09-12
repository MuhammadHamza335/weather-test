import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, removeFavorite } from "@/utils/storage";
import WeatherCard from "@/components/WeatherCard";
import SettingsDrawer from "@/components/SettingsDrawer";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherByCity } from "@/services/weatherService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const load = useCallback(async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  }, []);

  // Reload favorites when tab is focused (real-time updates)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["fav-weather", selected],
    queryFn: () => fetchWeatherByCity(selected),
    enabled: !!selected,
  });

  const onRemove = useCallback(
    async (city) => {
      await removeFavorite(city);
      load();
      if (selected === city) setSelected(null);
    },
    [load, selected]
  );

  return (
    <LinearGradient
      colors={
        resolvedTheme === "dark"
          ? ["#1f2937", "#111827", "#0b1020"]
          : ["#667eea", "#764ba2", "#f093fb"]
      }
      style={styles.wrapper}
    >
      <StatusBar
        barStyle={resolvedTheme === "dark" ? "light-content" : "dark-content"}
      />
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={[styles.container, { paddingBottom: 70 + insets.bottom }]}
      >
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setIsSettingsOpen(true)}
          >
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.subtitle}>
              {favorites.length} favorite{" "}
              {favorites.length === 1 ? "city" : "cities"}
            </Text>
          </View>
          <View style={styles.spacer} />
        </Animated.View>

        {favorites.length === 0 ? (
          <Animated.View
            entering={FadeInUp.delay(300)}
            style={styles.emptyContainer}
          >
            <MaterialIcons
              name="star-border"
              size={64}
              color="rgba(255, 255, 255, 0.5)"
            />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Star cities from the home screen to see them here
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInUp.delay(300)}
            style={styles.listContainer}
          >
            <FlatList
              data={favorites}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInUp.delay(100 * index)}>
                  <TouchableOpacity
                    style={[
                      styles.favoriteItem,
                      selected === item && styles.selectedItem,
                    ]}
                    onPress={() => setSelected(item)}
                  >
                    <View style={styles.favoriteItemContent}>
                      <MaterialIcons name="star" size={20} color="#FFD700" />
                      <Text style={styles.favoriteText}>{item}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => onRemove(item)}
                    >
                      <MaterialIcons name="delete" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </Animated.View>
        )}

        {selected && data && (
          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.weatherContainer}
          >
            <WeatherCard data={data} showFavorite={false} />
          </Animated.View>
        )}
      </Animated.View>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingTop: Math.max(50, height * 0.06),
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height > 700 ? 30 : 20,
    paddingHorizontal: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  spacer: {
    width: 44,
  },
  title: {
    fontSize: height > 700 ? 32 : 28,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: height > 700 ? 15 : 13,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  listContainer: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: height > 700 ? 12 : 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedItem: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  favoriteItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  favoriteText: {
    fontSize: height > 700 ? 16 : 14,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  removeButton: {
    padding: 8,
  },
  separator: {
    height: height > 700 ? 8 : 6,
  },
  weatherContainer: {
    marginTop: 20,
  },
});
