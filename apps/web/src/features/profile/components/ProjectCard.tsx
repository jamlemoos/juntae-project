import type { ProfileProject, ProjectStatus } from '../types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  ativo: { label: 'em construção', color: 'var(--color-sage)' },
  buscando: { label: 'buscando time', color: 'var(--color-accent)' },
  pausado: { label: 'pausado', color: 'var(--color-mute)' },
};

interface ProjectCardProps {
  project: ProfileProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status];

  return (
    <div className="lift rounded-xl border hairline bg-cream-2/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="display text-[15px] font-semibold text-ink">{project.name}</p>
          <p className="mt-0.5 text-[13px] text-mute">{project.role}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1 text-[11.5px] text-ink-2 ring-1 ring-line">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
          {status.label}
        </span>
      </div>
      {project.context && (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{project.context}</p>
      )}
    </div>
  );
}
