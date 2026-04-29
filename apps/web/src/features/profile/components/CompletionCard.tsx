import { ArrowRight } from 'lucide-react';
import type { CompletionItem } from '../types';
import { RailCard } from '../../../shared/ui/RailCard';
import { ChecklistItem } from '../../../shared/ui/ChecklistItem';

interface CompletionCardProps {
  items: CompletionItem[];
}

export function CompletionCard({ items }: CompletionCardProps) {
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const isComplete = pct === 100;
  const ctaLabel = isComplete ? 'Editar perfil' : 'Completar perfil';

  return (
    <RailCard>
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">seu perfil</div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="display tnum text-[44px] font-bold leading-none text-ink">
          {pct}
          <span className="text-[24px] text-mute">%</span>
        </div>
        <div className="serif italic text-[15px] text-mute">completo</div>
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden>
        {items.map((it) => (
          <span
            key={it.label}
            className="h-[4px] flex-1 rounded-full"
            style={{ background: it.done ? 'var(--color-accent)' : 'var(--color-line)' }}
          />
        ))}
      </div>

      <ul className="mt-6 space-y-3 text-[14px]">
        {items.map((it) => (
          <ChecklistItem key={it.label} label={it.label} done={it.done} />
        ))}
      </ul>

      <div className="dotted my-6" aria-hidden />

      <p className="text-[13px] leading-[1.55] text-ink-2">
        Seu perfil ajuda outras pessoas a entenderem como você pode contribuir em um time.
      </p>

      <button
        type="button"
        className={[
          'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
          isComplete
            ? 'ring-1 ring-line text-ink hover:bg-cream-2'
            : 'bg-accent text-cream hover:bg-accent/90',
        ].join(' ')}
      >
        {ctaLabel}
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </RailCard>
  );
}
