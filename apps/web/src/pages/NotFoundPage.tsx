import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <span className="display text-[96px] font-bold leading-none text-line" aria-hidden="true">
        404
      </span>
      <h1 className="display mt-4 text-[28px] font-bold text-ink">Essa página não existe.</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-2">
        Parece que você se perdeu. A gente te leva de volta.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Voltar pra home
      </Link>
    </div>
  );
}
