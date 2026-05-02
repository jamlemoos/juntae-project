import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../api/endpoints';
import { getMe } from '../../users/api/endpoints';
import { ApiError, TOKEN_KEY } from '../../../shared/api/http';
import { queryClient } from '../../../shared/api/queryClient';
import type { UserResponse } from '../../users/api/types';

type AuthState = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isInitializingAuth: boolean;
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
  isInitializingAuth: false,
  hasInitialized: false,
  initError: null,

  initializeAuth: async () => {
    // Guard against duplicate calls (Strict Mode double-invoke, concurrent navigations).
    if (get().hasInitialized || get().isInitializingAuth) return;

    if (!localStorage.getItem(TOKEN_KEY)) {
      set({
        user: null,
        isAuthenticated: false,
        isInitializingAuth: false,
        hasInitialized: true,
        initError: null,
      });
      return;
    }

    set({ isInitializingAuth: true, initError: null });
    try {
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isInitializingAuth: false,
        hasInitialized: true,
        initError: null,
      });
    } catch (err) {
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.status === 403 || err.status === 404)
      ) {
        // Non-retryable: the current session is invalid or the resource is gone — log out locally.
        logoutApi();
        queryClient.clear();
        set({
          user: null,
          isAuthenticated: false,
          isInitializingAuth: false,
          hasInitialized: true,
          initError: null,
        });
      } else if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        // Transient failure (network or server error) — do NOT remove the token or mark
        // as initialized so initializeAuth can be retried by a future call, such as the retry button.
        set({
          user: null,
          isAuthenticated: false,
          isInitializingAuth: false,
          initError: 'Não foi possível validar sua sessão. Tente novamente.',
        });
      } else {
        // Unexpected error — treat as retryable: keep the token so the user can try again.
        set({
          user: null,
          isAuthenticated: false,
          isInitializingAuth: false,
          initError: 'Não foi possível validar sua sessão. Tente novamente.',
        });
      }
    }
  },

  login: async (email: string, password: string) => {
    // loginApi stores the token; user comes directly from the response — no extra getMe call.
    const { user } = await loginApi({ email, password });
    // Clear stale cache from any previous session before setting the new user so that
    // isOwner/hasApplied data from another account cannot bleed into this session.
    queryClient.clear();
    set({
      user,
      isAuthenticated: true,
      isInitializingAuth: false,
      hasInitialized: true,
      initError: null,
    });
  },

  logout: () => {
    logoutApi();
    queryClient.clear();
    set({
      user: null,
      isAuthenticated: false,
      isInitializingAuth: false,
      hasInitialized: true,
      initError: null,
    });
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
