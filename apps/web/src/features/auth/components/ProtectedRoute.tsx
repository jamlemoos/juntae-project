import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isLoading = useAuth((s) => s.isLoading);
  const hasInitialized = useAuth((s) => s.hasInitialized);
  const initializeAuth = useAuth((s) => s.initializeAuth);
  const navigate = useNavigate();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (hasInitialized && !isAuthenticated) {
      void navigate({ to: '/login' });
    }
  }, [hasInitialized, isAuthenticated, navigate]);

  if (!hasInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="text-sm text-mute">Carregando…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
