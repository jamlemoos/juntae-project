import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const DESCRIPTION_PREVIEW_LENGTH = 120;

interface ProjectCardShellProps {
  id: string;
  title: string;
  description: string;
  badge: ReactNode;
  footer?: ReactNode;
}

export function ProjectCardShell({ id, title, description, badge, footer }: ProjectCardShellProps) {
  const descriptionPreview =
    description.length > DESCRIPTION_PREVIEW_LENGTH
      ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
      : description;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: id }}
      className="lift block rounded-xl border hairline bg-cream-2/30 p-5 transition-colors hover:border-line-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="display text-[15px] font-semibold text-ink">{title || 'Projeto sem nome'}</p>
        {badge}
      </div>

      {descriptionPreview && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{descriptionPreview}</p>
      )}

      {footer}
    </Link>
  );
}
