import type { ProjectListItem, ProjectStatus } from '../api/types';
import { ProjectCardShell } from './ProjectCardShell';

interface ApiProjectCardProps {
  project: ProjectListItem;
}

export function ApiProjectCard({ project }: ApiProjectCardProps) {
  const footer =
    project.status === 'OPEN' && project.openRolesCount > 0 ? (
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-mute">
        <span className="flex items-center gap-1.5">
          <span>Faltam:</span>
          <span className="rounded-full bg-cream-3 px-2 py-0.5 text-[11px] text-ink-2">
            {project.openRolesCount} {project.openRolesCount === 1 ? 'vaga' : 'vagas'}
          </span>
        </span>
      </div>
    ) : undefined;

  return (
    <ProjectCardShell
      id={project.id}
      title={project.title}
      description={project.description}
      badge={<StatusBadge status={project.status} />}
      footer={footer}
    />
  );
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  OPEN: { label: 'aberto', color: 'var(--color-sage)' },
  IN_PROGRESS: { label: 'em andamento', color: 'var(--color-mute)' },
  CLOSED: { label: 'encerrado', color: 'var(--color-mute)' },
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1 text-[11.5px] text-ink-2 ring-1 ring-line">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}
