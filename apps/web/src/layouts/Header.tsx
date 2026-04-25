export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <a
            href="/"
            className="display flex items-center gap-1.5 text-[22px] font-extrabold tracking-tight text-ink"
          >
            Juntaê
            <span className="serif relative -top-0.5 text-[26px] leading-none text-accent">,</span>
          </a>
          <nav
            className="hidden items-center gap-7 text-[14px] md:flex"
            aria-label="Navegação principal"
          >
            <a href="#como-funciona" className="ulink text-ink-2">
              Como funciona
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#sua-vez"
            className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Criar projeto
          </a>
        </div>
      </div>
    </header>
  );
}
