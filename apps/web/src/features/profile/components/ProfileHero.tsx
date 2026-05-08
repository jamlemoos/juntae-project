interface ProfileHeroProps {
  name: string | undefined | null;
  email: string | undefined | null;
  avatarInitial: string;
  memberSince: string | null;
}

export function ProfileHero({ name, email, avatarInitial, memberSince }: ProfileHeroProps) {
  return (
    <section className="relative overflow-hidden paper-tex">
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
        <div className="mb-7 flex items-center gap-3">
          <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">perfil</div>
          <span className="h-px w-8 bg-line-2" />
          <span className="serif italic text-[14px] text-mute">
            visível pra outras pessoas construindo na Juntaê
          </span>
        </div>

        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-center gap-5">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-ink-2 text-[26px] font-bold text-cream display">
                {avatarInitial}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                  {name ?? 'Seu nome'}
                </h1>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 pl-[92px] text-[14px] text-ink-2">
              <span className="mono">{email}</span>
              {memberSince && (
                <>
                  <span className="text-mute">·</span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--color-mute)' }}
                    />
                    desde {memberSince}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:text-right">
            <p className="serif italic max-w-[28ch] text-[17px] leading-[1.5] text-ink-2 lg:ml-auto">
              Seu jeito de aparecer pra quem quer construir{' '}
              <span className="text-secondary">junto</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
