import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../api/endpoints';
import { getMe } from '../../users/api/endpoints';
import { ApiError, TOKEN_KEY } from '../../../shared/api/http';
import type { UserResponse } from '../../users/api/types';

type AuthState = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  initError: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasInitialized: false,
  initError: null,

  initializeAuth: async () => {
    // Guard against duplicate calls (Strict Mode double-invoke, concurrent navigations).
    if (get().hasInitialized || get().isLoading) return;

    if (!localStorage.getItem(TOKEN_KEY)) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasInitialized: true,
        initError: null,
      });
      return;
    }

    set({ isLoading: true, initError: null });
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true, initError: null });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Definitively rejected — clear token and mark as done.
        logoutApi();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          hasInitialized: true,
          initError: null,
        });
      } else if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        // Transient failure (network or server error) — do NOT remove the token or mark
        // as initialized so initializeAuth can be retried when the app reconnects.
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          initError: 'Não foi possível validar sua sessão. Tente novamente.',
        });
      } else {
        // Unexpected error — treat as permanent, but do not force logout.
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          hasInitialized: true,
          initError: null,
        });
      }
    }
  },

  login: async (email: string, password: string) => {
    // loginApi stores the token; user comes directly from the response — no extra getMe call.
    const { user } = await loginApi({ email, password });
    set({ user, isAuthenticated: true, hasInitialized: true });
  },

  logout: () => {
    logoutApi();
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logoutApi();
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));
