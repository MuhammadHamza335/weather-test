import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

export default function RecentSearchList({ items, onSelect }) {
  const data = useMemo(() => (items ?? []).slice(0, 3), [items]);

  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="search-off"
          size={32}
          color="rgba(255, 255, 255, 0.5)"
        />
        <Text style={styles.emptyText}>No recent searches</Text>
      </View>
    );
  }

  return (
    <View>
      {data.map((item, index) => (
        <React.Fragment key={item}>
          <Animated.View entering={FadeInRight.delay(index * 100)}>
            <TouchableOpacity
              onPress={() => onSelect?.(item)}
              style={styles.recentItem}
            >
              <MaterialIcons
                name="history"
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.recentText}>{item}</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color="rgba(255, 255, 255, 0.5)"
              />
            </TouchableOpacity>
          </Animated.View>
          {index < data.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: height > 700 ? 10 : 8,
    borderRadius: 10,
    marginVertical: 1,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  recentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: height > 700 ? 14 : 13,
    color: "white",
    fontWeight: "500",
  },
  separator: {
    height: height > 700 ? 3 : 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: height > 700 ? 15 : 10,
    opacity: 0.7,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: height > 700 ? 13 : 12,
    marginTop: 6,
    fontWeight: "500",
  },
});
