import { useEffect, type ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { useAuth } from '../features/auth/hooks/useAuth';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const initializeAuth = useAuth((s) => s.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header variant="home" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
