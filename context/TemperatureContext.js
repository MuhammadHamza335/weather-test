import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const TemperatureContext = createContext({ unit: "C", toggleUnit: () => {} });

export function TemperatureProvider({ children }) {
  const [unit, setUnit] = useState("C");

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  }, []);

  const value = useMemo(() => ({ unit, toggleUnit }), [unit, toggleUnit]);

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  return useContext(TemperatureContext);
}

export function convertTemperature(tempCelsius, unit) {
  if (unit === "F") {
    return Math.round((tempCelsius * 9) / 5 + 32);
  }
  return Math.round(tempCelsius);
}
