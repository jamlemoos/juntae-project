import { ArrowIcon } from '../ui/ArrowIcon';

const steps = [
  {
    n: '01',
    title: 'Você entra ou cria um projeto',
    body: 'Explora os projetos abertos e pede pra entrar, ou conta sua própria ideia em algumas frases.',
  },
  {
    n: '02',
    title: 'Forma um time',
    body: 'A gente te conecta com pessoas que têm as habilidades que faltam — dev, design, produto, o que for.',
  },
  {
    n: '03',
    title: 'Começam a construir juntos',
    body: 'Com o time formado, vocês decidem o ritmo. Juntaê sai do caminho e deixa vocês construírem.',
  },
];

export function HomeHowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-t hairline bg-cream-2">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-24">
        <div className="mb-14 max-w-[640px]">
          <div className="mb-3 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
            como funciona
          </div>
          <h2 className="display text-[40px] font-bold leading-[1.02] md:text-[54px]">
            Da ideia ao time, <span className="text-accent">em três passos.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative col-span-12 md:col-span-4">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="display tnum text-[44px] font-bold leading-none text-accent">
                  {s.n}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className="relative -top-2.5 hidden h-px flex-1 bg-line-2 md:block"
                    aria-hidden="true"
                  />
                )}
              </div>
              <h3 className="display mb-2 text-[22px] font-semibold leading-[1.2]">{s.title}</h3>
              <p className="max-w-[36ch] text-[15px] leading-[1.55] text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-8">
          <p className="max-w-lg text-[14.5px] text-ink-2">
            É de graça pra sempre pra quem constrói. A gente só está começando, então entra junto.
          </p>
          <a
            href="#sua-vez"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Criar um projeto <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
