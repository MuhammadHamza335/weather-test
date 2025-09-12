import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "app_theme_preference"; // values: "light" | "dark"

const ThemeContext = createContext({
  theme: "light",
  resolvedTheme: "light",
  setTheme: (_value) => {},
});

function getTimeBasedDefault() {
  const hour = new Date().getHours();
  // Day: 6AM-6:59PM -> light, Night otherwise -> dark
  return hour >= 6 && hour < 19 ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  // Load persisted or choose time-based default on first run
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setThemeState(stored);
        } else {
          const initial = getTimeBasedDefault();
          setThemeState(initial);
          await AsyncStorage.setItem(THEME_STORAGE_KEY, initial);
        }
      } catch {}
    })();
  }, []);

  const setTheme = useCallback(async (value) => {
    const next = value === "dark" ? "dark" : "light";
    setThemeState(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }, []);

  const resolvedTheme = theme; // kept for compatibility

  const contextValue = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
