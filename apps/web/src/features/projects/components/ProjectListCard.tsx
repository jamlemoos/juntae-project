import { Link } from '@tanstack/react-router';
import type { ProjectData, PublishStatus } from '../detail/types';
import { formatWorkMode } from '../detail/utils';

const DESCRIPTION_PREVIEW_LENGTH = 120;
const MAX_ROLE_PREVIEWS = 2;

interface ProjectListCardProps {
  id: string;
  data: ProjectData;
  status: PublishStatus;
}

export function ProjectListCard({ id, data, status }: ProjectListCardProps) {
  const workModeDisplay = formatWorkMode(data.workMode, data.city);

  const descriptionPreview =
    data.description.length > DESCRIPTION_PREVIEW_LENGTH
      ? `${data.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
      : data.description;

  const openRoles = data.roles.filter((r) => r.status === 'open');
  const previewRoles = openRoles.slice(0, MAX_ROLE_PREVIEWS);
  const extraRolesCount = openRoles.length - previewRoles.length;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: id }}
      className="lift block rounded-xl border hairline bg-cream-2/30 p-5 transition-colors hover:border-line-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="display text-[15px] font-semibold text-ink">
          {data.title || 'Projeto sem nome'}
        </p>
        <StatusBadge status={status} />
      </div>

      {descriptionPreview && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{descriptionPreview}</p>
      )}

      {(workModeDisplay || openRoles.length > 0) && (
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
      )}
    </Link>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
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
