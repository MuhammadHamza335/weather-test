import { useEffect, useMemo, useState } from "react";

function getSchemeByTime() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6 ? "light" : "light";
}

export function useColorScheme() {
  const [scheme, setScheme] = useState(getSchemeByTime());

  useEffect(() => {
    const id = setInterval(() => {
      setScheme(getSchemeByTime());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => scheme, [scheme]);
}
