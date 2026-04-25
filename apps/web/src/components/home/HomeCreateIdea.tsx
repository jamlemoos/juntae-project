const EXAMPLE_ROLES = ['dev front-end', 'dev back-end', 'designer de produto'];

export function HomeCreateIdea() {
  return (
    <section id="sua-vez" className="relative overflow-hidden border-t hairline bg-cream-2">
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 items-center gap-8 px-6 py-24 md:py-28">
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-4 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
            sua vez
          </div>
          <h2 className="display max-w-[16ch] text-[44px] font-bold leading-[1.02] md:text-[64px]">
            Você tem uma ideia <span className="serif font-medium text-accent">boa</span> parada em
            algum lugar?
          </h2>
          <p className="mt-6 max-w-lg text-[16.5px] leading-[1.6] text-ink-2">
            Conta pra gente em algumas frases. A gente te ajuda a formatar o convite e mostra pras
            pessoas certas. Sem pressão, sem prazo e dá pra voltar depois.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Contar minha ideia
            </button>
            <span className="text-[13.5px] text-mute">ou veja exemplos de convite</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="lift relative rounded-[28px] bg-cream-2 p-7 ring-1 ring-line">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-cream"
                style={{ background: '#2a2620' }}
                aria-hidden="true"
              >
                Vo
              </span>
              <div>
                <div className="text-[13px] font-medium">Você</div>
                <div className="text-[11.5px] text-mute">começando agora</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
                  o nome, por enquanto
                </div>
                <div className="rounded-xl bg-cream px-4 py-3 text-[15px] ring-1 ring-line">
                  App de grupos para hackathons
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
                  em uma frase
                </div>
                <div className="serif rounded-xl bg-cream px-4 py-3 text-[15px] text-ink-2 ring-1 ring-line">
                  "Queria criar um app pra ajudar pessoas a encontrarem times antes dos hackathons —
                  alguém topa?"
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
                  quem você procura
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_ROLES.map((x) => (
                    <span
                      key={x}
                      className="rounded-full bg-cream px-2.5 py-1 text-[12.5px] ring-1 ring-line"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
