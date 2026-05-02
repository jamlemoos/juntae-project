import { useAuthStore } from '../store/authStore';

type AuthState = ReturnType<typeof useAuthStore.getState>;

const identitySelector = (state: AuthState): AuthState => state;

export function useAuth(): AuthState;
export function useAuth<TSelected>(selector: (state: AuthState) => TSelected): TSelected;
export function useAuth<TSelected = AuthState>(
  selector?: (state: AuthState) => TSelected
): TSelected {
  return useAuthStore((selector ?? identitySelector) as (state: AuthState) => TSelected);
}
