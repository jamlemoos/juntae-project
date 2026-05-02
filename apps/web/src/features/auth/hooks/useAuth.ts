import { useAuthStore } from '../store/authStore';

type AuthState = ReturnType<typeof useAuthStore.getState>;

export function useAuth<TSelected = AuthState>(
  selector?: (state: AuthState) => TSelected
): TSelected {
  return useAuthStore(selector ?? ((state) => state as TSelected));
}
