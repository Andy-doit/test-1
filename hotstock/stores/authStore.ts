"use client";

import { create } from "zustand";
import type { User } from "@/types/iAccount";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// FIX: Removed localStorage persistence to prevent XSS token theft.
// Auth state is now session-only. Tokens live in httpOnly cookies (server-set).
// The store holds only the in-memory user object for UI rendering.
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
