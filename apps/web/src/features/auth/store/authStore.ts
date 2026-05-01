import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../api/endpoints';
import { getMe } from '../../users/api/endpoints';
import { ApiError, TOKEN_KEY } from '../../../shared/api/http';
import type { UserResponse } from '../../users/api/types';

type AuthState = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasInitialized: false,

  initializeAuth: async () => {
    if (get().hasInitialized) return;

    if (!localStorage.getItem(TOKEN_KEY)) {
      set({ hasInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logoutApi();
      }
      set({ user: null, isAuthenticated: false, isLoading: false, hasInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ error: null });
    // loginApi stores the token; user comes directly from the response — no extra getMe call.
    const { user } = await loginApi({ email, password });
    set({ user, isAuthenticated: true, hasInitialized: true });
  },

  logout: () => {
    logoutApi();
    set({ user: null, isAuthenticated: false, error: null });
  },

  refreshUser: async () => {
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logoutApi();
        set({ user: null, isAuthenticated: false, error: null });
      }
    }
  },
}));
