import type { PublishStatus } from '../types';

interface ProjectDetailHeaderProps {
  title: string;
  description: string;
  workModeDisplay: string;
  publishStatus: PublishStatus;
}

export function ProjectDetailHeader({
  title,
  description,
  workModeDisplay,
  publishStatus,
}: ProjectDetailHeaderProps) {
  const isPublished = publishStatus === 'published';

  return (
    <section className="relative overflow-hidden paper-tex">
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
        <div className="mb-7 flex items-center gap-3">
          <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">projeto</div>
          <span className="h-px w-8 bg-line-2" />
          <span className="serif italic text-[14px] text-mute">
            {isPublished ? 'visível para todos' : 'rascunho'}
          </span>
        </div>

        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-9">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {isPublished ? (
                <span className="mono inline-flex items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1 text-[11px] uppercase tracking-[.18em] text-ink ring-1 ring-line">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  publicado
                </span>
              ) : (
                <span className="mono inline-flex items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1 text-[11px] uppercase tracking-[.18em] text-mute ring-1 ring-line">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--color-mute)' }}
                    aria-hidden="true"
                  />
                  rascunho
                </span>
              )}
              {workModeDisplay && (
                <span className="mono text-[12px] text-mute">{workModeDisplay}</span>
              )}
            </div>

            <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
              {title || 'Projeto recém-criado'}
            </h1>

            <p className="mt-3 text-[14px] text-mute">
              {isPublished
                ? 'Este projeto já está visível para outras pessoas.'
                : 'Só você vê esse projeto por enquanto.'}
            </p>

            {description && (
              <p className="mt-4 max-w-[52ch] text-[16.5px] leading-[1.6] text-ink-2">
                {description}
              </p>
            )}
          </div>

          <div className="col-span-12 lg:col-span-3 lg:text-right">
            <p className="serif italic max-w-[28ch] text-[17px] leading-[1.5] text-ink-2 lg:ml-auto">
              "O primeiro passo é ter a ideia no papel.{' '}
              <span className="text-accent">O time vem depois.</span>"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
