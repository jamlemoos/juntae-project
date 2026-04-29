import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { AccessRequiredPage } from '../pages/AccessRequiredPage';

export function AppLayout() {
  // TODO: replace with real session check when backend auth is ready.
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <AccessRequiredPage />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header variant="app" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
