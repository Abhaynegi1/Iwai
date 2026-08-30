"use client";

import { createAuthClient } from "@neondatabase/auth/next";

export interface NeonAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NeonAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt?: Date;
}

export interface NeonAuthResponse<T = unknown> {
  data?: T | null;
  error?: { message?: string; status?: number; code?: string } | null;
}

export interface NeonAuthClient {
  signIn: {
    social: (options: {
      provider: "google" | "github" | string;
      callbackURL?: string;
    }) => Promise<NeonAuthResponse<{ url?: string; redirect?: boolean }>>;
    email: (credentials: {
      email: string;
      password: string;
    }) => Promise<NeonAuthResponse<{ token: string; user: NeonAuthUser }>>;
  };
  signUp: {
    email: (credentials: {
      email: string;
      password: string;
      name: string;
    }) => Promise<NeonAuthResponse<{ token: string; user: NeonAuthUser }>>;
  };
  signOut: () => Promise<NeonAuthResponse<{ success: boolean }>>;
  getSession: () => Promise<
    NeonAuthResponse<{
      session: NeonAuthSession;
      user: NeonAuthUser;
    }>
  >;
  useSession: () => {
    data?: { session: NeonAuthSession; user: NeonAuthUser } | null;
    isPending: boolean;
    error?: unknown;
  };
}

/**
 * Neon Auth client initialized for the Next.js web application.
 */
export const authClient: NeonAuthClient = createAuthClient() as unknown as NeonAuthClient;



