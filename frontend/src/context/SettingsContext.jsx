import { createContext, useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "app-settings";

const DEFAULT_SETTINGS = {
  theme: "light",
  density: "normal",
  notifications: true,
};

export const SettingsContext = createContext(null);

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      density: parsed.density === "compact" ? "compact" : "normal",
      notifications: typeof parsed.notifications === "boolean" ? parsed.notifications : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function applyThemeClass(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function applyDensityClass(density) {
  if (density === "compact") {
    document.documentElement.classList.add("density-compact");
  } else {
    document.documentElement.classList.remove("density-compact");
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const initial = loadSettings();
    applyThemeClass(initial.theme);
    applyDensityClass(initial.density);
    return initial;
  });

  const setTheme = useCallback((theme) => {
    setSettings((prev) => {
      const next = { ...prev, theme };
      saveSettings(next);
      applyThemeClass(theme);
      return next;
    });
  }, []);

  const setDensity = useCallback((density) => {
    setSettings((prev) => {
      const next = { ...prev, density };
      saveSettings(next);
      applyDensityClass(density);
      return next;
    });
  }, []);

  const setNotifications = useCallback((enabled) => {
    setSettings((prev) => {
      const next = { ...prev, notifications: enabled };
      saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: settings.theme,
      density: settings.density,
      notifications: settings.notifications,
      setTheme,
      setDensity,
      setNotifications,
    }),
    [settings, setTheme, setDensity, setNotifications]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
