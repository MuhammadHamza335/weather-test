import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCHES_KEY = "recentSearches";
const FAVORITES_KEY = "favoriteCities";
const LAST_SEARCH_KEY = "lastSearch";

export async function getRecentSearches() {
  const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addRecentSearch(city) {
  const searches = await getRecentSearches();
  const updated = [
    city,
    ...searches.filter((c) => c.toLowerCase() !== city.toLowerCase()),
  ].slice(0, 5);
  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
}

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addFavorite(city) {
  const favorites = await getFavorites();
  if (!favorites.map((c) => c.toLowerCase()).includes(city.toLowerCase())) {
    const updated = [...favorites, city];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
  return favorites;
}

export async function removeFavorite(city) {
  const favorites = await getFavorites();
  const updated = favorites.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function getLastSearch() {
  const raw = await AsyncStorage.getItem(LAST_SEARCH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setLastSearch(data) {
  await AsyncStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(data));
}
