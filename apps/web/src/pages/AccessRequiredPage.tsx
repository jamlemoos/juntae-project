import { Link } from '@tanstack/react-router';
import { ArrowIcon } from '../components/ui/ArrowIcon';

export function AccessRequiredPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 paper-tex">
      <div className="w-full max-w-sm text-center">
        <Link
          to="/"
          className="display mb-12 inline-flex items-center gap-1.5 text-[22px] font-extrabold tracking-tight text-ink"
        >
          Juntaê
          <span className="serif relative -top-0.5 text-[26px] leading-none text-accent">,</span>
        </Link>
        <h1 className="display text-[28px] font-bold leading-tight text-ink">
          Entre para ver projetos e formar times.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          Projetos e oportunidades são visíveis apenas para membros.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Entrar <ArrowIcon />
          </Link>
          <Link
            to="/register"
            className="inline-flex h-12 items-center justify-center rounded-full text-[15px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
