import type { ApplicationDetailResponse, ApplicationStatus } from '../../../applications/api/types';
import {
  useProjectApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from '../../../applications/hooks/useApplicationsHooks';
import { SectionLayout } from '../../../../shared/ui/SectionLayout';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  REJECTED: 'Recusado',
};

function statusBadgeClass(status: ApplicationStatus): string {
  if (status === 'ACCEPTED') return 'bg-green-50 text-green-700 ring-1 ring-green-200';
  if (status === 'REJECTED') return 'bg-red-50 text-red-700 ring-1 ring-red-200';
  return 'bg-cream ring-1 ring-line text-mute';
}

interface ApplicationCardProps {
  application: ApplicationDetailResponse;
  onAccept: () => void;
  onReject: () => void;
  isUpdating: boolean;
}

function ApplicationCard({ application, onAccept, onReject, isUpdating }: ApplicationCardProps) {
  const { user, message, status } = application;

  return (
    <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="display text-[15px] font-semibold text-ink">{user.name}</div>
          {user.city && <div className="mt-0.5 text-[13px] text-mute">{user.city}</div>}
        </div>
        <span
          className={`mono shrink-0 rounded-full px-3 py-1 text-[11px] uppercase tracking-[.14em] ${statusBadgeClass(status)}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {user.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {user.skills.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full bg-cream px-2.5 py-0.5 text-[12px] text-ink-2 ring-1 ring-line"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}

      {message && <p className="mt-3 text-[14px] leading-[1.55] text-ink-2">{message}</p>}

      {status === 'PENDING' && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onAccept}
            disabled={isUpdating}
            className="inline-flex h-8 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
          >
            Aceitar
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={isUpdating}
            className="inline-flex h-8 items-center rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  );
}

type RoleGroup = { roleTitle: string; apps: ApplicationDetailResponse[] };

export function OwnerApplicationsSection({ projectId }: { projectId: string }) {
  const {
    data: applications,
    isPending,
    isError: isLoadError,
  } = useProjectApplicationsQuery(projectId);
  const updateStatusMutation = useUpdateApplicationStatusMutation(projectId);

  const roleGroups = (applications ?? []).reduce<Record<string, RoleGroup>>((acc, app) => {
    const key = app.projectRoleId;
    if (!acc[key]) acc[key] = { roleTitle: app.roleTitle || 'Sem título', apps: [] };
    acc[key]!.apps.push(app);
    return acc;
  }, {});

  return (
    <SectionLayout
      eyebrow="04 · candidaturas"
      title="Candidaturas recebidas"
      id="section-candidaturas"
      divider
    >
      <>
        {isPending ? (
          <p className="text-[14px] text-mute">Carregando candidaturas...</p>
        ) : isLoadError ? (
          <p className="text-[14px] text-mute">Não foi possível carregar as candidaturas.</p>
        ) : !applications?.length ? (
          <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
            <p className="display text-[17px] font-semibold text-ink">Nenhuma candidatura ainda.</p>
            <p className="serif italic mt-1.5 text-[14px] leading-[1.55] text-ink-2">
              As candidaturas aparecerão aqui quando alguém se inscrever.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(roleGroups).map(([roleId, { roleTitle, apps }]) => (
              <div key={roleId}>
                <div className="mono mb-3 text-[11px] uppercase tracking-[.18em] text-mute">
                  {roleTitle}
                </div>
                <div className="flex flex-col gap-3">
                  {apps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      isUpdating={updateStatusMutation.isPending}
                      onAccept={() =>
                        updateStatusMutation.mutate({ id: app.id, status: 'ACCEPTED' })
                      }
                      onReject={() =>
                        updateStatusMutation.mutate({ id: app.id, status: 'REJECTED' })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {updateStatusMutation.isError && (
          <p role="alert" className="mt-3 text-[13px] text-red-600">
            Não foi possível atualizar a candidatura. Tente novamente.
          </p>
        )}
      </>
    </SectionLayout>
  );
}
