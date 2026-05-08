import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isInitializingAuth = useAuth((s) => s.isInitializingAuth);
  const hasInitialized = useAuth((s) => s.hasInitialized);
  const initError = useAuth((s) => s.initError);
  const initializeAuth = useAuth((s) => s.initializeAuth);
  const navigate = useNavigate();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (hasInitialized && !isAuthenticated) {
      void navigate({ to: '/login', replace: true });
    }
  }, [hasInitialized, isAuthenticated, navigate]);

  if (isInitializingAuth || (!hasInitialized && !initError)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="text-sm text-mute">Carregando…</span>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
        <p className="text-sm text-mute">{initError}</p>
        <button
          onClick={() => void initializeAuth()}
          className="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-cream"
      >
        <span className="text-sm text-mute">Redirecionando para o login…</span>
      </div>
    );
  }

  return <>{children}</>;
}
