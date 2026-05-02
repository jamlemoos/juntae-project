import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const DESCRIPTION_PREVIEW_LENGTH = 120;

interface ProjectCardShellProps {
  id: string;
  title: string;
  description: string;
  badge: ReactNode;
  footer?: ReactNode;
  /** Set to false for API-sourced cards whose detail page is not yet integrated. */
  navigable?: boolean;
}

export function ProjectCardShell({
  id,
  title,
  description,
  badge,
  footer,
  navigable = true,
}: ProjectCardShellProps) {
  const descriptionPreview =
    description.length > DESCRIPTION_PREVIEW_LENGTH
      ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
      : description;

  const cardClassName =
    'lift block rounded-xl border hairline bg-cream-2/30 p-5 transition-colors hover:border-line-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="display text-[15px] font-semibold text-ink">{title || 'Projeto sem nome'}</p>
        {badge}
      </div>

      {descriptionPreview && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{descriptionPreview}</p>
      )}

      {footer}
    </>
  );

  if (!navigable) {
    return (
      // TODO: Remove this wrapper and enable navigation once ProjectDetailPage uses getProjectDetails.
      <div className={cardClassName} aria-label={title || 'Projeto sem nome'}>
        {content}
        <p className="mt-3 text-[11.5px] text-mute">Detalhes em breve</p>
      </div>
    );
  }

  return (
    <Link to="/projects/$projectId" params={{ projectId: id }} className={cardClassName}>
      {content}
    </Link>
  );
}
