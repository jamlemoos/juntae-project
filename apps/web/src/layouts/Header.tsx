import { Link } from '@tanstack/react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

interface HeaderProps {
  variant: 'home' | 'login' | 'register' | 'app';
}

export function Header({ variant }: HeaderProps) {
  const user = useAuth((s) => s.user);
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="display flex items-center gap-1.5 text-[22px] font-extrabold tracking-tight text-ink"
          >
            Juntaê
            <span className="serif relative -top-0.5 text-[26px] leading-none text-accent">,</span>
          </Link>
          {variant === 'app' ? (
            <nav
              className="hidden items-center gap-7 text-[14px] md:flex"
              aria-label="Navegação do app"
            >
              <Link to="/explore" className="ulink text-ink-2">
                Explorar
              </Link>
              <Link to="/projects" className="ulink text-ink-2">
                Projetos
              </Link>
            </nav>
          ) : (
            <nav
              className="hidden items-center gap-7 text-[14px] md:flex"
              aria-label="Navegação principal"
            >
              <Link to="/" hash="como-funciona" className="ulink text-ink-2">
                Como funciona
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {variant === 'app' && (
            <div className="flex items-center gap-4 text-[13.5px]">
              <Link to="/projects/new" className="ulink hidden text-ink-2 sm:inline">
                Começar projeto
              </Link>
              <span className="hidden h-4 w-px bg-line sm:inline" />
              <Link to="/profile" aria-label="Meu perfil" className="flex items-center gap-2.5">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink-2 text-[11px] font-semibold text-cream">
                  {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
              </Link>
            </div>
          )}
          {variant === 'home' && (
            <>
              <Link to="/login" className="ulink text-[13px] text-ink-2">
                Entrar
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Criar conta
              </Link>
            </>
          )}
          {variant === 'login' && (
            <div className="flex items-center gap-3 text-[13.5px]">
              <span className="hidden text-mute sm:inline">novo por aqui?</span>
              <Link to="/register" className="ulink font-medium text-ink">
                criar conta
              </Link>
            </div>
          )}
          {variant === 'register' && (
            <div className="flex items-center gap-3 text-[13.5px]">
              <span className="hidden text-mute sm:inline">já tem conta?</span>
              <Link to="/login" className="ulink font-medium text-ink">
                entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
