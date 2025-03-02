// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useContext, useState, useEffect } from "react";

// 使用者型別定義
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
} | null;

// 認證上下文型別
type AuthContextType = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

// 建立認證上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// 自定義 Hook 提供易用的認證狀態訪問
export const useAuth = () => useContext(AuthContext);

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>(null);
  
  // 從 localStorage 檢查使用者是否已登入
  useEffect(() => {
    try {
      // 從本地儲存中恢復使用者狀態
      const storedUser = localStorage.getItem("banyan_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("恢復使用者登入狀態:", parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("從本地儲存中恢復使用者狀態時發生錯誤:", error);
      localStorage.removeItem("banyan_user");
    }
  }, []);

  // 登入功能
  const login = (userData: User) => {
    console.log("登入使用者:", userData);
    setUser(userData);
    // 保存使用者狀態到本地儲存
    localStorage.setItem("banyan_user", JSON.stringify(userData));
  };

  // 登出功能
  const logout = () => {
    console.log("使用者登出");
    setUser(null);
    // 從本地儲存中清除使用者狀態
    localStorage.removeItem("banyan_user");
  };

  // 提供認證資訊給所有子組件
  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}