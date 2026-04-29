import { RailCard } from '../../../shared/ui/RailCard';
import { ChecklistItem } from '../../../shared/ui/ChecklistItem';

interface GuidanceCardProps {
  titleFilled: boolean;
  descriptionFilled: boolean;
  statusFilled: boolean;
  hasRoles: boolean;
}

interface ChecklistItemData {
  label: string;
  done: boolean;
}

export function GuidanceCard({
  titleFilled,
  descriptionFilled,
  statusFilled,
  hasRoles,
}: GuidanceCardProps) {
  const items: ChecklistItemData[] = [
    { label: 'Nome claro', done: titleFilled },
    { label: 'Ideia explicada', done: descriptionFilled },
    { label: 'Pelo menos uma pessoa no time', done: hasRoles },
    { label: 'Próximo passo definido', done: statusFilled },
  ];

  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <RailCard>
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">checklist</div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="display tnum text-[44px] font-bold leading-none text-ink">
          {pct}
          <span className="text-[24px] text-mute">%</span>
        </div>
        <div className="serif italic text-[15px] text-mute">pronto</div>
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden="true">
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

      <div className="dotted my-6" aria-hidden="true" />

      <p className="serif italic text-[13px] leading-[1.55] text-ink-2">
        Quanto mais claro, mais fácil formar seu time.
      </p>
    </RailCard>
  );
}
