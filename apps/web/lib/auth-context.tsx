"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { UserEntity } from "@iwai/shared";
import type { LoginInput, RegisterInput } from "@iwai/validation";
import { api, setClientToken } from "./api";

interface AuthContextType {
  user: UserEntity | null;
  token: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "iwai_organizer_token";
const REFRESH_TOKEN_KEY = "iwai_organizer_refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setClientToken(null);
    setToken(null);
    setUser(null);
  }, []);

  // Initialize from storage on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setClientToken(storedToken);
          setToken(storedToken);
          const response = await api.auth.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token might be expired
            clearSession();
          }
        }
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [clearSession]);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(input);
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        localStorage.setItem(TOKEN_KEY, tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
        setClientToken(tokens.accessToken);
        setToken(tokens.accessToken);
        setUser(userData);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register(input);
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        localStorage.setItem(TOKEN_KEY, tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
        setClientToken(tokens.accessToken);
        setToken(tokens.accessToken);
        setUser(userData);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    window.location.href = "/login";
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
