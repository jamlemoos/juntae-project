import type { ProjectData, PublishStatus } from '../detail/types';
import { formatWorkMode } from '../detail/utils';
import { ProjectCardShell } from './ProjectCardShell';

const MAX_ROLE_PREVIEWS = 2;

interface ProjectListCardProps {
  id: string;
  data: ProjectData;
  status: PublishStatus;
}

export function ProjectListCard({ id, data, status }: ProjectListCardProps) {
  const workModeDisplay = formatWorkMode(data.workMode, data.city);

  const openRoles = data.roles.filter((r) => r.status === 'open');
  const previewRoles = openRoles.slice(0, MAX_ROLE_PREVIEWS);
  const extraRolesCount = openRoles.length - previewRoles.length;

  const footer =
    workModeDisplay || openRoles.length > 0 ? (
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-mute">
        {workModeDisplay && <span>{workModeDisplay}</span>}
        {openRoles.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span>Faltam:</span>
            {previewRoles.map((r) => (
              <span
                key={r.id}
                className="rounded-full bg-cream-3 px-2 py-0.5 text-[11px] text-ink-2"
              >
                {r.title || 'papel sem nome'}
              </span>
            ))}
            {extraRolesCount > 0 && (
              <span className="text-[11px] text-mute">+{extraRolesCount} outros</span>
            )}
          </span>
        )}
      </div>
    ) : undefined;

  return (
    <ProjectCardShell
      id={id}
      title={data.title}
      description={data.description}
      badge={<StatusBadge status={status} />}
      footer={footer}
    />
  );
}

function StatusBadge({ status }: { status: PublishStatus }) {
  const config =
    status === 'draft'
      ? { label: 'rascunho', color: 'var(--color-mute)' }
      : { label: 'publicado', color: 'var(--color-sage)' };

  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1 text-[11.5px] text-ink-2 ring-1 ring-line">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}
