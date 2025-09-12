import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import {
  useTemperature,
  convertTemperature,
} from "@/context/TemperatureContext";
import FavoriteButton from "./FavoriteButton";

function getThemeByWeather(weather) {
  const type = (weather || "").toLowerCase();
  if (type.includes("sun"))
    return {
      colors: ["#FFE259", "#FFA751"],
      fg: "#7A4E00",
      icon: "weather-sunny",
    };
  if (type.includes("rain"))
    return {
      colors: ["#4facfe", "#00f2fe"],
      fg: "#083A6B",
      icon: "weather-pouring",
    };
  if (type.includes("cloud"))
    return {
      colors: ["#bdc3c7", "#2c3e50"],
      fg: "#EDEFF2",
      icon: "weather-cloudy",
    };
  return {
    colors: ["#ECE9E6", "#FFFFFF"],
    fg: "#333333",
    icon: "weather-partly-cloudy",
  };
}

export default function WeatherCard({ data, showFavorite = true }) {
  const { unit } = useTemperature();
  const theme = useMemo(
    () => getThemeByWeather(data?.weather),
    [data?.weather]
  );
  const temp = useMemo(
    () => convertTemperature(data?.temperature ?? 0, unit),
    [data?.temperature, unit]
  );

  return (
    <Animated.View entering={FadeInUp.springify()} exiting={FadeOut}>
      <LinearGradient
        colors={theme.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name={theme.icon}
            color={theme.fg}
            size={28}
          />
          <Text style={[styles.city, { color: theme.fg }]}>{data?.city}</Text>
        </View>
        <Text style={[styles.temperature, { color: theme.fg }]}>
          {temp}°{unit}
        </Text>
        <Text style={[styles.weather, { color: theme.fg }]}>
          {data?.weather}
        </Text>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            name="water-percent"
            color={theme.fg}
            size={18}
          />
          <Text style={[styles.details, { color: theme.fg }]}>
            Humidity: {data?.humidity}%
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            name="weather-windy"
            color={theme.fg}
            size={18}
          />
          <Text style={[styles.details, { color: theme.fg }]}>
            Wind: {data?.windSpeed} km/h
          </Text>
        </View>
        {showFavorite && (
          <View style={styles.favoriteContainer}>
            <FavoriteButton city={data?.city} />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    padding: height > 700 ? 20 : 16,
    marginVertical: height > 700 ? 12 : 8,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  city: {
    fontSize: height > 700 ? 18 : 16,
    fontWeight: "600",
  },
  temperature: {
    fontSize: height > 700 ? 40 : 36,
    fontWeight: "800",
    marginTop: height > 700 ? 6 : 4,
  },
  weather: {
    fontSize: height > 700 ? 16 : 14,
    marginTop: 2,
  },
  details: {
    fontSize: height > 700 ? 13 : 12,
    marginLeft: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height > 700 ? 5 : 4,
  },
  favoriteContainer: {
    position: "absolute",
    bottom: height > 700 ? 16 : 12,
    right: height > 700 ? 16 : 12,
  },
});
