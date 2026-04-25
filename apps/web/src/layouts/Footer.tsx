export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="display text-[64px] font-bold leading-[0.95] tracking-tight md:text-[80px]">
              Juntaê
              <span className="serif font-normal text-accent">,</span>
            </div>
            <p className="mt-4 max-w-md text-[15px] text-white/60">
              Um lugar calmo pra encontrar quem topa construir junto.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="mb-3 text-[11.5px] font-medium uppercase tracking-[.2em] text-white/40">
              a gente
            </div>
            <ul className="space-y-2 text-[14px] text-white/85">
              <li>
                <a href="#" className="ulink">
                  Manifesto
                </a>
              </li>
              <li>
                <a href="#" className="ulink">
                  Comunidade
                </a>
              </li>
              <li>
                <a href="#" className="ulink">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="mb-3 text-[11.5px] font-medium uppercase tracking-[.2em] text-white/40">
              explorar
            </div>
            <ul className="space-y-2 text-[14px] text-white/85">
              <li>
                <a href="#projetos" className="ulink">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="ulink">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#" className="ulink">
                  Criar projeto
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="mb-3 text-[11.5px] font-medium uppercase tracking-[.2em] text-white/40">
              legal
            </div>
            <ul className="space-y-2 text-[14px] text-white/85">
              <li>
                <a href="#" className="ulink">
                  Termos
                </a>
              </li>
              <li>
                <a href="#" className="ulink">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/50">
          <span>© 2026 Juntaê · feito devagar, no Nordeste</span>
          <span className="serif text-white/70">até logo 👋</span>
        </div>
      </div>
    </footer>
  );
}
