interface ProjectMemberCardProps {
  name: string;
  role: string;
  isCreator?: boolean;
}

export function ProjectMemberCard({ name, role, isCreator = false }: ProjectMemberCardProps) {
  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?';

  return (
    <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="display flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-ink text-[17px] font-bold text-cream"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="display text-[16px] font-semibold text-ink">{name}</div>
          <div className="mono mt-0.5 text-[12px] uppercase tracking-[.15em] text-mute">{role}</div>
        </div>
        {isCreator && (
          <span className="mono inline-flex shrink-0 items-center rounded-full bg-cream px-2.5 py-1 text-[11px] uppercase tracking-[.15em] text-mute ring-1 ring-line">
            criador
          </span>
        )}
      </div>
    </div>
  );
}
