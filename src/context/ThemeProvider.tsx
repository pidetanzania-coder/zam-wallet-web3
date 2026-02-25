"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isSystem: boolean;
  setSystemPreference: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  isSystem: false,
  setSystemPreference: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSystem, setIsSystem] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("zam-theme") as Theme | null;
    const storedIsSystem = localStorage.getItem("zam-theme-source");
    
    // Default to light mode - check if user has a stored preference
    if (stored && storedIsSystem === "manual") {
      setThemeState(stored);
      setIsSystem(false);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      // Default to light mode (not system preference)
      setThemeState("light");
      setIsSystem(false);
      document.documentElement.classList.remove("dark");
    }
    
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setIsSystem(false);
    localStorage.setItem("zam-theme", newTheme);
    localStorage.setItem("zam-theme-source", "manual");
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const setSystemPreference = () => {
    setIsSystem(true);
    localStorage.setItem("zam-theme-source", "system");
    const systemTheme = getSystemTheme();
    setThemeState(systemTheme);
    document.documentElement.classList.toggle("dark", systemTheme === "dark");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isSystem, setSystemPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}
