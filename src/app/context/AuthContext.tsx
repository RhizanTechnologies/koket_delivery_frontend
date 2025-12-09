"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "@/app/utils/cookies";

type User = {
  id: string;
  role: "customer" | "admin";
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (
    userData: User,
    tokens?: { accessToken: string; refreshToken?: string }
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    try {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
      // Clear invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (
    userData: User,
    tokens?: { accessToken: string; refreshToken?: string }
  ) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (tokens) {
      localStorage.setItem("accessToken", tokens.accessToken);
      // Also set cookies for middleware access
      setCookie("accessToken", tokens.accessToken, 7);
      
      if (tokens.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setCookie("refreshToken", tokens.refreshToken, 30);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    // Also delete cookies
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
