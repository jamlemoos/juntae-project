import type { ReactNode } from 'react';

interface SectionLayoutProps {
  eyebrow: string;
  title?: string;
  id?: string;
  divider?: boolean;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionLayout({
  eyebrow,
  title,
  id,
  divider = false,
  action,
  children,
  className,
}: SectionLayoutProps) {
  return (
    <section
      {...(id ? { 'aria-labelledby': id } : {})}
      className={['grid grid-cols-12 gap-8 py-14', divider ? 'border-t hairline' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="col-span-12 md:col-span-3">
        <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">{eyebrow}</div>
        {title && (
          <div id={id} className="display mt-2 text-[20px] font-semibold leading-tight text-ink">
            {title}
          </div>
        )}
      </div>
      <div className="col-span-12 md:col-span-9 md:pl-2">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">{children}</div>
          {action}
        </div>
      </div>
    </section>
  );
}
