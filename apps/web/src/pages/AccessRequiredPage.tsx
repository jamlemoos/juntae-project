import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export function AccessRequiredPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 paper-tex">
      <div className="w-full max-w-sm text-center">
        <Link
          to="/"
          className="display mb-12 inline-flex items-center gap-1.5 text-[22px] font-extrabold tracking-tight text-ink"
        >
          Juntaê
          <span className="serif relative -top-0.5 text-[26px] leading-none text-primary">,</span>
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
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Entrar <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/register"
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full text-[15px] font-medium text-ink ring-1 ring-line-2 transition-colors hover:border-primary/30 hover:bg-cream-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
