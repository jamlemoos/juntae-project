import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import {
  hasProjectDraft,
  useProjectDraft,
} from '../features/projects/detail/hooks/useProjectDraft';
import { useProjectDetailEditing } from '../features/projects/detail/hooks/useProjectDetailEditing';
import { useProjectDetailQuery } from '../features/projects/hooks/useProjectDetailQuery';
import { formatWorkMode } from '../features/projects/detail/utils';
import { ProjectDetailHeader } from '../features/projects/detail/components/ProjectDetailHeader';
import { ProjectStatusRail } from '../features/projects/detail/components/ProjectStatusRail';
import { ProjectAboutSection } from '../features/projects/detail/components/ProjectAboutSection';
import { ProjectTeamSection } from '../features/projects/detail/components/ProjectTeamSection';
import { ProjectNeededRolesSection } from '../features/projects/detail/components/ProjectNeededRolesSection';
import { SectionLayout } from '../shared/ui/SectionLayout';
import { RailCard } from '../shared/ui/RailCard';
import { ApplicationPanel } from '../features/projects/detail/components/ApplicationPanel';
import { applyToRole } from '../features/applications/api/endpoints';
import type { ProjectDetail, ProjectStatus } from '../features/projects/api/types';

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });

  if (hasProjectDraft(projectId)) {
    return <LocalDraftDetail projectId={projectId} />;
  }

  return <ApiProjectDetail projectId={projectId} />;
}

function LocalDraftDetail({ projectId }: { projectId: string }) {
  const { project, setProject } = useProjectDraft(projectId);
  const { editingSection, editDraft, setEditDraft, startEditing, cancelEditing } =
    useProjectDetailEditing();

  const workModeDisplay = formatWorkMode(project.workMode, project.city);

  const checklist = [
    { label: 'Nome claro', done: project.title.trim().length > 0 },
    { label: 'Ideia explicada', done: project.description.trim().length > 0 },
    { label: 'Pelo menos uma pessoa', done: true },
    { label: 'Forma de trabalho definida', done: project.workMode !== '' },
  ];

  function handleSave() {
    setProject(editDraft);
    cancelEditing();
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ProjectDetailHeader
        title={project.title}
        description={project.description}
        workModeDisplay={workModeDisplay}
        publishStatus={project.publishStatus}
      />

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              <ProjectAboutSection
                project={project}
                workModeDisplay={workModeDisplay}
                isEditing={editingSection === 'sobre'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onStartEditing={() => startEditing('sobre', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <ProjectTeamSection
                isEditing={editingSection === 'time'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                members={project.members}
                onStartEditing={() => startEditing('time', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <ProjectNeededRolesSection
                isEditing={editingSection === 'procurando'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                roles={project.roles}
                publishStatus={project.publishStatus}
                onStartEditing={() => startEditing('procurando', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <div className="border-t pt-10 hairline">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-[14px] text-ink-2 transition-colors hover:text-ink"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Voltar para projetos
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 lg:pt-14">
                <ProjectStatusRail
                  publishStatus={project.publishStatus}
                  checklist={checklist}
                  onPublish={() => setProject({ ...project, publishStatus: 'published' })}
                  onEditProject={() => startEditing('sobre', project)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApiProjectDetail({ projectId }: { projectId: string }) {
  const { data: project, isPending, isError } = useProjectDetailQuery(projectId);
  const [openApplicationRoleId, setOpenApplicationRoleId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pt-24">
          <p className="text-[14px] text-mute">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pt-24">
          <p className="text-[14px] text-mute">Não foi possível carregar o projeto.</p>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center gap-2 text-[14px] text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Voltar para explorar
          </Link>
        </div>
      </div>
    );
  }

  const openRoles = project.roles.filter((r) => r.status === 'OPEN');

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ProjectDetailHeader
        title={project.title}
        description={project.description}
        workModeDisplay=""
        publishStatus="published"
      />

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          {project.isOwner && (
            <div className="mx-auto max-w-[1200px] pt-6">
              <p className="rounded-xl bg-cream-2 px-5 py-3 text-[13px] text-mute ring-1 ring-line">
                A edição de projetos publicados pelo servidor será integrada em uma próxima etapa.
              </p>
            </div>
          )}
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              <SectionLayout eyebrow="01 · sobre" title="Ideia" id="section-sobre">
                {project.description ? (
                  <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
                    <p className="text-[16px] leading-[1.65] text-ink-2">{project.description}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
                    <p className="display text-[17px] font-semibold text-ink">Sem descrição.</p>
                  </div>
                )}
              </SectionLayout>

              <SectionLayout
                eyebrow="03 · procurando"
                title="Quem falta"
                id="section-procurando"
                divider
              >
                {openRoles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
                    <p className="display text-[17px] font-semibold text-ink">
                      Sem vagas abertas no momento.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {openRoles.map((role) => (
                      <div key={role.id}>
                        <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
                          <div className="display text-[16px] font-semibold text-ink">
                            {role.title || 'Papel sem título'}
                          </div>
                          {role.description && (
                            <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-2">
                              {role.description}
                            </p>
                          )}
                          {!project.isOwner && (
                            <div className="mt-4">
                              {role.hasApplied ? (
                                <p className="text-[13px] text-mute">Você já se candidatou.</p>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenApplicationRoleId((prev) =>
                                      prev === role.id ? null : role.id
                                    )
                                  }
                                  className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                >
                                  {openApplicationRoleId === role.id
                                    ? 'Cancelar'
                                    : 'Quero participar'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {!project.isOwner &&
                          !role.hasApplied &&
                          openApplicationRoleId === role.id && (
                            <ApplicationPanel
                              roleTitle={role.title}
                              onClose={() => setOpenApplicationRoleId(null)}
                              onSubmit={async (message) => {
                                await applyToRole({ projectRoleId: role.id, message });
                                setOpenApplicationRoleId(null);
                              }}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </SectionLayout>

              <div className="border-t pt-10 hairline">
                <Link
                  to={project.isOwner ? '/projects' : '/explore'}
                  className="inline-flex items-center gap-2 text-[14px] text-ink-2 transition-colors hover:text-ink"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  {project.isOwner ? 'Voltar para projetos' : 'Voltar para explorar'}
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 lg:pt-14">
                <ApiProjectRail project={project} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  CLOSED: 'Encerrado',
};

function ApiProjectRail({ project }: { project: ProjectDetail }) {
  return (
    <RailCard>
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">status</div>
      <div className="display mt-3 text-[24px] font-bold text-ink">
        {PROJECT_STATUS_LABELS[project.status]}
      </div>
      <div className="dotted my-6" aria-hidden="true" />
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">criado por</div>
      <p className="mt-2 text-[15px] font-medium text-ink">{project.creator.name}</p>
    </RailCard>
  );
}
