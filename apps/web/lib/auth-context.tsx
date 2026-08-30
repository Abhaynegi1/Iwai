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
import { authClient } from "./neon-auth";

interface AuthContextType {
  user: UserEntity | null;
  token: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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

  // Initialize from Neon Auth or legacy storage on mount
  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Check for Neon Auth session
        try {
          const neonSession = await authClient.getSession();
          const sessionToken = neonSession?.data?.session?.token;
          if (sessionToken) {
            setClientToken(sessionToken);
            setToken(sessionToken);

            // Fetch profile & organization link from backend API
            const response = await api.auth.getMe();
            if (response.success && response.data) {
              setUser(response.data);
              setIsLoading(false);
              return;
            } else if (neonSession.data?.user) {
              // Fallback to Neon user object if getMe sync is pending
              const u = neonSession.data.user;
              setUser({
                id: u.id,
                email: u.email,
                name: u.name,
                avatarUrl: u.image || null,
                role: "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // Neon Auth check failed, check legacy localStorage
        }

        // 2. Legacy / fallback token in localStorage
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setClientToken(storedToken);
          setToken(storedToken);
          const response = await api.auth.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
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

  const loginWithGoogle = useCallback(async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    try {
      // Attempt Neon Auth email sign in first
      try {
        const result = await authClient.signIn.email({
          email: input.email,
          password: input.password,
        });

        const sessionToken = result?.data?.token;
        if (sessionToken) {
          setClientToken(sessionToken);
          setToken(sessionToken);
          const meRes = await api.auth.getMe();
          if (meRes.success && meRes.data) {
            setUser(meRes.data);
            return;
          }
        }
      } catch {
        // Fall back to direct API login
      }

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
      // Attempt Neon Auth sign up first
      try {
        const result = await authClient.signUp.email({
          email: input.email,
          password: input.password,
          name: input.name,
        });

        const sessionToken = result?.data?.token;
        if (sessionToken) {
          setClientToken(sessionToken);
          setToken(sessionToken);
          const meRes = await api.auth.getMe();
          if (meRes.success && meRes.data) {
            setUser(meRes.data);
            return;
          }
        }
      } catch {
        // Fall back to direct API registration
      }

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

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (err: unknown) {
      console.warn("Neon Auth sign out failed:", err);
    }
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
        loginWithGoogle,
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

