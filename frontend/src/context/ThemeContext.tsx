import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'dark' | 'light' | 'navy' | 'terminal';
export type DensityType = 'compact' | 'normal' | 'spacious';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  density: DensityType;
  setDensity: (density: DensityType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  strictAirGap: boolean;
  setStrictAirGap: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('kavach_theme') as ThemeType) || 'dark';
  });

  const [density, setDensityState] = useState<DensityType>(() => {
    return (localStorage.getItem('kavach_density') as DensityType) || 'normal';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('kavach_sound') !== 'false';
  });

  const [strictAirGap, setStrictAirGapState] = useState<boolean>(() => {
    return localStorage.getItem('kavach_strict_airgap') !== 'false';
  });

  const isDark = theme !== 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('kavach_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', density);
    localStorage.setItem('kavach_density', density);
  }, [density]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const toggleDarkMode = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setDensity = (newDensity: DensityType) => {
    setDensityState(newDensity);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    localStorage.setItem('kavach_sound', String(val));
  };

  const setStrictAirGap = (val: boolean) => {
    setStrictAirGapState(val);
    localStorage.setItem('kavach_strict_airgap', String(val));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggleDarkMode,
        density,
        setDensity,
        soundEnabled,
        setSoundEnabled,
        strictAirGap,
        setStrictAirGap,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
