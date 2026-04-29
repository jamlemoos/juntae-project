import type { RoleDraft } from '../../types';

const ROLE_STATUS_LABELS: Record<string, string> = {
  open: 'aberta',
  filled: 'preenchida',
};

interface ProjectRoleCardProps {
  role: RoleDraft;
}

export function ProjectRoleCard({ role }: ProjectRoleCardProps) {
  return (
    <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="display text-[16px] font-semibold text-ink">
            {role.title || 'Papel sem título'}
          </div>
          {role.description && (
            <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-2">{role.description}</p>
          )}
        </div>
        {role.status && (
          <span className="mono inline-flex shrink-0 items-center rounded-full bg-cream px-2.5 py-1 text-[11px] uppercase tracking-[.15em] text-mute ring-1 ring-line">
            {ROLE_STATUS_LABELS[role.status] ?? role.status}
          </span>
        )}
      </div>
    </div>
  );
}
