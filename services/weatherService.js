import { Platform } from "react-native";
import Constants from "expo-constants";
import axios from "axios";

function getBaseUrl() {
  const expoManifest = Constants?.expoConfig || Constants?.manifest;
  const hostUri =
    expoManifest?.hostUri ||
    (expoManifest?.extra && expoManifest.extra.hostUri);
  if (hostUri && hostUri.includes(":")) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:3000`;
  }

  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
}

const api = axios.create({ baseURL: getBaseUrl() });

export async function fetchWeatherByCity(city) {
  const search = String(city || "")
    .trim()
    .toLowerCase();
  const res = await api.get(`/weatherData`);
  const list = Array.isArray(res.data) ? res.data : [];
  const match = list.find(
    (item) => String(item.city || "").toLowerCase() === search
  );
  if (!match) {
    const error = new Error("No data for this city");
    error.code = "CITY_NOT_FOUND";
    throw error;
  }
  return match;
}

export async function fetchAllCities() {
  const res = await api.get(`/weatherData`);
  return res.data;
}

export { api };
