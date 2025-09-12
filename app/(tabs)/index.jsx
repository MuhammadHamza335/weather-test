import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import WeatherDisplay from "@/components/WeatherDisplay";
import RecentSearchList from "@/components/RecentSearchList";
import SettingsDrawer from "@/components/SettingsDrawer";
import { addRecentSearch, getRecentSearches } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [recent, setRecent] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getRecentSearches();
      setRecent(list);
    })();
  }, []);

  const onSearch = useCallback(async () => {
    if (!query.trim()) return;
    setCity(query.trim());
    const updated = await addRecentSearch(query.trim());
    setRecent(updated);
    setQuery("");
  }, [query]);

  const onSelectRecent = useCallback(async (c) => {
    setCity(c);
    const updated = await addRecentSearch(c);
    setRecent(updated);
  }, []);

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status !== "granted") {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let detectedCity = null;
      if (reverseGeocode && reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        detectedCity =
          location.city ||
          location.subAdministrativeArea ||
          location.district ||
          location.region;
      }

      if (!detectedCity) {
        return;
      }

      setCity(detectedCity);
      const updated = await addRecentSearch(detectedCity);
      setRecent(updated);
    } catch (error) {
      setCity("London");
      const updated = await addRecentSearch("London");
      setRecent(updated);
    }
  }, []);

  const subtitle = useMemo(
    () => (city ? `Showing weather for ${city}` : "Search a city to begin"),
    [city]
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
            <Text style={styles.title}>Weather</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.spacer} />
        </Animated.View>

        <Animated.View
          entering={SlideInRight.delay(300)}
          style={styles.searchContainer}
        >
          <View style={styles.searchWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search for a city..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
            <TouchableOpacity
              style={styles.locationIcon}
              onPress={requestLocation}
            >
              <MaterialIcons name="my-location" size={20} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.searchButton, { opacity: query.trim() ? 1 : 0.5 }]}
              onPress={onSearch}
              disabled={!query.trim()}
            >
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.section}>Recent searches</Text>
          <RecentSearchList items={recent} onSelect={onSelectRecent} />
        </Animated.View>

        <WeatherDisplay city={city} />
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
    paddingBottom: 70 + (Dimensions.get("window").height > 700 ? 20 : 10),
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height > 700 ? 20 : 15,
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
  searchContainer: {
    marginBottom: height > 700 ? 20 : 15,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  locationIcon: {
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#667eea",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    fontSize: height > 700 ? 16 : 14,
    fontWeight: "700",
    color: "white",
    marginBottom: height > 700 ? 12 : 8,
    marginTop: height > 700 ? 8 : 5,
  },
});
