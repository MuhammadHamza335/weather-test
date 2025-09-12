import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWeatherByCity } from "@/services/weatherService";
import { getLastSearch, setLastSearch } from "@/utils/storage";
import WeatherCard from "@/components/WeatherCard";

export default function WeatherDisplay({ city }) {
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => sub?.();
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const result = await fetchWeatherByCity(city);
      await setLastSearch(result);
      return result;
    },
    enabled: !!city && !isOffline,
    retry: (failureCount, error) => {
      // Don't retry if city not found
      if (error?.code === "CITY_NOT_FOUND") {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  const [cached, setCached] = useState(null);

  useEffect(() => {
    (async () => {
      const last = await getLastSearch();
      setCached(last);
    })();
  }, [city]);

  if (isLoading) {
    const validCached =
      cached && cached.city && cached.city.toLowerCase() === city.toLowerCase();

    if (!validCached) {
      return <ActivityIndicator />;
    }
  }

  if (isError) {
    return (
      <View
        style={{
          backgroundColor: "#fee2e2",
          borderColor: "#fca5a5",
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          margin: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          No data found
        </Text>
        <Text
          style={{
            color: "#7f1d1d",
            fontSize: 14,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          The city "{city}" is not available in our database.
        </Text>
      </View>
    );
  }

  // Only use cached data if it's for the same city
  const validCached =
    cached && cached.city && cached.city.toLowerCase() === city.toLowerCase();
  const shown = data || (validCached ? cached : null);

  if (!shown) {
    return (
      <View
        style={{
          backgroundColor: "#fee2e2",
          borderColor: "#fca5a5",
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          margin: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          No data found
        </Text>
      </View>
    );
  }

  return (
    <View>
      <WeatherCard data={shown} />
      {isOffline ? (
        <View style={{ paddingVertical: 8 }}>
          <Text>Offline. Showing last saved data.</Text>
        </View>
      ) : null}
    </View>
  );
}
