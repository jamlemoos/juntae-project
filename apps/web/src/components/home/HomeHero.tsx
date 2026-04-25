import { ArrowIcon } from '../ui/ArrowIcon';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden paper-tex">
      <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-20 md:pb-28 md:pt-24">
        <div className="max-w-[960px]">
          <h1 className="display text-[56px] font-bold leading-[1.0] text-ink md:text-[80px] lg:text-[92px]">
            Tire sua ideia do papel <span className="text-accent">com um time.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.6] text-ink-2">
            Juntaê ajuda você a encontrar pessoas pra construir junto, um projeto de fim de semana,
            uma ONG, um MVP. Conta o que você quer fazer e a gente te conecta com quem topa.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Criar um projeto
              <ArrowIcon />
            </button>
            <a href="#como-funciona" className="ulink text-[14px] font-medium text-ink-2">
              ou veja como funciona →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
