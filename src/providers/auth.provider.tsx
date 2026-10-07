"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Role, User } from "@/interfaces";
import {
  isAuthenticated as checkIsAuthenticated,
  getAuthToken,
  getStoredUser,
  logoutUser,
  setAuthToken,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuth = useCallback(() => {
    const currentToken = getAuthToken();
    const currentUser = getStoredUser<User>();
    setToken(currentToken);
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    syncAuth();

    const handleAuthChange = () => {
      syncAuth();
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [syncAuth]);

  const login = useCallback((newToken: string, newUser: User) => {
    setAuthToken(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated: checkIsAuthenticated(),
    isLoading: loading,
    login,
    logout,
    refresh: syncAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
