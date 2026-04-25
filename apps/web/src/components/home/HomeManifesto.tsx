export function HomeManifesto() {
  return (
    <section className="border-y hairline bg-cream-2">
      <div className="mx-auto max-w-[1200px] grid grid-cols-12 items-start gap-6 px-6 py-14">
        <div className="col-span-12 md:col-span-4">
          <div className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
            por que a gente existe
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <p className="display text-[26px] font-medium leading-[1.3] text-ink md:text-[32px]">
            Construir com outras pessoas é mais difícil, e é também a parte boa.{' '}
            <span className="text-ink-2">
              Juntaê foi feito pra te ajudar a encontrar essas pessoas, com contexto e sem parecer
              um processo seletivo.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
