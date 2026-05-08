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
          done ? 'bg-primary text-white' : 'bg-cream ring-1 ring-line-2 text-mute',
        ].join(' ')}
        aria-hidden="true"
      >
        {done ? '✓' : ''}
      </span>
      <span className="sr-only">{done ? 'concluído' : 'pendente'}: </span>
      <span className={done ? 'text-ink-2' : 'text-ink'}>{label}</span>
    </li>
  );
}
