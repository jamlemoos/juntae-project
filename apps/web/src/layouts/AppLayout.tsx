import { Link, Outlet } from '@tanstack/react-router';
import { AccessRequiredPage } from '../pages/AccessRequiredPage';

export function AppLayout() {
  // TODO: replace with real session check when backend auth is ready.
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <AccessRequiredPage />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b hairline bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="display flex items-center gap-1.5 text-[22px] font-extrabold tracking-tight text-ink"
            >
              Juntaê
              <span className="serif relative -top-0.5 text-[26px] leading-none text-accent">
                ,
              </span>
            </Link>
            <nav
              className="hidden items-center gap-7 text-[14px] md:flex"
              aria-label="Navegação do app"
            >
              <Link to="/projects" className="ulink text-ink-2">
                Projetos
              </Link>
              <span className="text-ink-2">Mensagens</span>
              <span className="text-ink-2">Meus times</span>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[13.5px]">
            <Link to="/projects/new" className="ulink hidden text-ink-2 sm:inline">
              Começar projeto
            </Link>
            <span className="hidden h-4 w-px bg-line sm:inline" />
            <Link to="/profile" className="flex items-center gap-2.5">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink-2 text-[11px] font-semibold text-cream">
                ?
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
