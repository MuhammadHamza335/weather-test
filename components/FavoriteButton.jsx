import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { addFavorite, getFavorites, removeFavorite } from "@/utils/storage";

export default function FavoriteButton({ city }) {
  const [isFav, setIsFav] = useState(false);
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  const checkFavoriteStatus = useCallback(async () => {
    if (!city) return;
    const favs = await getFavorites();
    const isCurrentlyFav = favs
      .map((c) => c.toLowerCase())
      .includes(city.toLowerCase());
    setIsFav(isCurrentlyFav);
  }, [city]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  useFocusEffect(
    useCallback(() => {
      checkFavoriteStatus();
    }, [checkFavoriteStatus])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleValue.value },
        { rotate: `${rotateValue.value}deg` },
      ],
    };
  });

  const toggle = useCallback(async () => {
    if (!city) return;

    scaleValue.value = withSequence(
      withSpring(0.8),
      withSpring(1.2),
      withSpring(1)
    );
    rotateValue.value = withSpring(isFav ? 0 : 360);

    if (isFav) {
      await removeFavorite(city);
    } else {
      await addFavorite(city);
    }

    await checkFavoriteStatus();
  }, [city, isFav, scaleValue, rotateValue, checkFavoriteStatus]);

  return (
    <TouchableOpacity
      style={[styles.button, isFav && styles.favorited]}
      onPress={toggle}
    >
      <Animated.View style={animatedStyle}>
        <MaterialIcons
          name={isFav ? "star" : "star-border"}
          size={26}
          color={isFav ? "#FF8C00" : "#667eea"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  favorited: {
    backgroundColor: "rgba(255, 215, 0, 0.95)",
    borderColor: "#FFD700",
  },
});
