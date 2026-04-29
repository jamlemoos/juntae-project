interface ChecklistItemProps {
  label: string;
  done: boolean;
}

export function ChecklistItem({ label, done }: ChecklistItemProps) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={[
          'inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold leading-none',
          done ? 'bg-ink text-cream' : 'bg-cream ring-1 ring-line-2 text-mute',
        ].join(' ')}
      >
        {done ? '✓' : ''}
      </span>
      <span className={done ? 'text-ink-2' : 'text-ink'}>{label}</span>
    </li>
  );
}
