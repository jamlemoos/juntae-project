import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { HomePage } from '../../../pages/HomePage';

export function HomeRoute() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const hasInitialized = useAuth((s) => s.hasInitialized);
  const isInitializingAuth = useAuth((s) => s.isInitializingAuth);
  const initializeAuth = useAuth((s) => s.initializeAuth);
  const navigate = useNavigate();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (hasInitialized && isAuthenticated) {
      void navigate({ to: '/explore', replace: true });
    }
  }, [hasInitialized, isAuthenticated, navigate]);

  if (!hasInitialized || isInitializingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-mute">Carregando…</span>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <HomePage />;
}
