// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeContext, themes, Theme, ThemeName, getSavedTheme, saveTheme } from "@/utils/theme";

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
} | null;

// Auth context type
type AuthContextType = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook for auth access
export const useAuth = () => useContext(AuthContext);

// LocalStorage Keys
const USER_STORAGE_KEY = 'banyan_user';
// Removed unused POSTS_STORAGE_KEY

export default function App({ Component, pageProps }: AppProps) {
  // Auth state
  const [user, setUser] = useState<User>(null);
  
  // Theme state
  const [theme, setThemeState] = useState<Theme>(themes.default);
  
  // Initialize from localStorage
  useEffect(() => {
    try {
      // Restore user state
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Restoring user login state:", parsedUser);
        setUser(parsedUser);
      }
      
      // Restore theme
      const savedThemeName = getSavedTheme();
      setThemeState(themes[savedThemeName]);
      
    } catch (error) {
      console.error("Error restoring state from localStorage:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  // Login function
  const login = (userData: User) => {
    console.log("Logging in user:", userData);
    setUser(userData);
    // Save user state to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    console.log("User logging out");
    setUser(null);
    // Clear user state from localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
  };
  
  // Theme change function
  const setTheme = (themeName: ThemeName) => {
    setThemeState(themes[themeName]);
    saveTheme(themeName);
  };

  // Auth context value
  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
  
  // Theme context value
  const themeContextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}