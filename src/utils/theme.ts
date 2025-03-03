// src/utils/theme.ts
import { createContext, useContext } from 'react';

// Define theme types
export type ThemeName = 'default' | 'retro' | 'neon' | 'cool';

// Theme interface
export interface Theme {
  name: ThemeName;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
  secondaryColor: string;
  highlightColor: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  altTextColor: string;
  altBgColor: string;
}

// Theme definitions
export const themes: Record<ThemeName, Theme> = {
  default: {
    name: 'default',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    accentColor: '#4ECDC4',
    secondaryColor: '#FFD166',
    highlightColor: '#FF6B6B',
    borderColor: '#000000',
    buttonBgColor: '#000000',
    buttonTextColor: '#FFFFFF',
    altTextColor: '#4ECDC4',
    altBgColor: '#F0FFFE',
  },
  retro: {
    name: 'retro',
    textColor: '#3A3335',
    backgroundColor: '#F6F1E9',
    accentColor: '#E09F3E',
    secondaryColor: '#9E2A2B',
    highlightColor: '#D90429',
    borderColor: '#3A3335',
    buttonBgColor: '#3A3335',
    buttonTextColor: '#F6F1E9',
    altTextColor: '#9E2A2B',
    altBgColor: '#F9EFE2',
  },
  neon: {
    name: 'neon',
    textColor: '#151515',
    backgroundColor: '#FFFFFF',
    accentColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    highlightColor: '#FFFF00',
    borderColor: '#151515',
    buttonBgColor: '#151515',
    buttonTextColor: '#FFFFFF',
    altTextColor: '#FF00FF',
    altBgColor: '#FFEBFF',
  },
  cool: {
    name: 'cool',
    textColor: '#1D3557',
    backgroundColor: '#F1FAEE',
    accentColor: '#457B9D',
    secondaryColor: '#2AB7CA',
    highlightColor: '#E63946',
    borderColor: '#1D3557',
    buttonBgColor: '#1D3557',
    buttonTextColor: '#F1FAEE',
    altTextColor: '#457B9D',
    altBgColor: '#E6F2FA',
  },
};

// Context for theme
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (themeName: ThemeName) => void;
}>({
  theme: themes.default,
  setTheme: () => {},
});

// Hook to use theme
export const useTheme = () => useContext(ThemeContext);

// localStorage key for theme
export const THEME_STORAGE_KEY = 'banyan_theme';

// Function to get theme from localStorage
export const getSavedTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'default';
  
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return (savedTheme as ThemeName) || 'default';
};

// Function to save theme to localStorage
export const saveTheme = (themeName: ThemeName): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
};