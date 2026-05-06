import { Outlet } from '@tanstack/react-router';
import { PublicOnlyRoute } from '../features/auth/components/PublicOnlyRoute';

export function AuthLayout() {
  return (
    <PublicOnlyRoute>
      <Outlet />
    </PublicOnlyRoute>
  );
}
