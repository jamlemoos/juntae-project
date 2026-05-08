import type { ChecklistItem, PublishStatus } from '../types';
import { RailCard } from '../../../../shared/ui/RailCard';
import { ChecklistItem as ChecklistItemComponent } from '../../../../shared/ui/ChecklistItem';

interface ProjectStatusRailProps {
  publishStatus: PublishStatus;
  checklist: ChecklistItem[];
  onPublish: () => void;
  isPublishing?: boolean;
  publishError?: string | null;
  onEditProject: () => void;
}

export function ProjectStatusRail({
  publishStatus,
  checklist,
  onPublish,
  isPublishing,
  publishError,
  onEditProject,
}: ProjectStatusRailProps) {
  const isPublished = publishStatus === 'published';
  const allDone = checklist.every((c) => c.done);

  return (
    <RailCard>
      {isPublished ? (
        <>
          <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">status</div>
          <div className="display mt-3 text-[24px] font-bold text-ink">Publicado</div>
          <div className="dotted my-6" aria-hidden="true" />
          <p className="serif italic text-[13px] leading-[1.55] text-ink-2">
            Você pode continuar melhorando seu projeto a qualquer momento.
          </p>
          <button
            type="button"
            onClick={onEditProject}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Editar projeto
          </button>
        </>
      ) : (
        <>
          <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">checklist</div>
          <ul className="mt-5 space-y-3 text-[14px]">
            {checklist.map((item) => (
              <ChecklistItemComponent key={item.label} label={item.label} done={item.done} />
            ))}
          </ul>
          <div className="dotted my-6" aria-hidden="true" />
          {!allDone && (
            <p className="serif italic mb-4 text-[13px] leading-[1.55] text-ink-2">
              Seu projeto ainda pode melhorar, mas você pode publicar mesmo assim.
            </p>
          )}
          <p className="serif italic text-[13px] leading-[1.55] text-ink-2">
            Complete o checklist para deixar seu projeto pronto para receber pessoas.
          </p>
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishing ? 'Publicando…' : 'Publicar projeto'}
          </button>
          {publishError && (
            <p role="alert" className="mt-3 text-[13px] text-red-600">
              {publishError}
            </p>
          )}
        </>
      )}
    </RailCard>
  );
}
