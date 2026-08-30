import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const STORAGE_KEY = 'themeMode';

const ThemeContext = createContext({
  mode: 'light',
  setMode: () => {},
  colors: lightColors,
  ready: false,
});

/**
 * Holds the light / dark preference and persists it. The palette is exposed
 * as `colors` so screens can migrate to it over time; today most screens
 * still import the static `constants/colors` (light) directly, so flipping
 * the toggle only changes screens that have been converted.
 */
export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (stored === 'light' || stored === 'dark') setModeState(stored);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const setMode = next => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const value = {
    mode,
    setMode,
    colors: mode === 'dark' ? darkColors : lightColors,
    ready,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
