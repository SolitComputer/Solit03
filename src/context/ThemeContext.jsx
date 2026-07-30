import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("solit03-theme") || "system";
  });

  useEffect(() => {
    const applyTheme = (t) => {
      // Add transition class before changing classes
      document.documentElement.classList.add("theme-transition");
      
      const isDark =
        t === "dark" ||
        (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (isDark) {
        document.documentElement.classList.add("dark");
        document.getElementById("theme-color-meta")?.setAttribute("content", "#0f172a");
      } else {
        document.documentElement.classList.remove("dark");
        document.getElementById("theme-color-meta")?.setAttribute("content", "#ffffff");
      }

      // Remove transition class after animation completes
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    };

    applyTheme(theme);
    
    if (theme === "system") {
      localStorage.removeItem("solit03-theme");
    } else {
      localStorage.setItem("solit03-theme", theme);
    }

    // Sync across tabs
    const handleStorage = (e) => {
      if (e.key === "solit03-theme") {
        setTheme(e.newValue || "system");
      }
    };
    
    // Handle system preference change
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") applyTheme("system");
    };

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
