import { Link, Outlet } from '@tanstack/react-router';
import { AccessRequiredPage } from '../pages/AccessRequiredPage';

export function AppLayout() {
  // TODO: replace with real session check when backend auth is ready.
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <AccessRequiredPage />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b hairline bg-cream-2/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="display flex items-center gap-1 text-[19px] font-extrabold tracking-tight text-ink"
            >
              Juntaê
              <span className="serif relative -top-0.5 text-[23px] leading-none text-accent">
                ,
              </span>
            </Link>
            <nav
              className="hidden items-center gap-6 text-[13.5px] md:flex"
              aria-label="Navegação do app"
            >
              <Link to="/projects" className="ulink text-ink-2">
                Projetos
              </Link>
              <Link to="/projects/new" className="ulink text-ink-2">
                Novo projeto
              </Link>
            </nav>
          </div>
          <Link to="/profile" className="ulink text-[13.5px] text-ink-2">
            Perfil
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
