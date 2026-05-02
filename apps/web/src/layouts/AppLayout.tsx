import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

export function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cream">
        <Header variant="app" />
        <main>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
