import { createContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '../constants/Colors';

interface ThemeContextType {
  colorScheme: 'light' | 'dark' | null;
  setColorScheme: (scheme: 'light' | 'dark' | null) => void;
  theme: typeof Colors.light | typeof Colors.dark;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | null>(
    Appearance.getColorScheme() || 'light'
  );

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
