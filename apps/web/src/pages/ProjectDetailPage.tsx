import { useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import {
  hasProjectDraft,
  useProjectDraft,
  clearProjectDraft,
} from '../features/projects/detail/hooks/useProjectDraft';
import { useProjectDetailEditing } from '../features/projects/detail/hooks/useProjectDetailEditing';
import { useProjectDetailQuery } from '../features/projects/hooks/useProjectDetailQuery';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../features/projects/hooks/useProjectMutations';
import { formatWorkMode } from '../features/projects/detail/utils';
import { ProjectDetailHeader } from '../features/projects/detail/components/ProjectDetailHeader';
import { ProjectStatusRail } from '../features/projects/detail/components/ProjectStatusRail';
import { ProjectAboutSection } from '../features/projects/detail/components/ProjectAboutSection';
import { ProjectTeamSection } from '../features/projects/detail/components/ProjectTeamSection';
import { ProjectNeededRolesSection } from '../features/projects/detail/components/ProjectNeededRolesSection';
import { OwnerApplicationsSection } from '../features/projects/detail/components/OwnerApplicationsSection';
import { SectionLayout } from '../shared/ui/SectionLayout';
import { RailCard } from '../shared/ui/RailCard';
import { ApplicationPanel } from '../features/projects/detail/components/ApplicationPanel';
import { ProjectField } from '../features/projects/components/ProjectField';
import { ProjectTextarea } from '../features/projects/components/ProjectTextarea';
import { ProjectSelect } from '../features/projects/components/ProjectSelect';
import { applyToRole } from '../features/applications/api/endpoints';
import {
  useCreateProjectRoleMutation,
  useDeleteProjectRoleMutation,
  useUpdateProjectRoleMutation,
} from '../features/projects/hooks/useProjectRoleMutations';
import type {
  ProjectDetail,
  ProjectRole,
  ProjectStatus,
  RoleStatus,
  UpdateProjectRoleRequest,
} from '../features/projects/api/types';
import {
  PROJECT_TITLE_MIN,
  PROJECT_DESCRIPTION_MIN,
  PROJECT_TITLE_ERROR,
  PROJECT_DESCRIPTION_ERROR,
  PROJECT_ROLE_TITLE_MIN,
  PROJECT_ROLE_MIN_COUNT_ERROR,
} from '../features/projects/validation';

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  CLOSED: 'Encerrado',
};

const API_STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({
  value: value as ProjectStatus,
  label,
}));

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });

  if (hasProjectDraft(projectId)) {
    return <LocalDraftDetail projectId={projectId} />;
  }

  return <ApiProjectDetail projectId={projectId} />;
}

function LocalDraftDetail({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const { project, setProject } = useProjectDraft(projectId);
  const { editingSection, editDraft, setEditDraft, startEditing, cancelEditing } =
    useProjectDetailEditing();
  const createProjectMutation = useCreateProjectMutation();
  const [publishError, setPublishError] = useState<string | null>(null);

  const workModeDisplay = formatWorkMode(project.workMode, project.city);

  const checklist = [
    { label: 'Nome claro', done: project.title.trim().length >= PROJECT_TITLE_MIN },
    {
      label: 'Ideia explicada',
      done: project.description.trim().length >= PROJECT_DESCRIPTION_MIN,
    },
    {
      label: 'Pelo menos uma vaga',
      done: project.roles.some((r) => r.title.trim().length >= PROJECT_ROLE_TITLE_MIN),
    },
    { label: 'Forma de trabalho definida', done: project.workMode !== '' },
  ];

  function handleSave() {
    setProject(editDraft);
    cancelEditing();
  }

  async function handlePublish() {
    setPublishError(null);
    if (project.title.trim().length < PROJECT_TITLE_MIN) {
      setPublishError(PROJECT_TITLE_ERROR);
      return;
    }
    if (project.description.trim().length < PROJECT_DESCRIPTION_MIN) {
      setPublishError(PROJECT_DESCRIPTION_ERROR);
      return;
    }
    const validRoles = project.roles.filter((r) => r.title.trim().length >= PROJECT_ROLE_TITLE_MIN);
    if (validRoles.length === 0) {
      setPublishError(PROJECT_ROLE_MIN_COUNT_ERROR);
      return;
    }
    try {
      const created = await createProjectMutation.mutateAsync({
        title: project.title.trim(),
        description: project.description.trim(),
        status: 'OPEN',
        roles: validRoles.map((r) => ({
          title: r.title.trim(),
          description: r.description.trim(),
          status: r.status === 'filled' ? ('CLOSED' as const) : ('OPEN' as const),
        })),
      });
      clearProjectDraft(projectId);
      void navigate({ to: '/projects/$projectId', params: { projectId: created.id } });
    } catch {
      setPublishError('Não foi possível publicar o projeto. Tente novamente.');
    }
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
                  onPublish={handlePublish}
                  isPublishing={createProjectMutation.isPending}
                  publishError={publishError}
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

type EditFields = {
  title: string;
  description: string;
  status: ProjectStatus;
};

const ROLE_STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Aberta' },
  { value: 'CLOSED', label: 'Fechada' },
];

function ApiProjectDetail({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { data: project, isPending, isError } = useProjectDetailQuery(projectId);
  const updateMutation = useUpdateProjectMutation();
  const createRoleMutation = useCreateProjectRoleMutation(projectId);
  const updateRoleMutation = useUpdateProjectRoleMutation(projectId);
  const deleteRoleMutation = useDeleteProjectRoleMutation(projectId);

  const [openApplicationRoleId, setOpenApplicationRoleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditFields>({
    title: '',
    description: '',
    status: 'OPEN',
  });
  const [editError, setEditError] = useState<string | null>(null);

  const [addingRole, setAddingRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState<RoleStatus>('OPEN');
  const [roleFormError, setRoleFormError] = useState<string | null>(null);

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

  function handleStartEditing() {
    setEditFields({
      title: project!.title,
      description: project!.description,
      status: project!.status,
    });
    setEditError(null);
    setIsEditing(true);
  }

  async function handleSaveEdit() {
    if (editFields.title.trim().length < PROJECT_TITLE_MIN) {
      setEditError(PROJECT_TITLE_ERROR);
      return;
    }
    if (editFields.description.trim().length < PROJECT_DESCRIPTION_MIN) {
      setEditError(PROJECT_DESCRIPTION_ERROR);
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: projectId,
        data: {
          title: editFields.title.trim(),
          description: editFields.description.trim(),
          status: editFields.status,
        },
      });
      setIsEditing(false);
      setEditError(null);
    } catch {
      setEditError('Não foi possível salvar as alterações. Tente novamente.');
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditError(null);
  }

  function handleStartAddRole() {
    setRoleTitle('');
    setRoleDescription('');
    setRoleStatus('OPEN');
    setRoleFormError(null);
    setEditingRoleId(null);
    setAddingRole(true);
  }

  function handleStartEditRole(role: ProjectRole) {
    setRoleTitle(role.title);
    setRoleDescription(role.description);
    setRoleStatus(role.status);
    setRoleFormError(null);
    setAddingRole(false);
    setEditingRoleId(role.id);
  }

  function handleCancelRoleForm() {
    setAddingRole(false);
    setEditingRoleId(null);
    setRoleFormError(null);
  }

  async function handleSaveNewRole() {
    if (roleTitle.trim().length < 2) {
      setRoleFormError('Nome do papel deve ter pelo menos 2 caracteres.');
      return;
    }
    try {
      await createRoleMutation.mutateAsync({
        projectId,
        title: roleTitle.trim(),
        description: roleDescription.trim(),
        status: roleStatus,
      });
      setAddingRole(false);
      setRoleFormError(null);
    } catch {
      setRoleFormError('Não foi possível adicionar a vaga. Tente novamente.');
    }
  }

  async function handleSaveEditRole(id: string) {
    if (roleTitle.trim().length < 2) {
      setRoleFormError('Nome do papel deve ter pelo menos 2 caracteres.');
      return;
    }
    const data: UpdateProjectRoleRequest = {
      title: roleTitle.trim(),
      description: roleDescription.trim(),
      status: roleStatus,
    };
    try {
      await updateRoleMutation.mutateAsync({ id, data });
      setEditingRoleId(null);
      setRoleFormError(null);
    } catch {
      setRoleFormError('Não foi possível salvar as alterações. Tente novamente.');
    }
  }

  async function handleDeleteRole(id: string) {
    try {
      await deleteRoleMutation.mutateAsync(id);
    } catch {
      // deletion failure is silent at MVP scope
    }
  }

  // Owners see all roles. Non-owners see only OPEN roles on OPEN projects.
  const visibleRoles = project.isOwner
    ? project.roles
    : project.status === 'OPEN'
      ? project.roles.filter((r) => r.status === 'OPEN')
      : [];
  const canApply = !project.isOwner && project.status === 'OPEN';

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
          {project.isOwner && isEditing && (
            <div className="pt-6 pb-2">
              <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
                <div className="mono mb-5 text-[11px] uppercase tracking-[.22em] text-mute">
                  Editar projeto
                </div>
                <div className="flex flex-col gap-5">
                  <ProjectField
                    label="Nome do projeto"
                    value={editFields.title}
                    onChange={(e) => setEditFields((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <ProjectTextarea
                    label="Descrição"
                    value={editFields.description}
                    rows={5}
                    onChange={(e) =>
                      setEditFields((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                  <ProjectSelect
                    label="Status"
                    options={API_STATUS_OPTIONS}
                    value={editFields.status}
                    onChange={(v) =>
                      setEditFields((prev) => ({ ...prev, status: v as ProjectStatus }))
                    }
                  />
                </div>
                {editError && (
                  <p role="alert" className="mt-3 text-[13px] text-red-600">
                    {editError}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={updateMutation.isPending}
                    className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
                  >
                    {updateMutation.isPending ? 'Salvando…' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateMutation.isPending}
                    className="inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
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
                <div className="flex flex-col gap-4">
                  {visibleRoles.length === 0 && !addingRole && (
                    <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
                      <p className="display text-[17px] font-semibold text-ink">
                        {project.isOwner
                          ? 'Nenhuma vaga cadastrada ainda.'
                          : project.status !== 'OPEN'
                            ? 'Este projeto não está aceitando candidaturas no momento.'
                            : 'Sem vagas abertas no momento.'}
                      </p>
                    </div>
                  )}

                  {visibleRoles.map((role) => (
                    <div key={role.id}>
                      {editingRoleId === role.id ? (
                        <RoleFormCard
                          title={roleTitle}
                          description={roleDescription}
                          status={roleStatus}
                          error={roleFormError}
                          isSaving={updateRoleMutation.isPending}
                          onChangeTitle={setRoleTitle}
                          onChangeDescription={setRoleDescription}
                          onChangeStatus={(v) => setRoleStatus(v as RoleStatus)}
                          onSave={() => void handleSaveEditRole(role.id)}
                          onCancel={handleCancelRoleForm}
                        />
                      ) : (
                        <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="display text-[16px] font-semibold text-ink">
                                {role.title || 'Papel sem título'}
                              </div>
                              {role.description && (
                                <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-2">
                                  {role.description}
                                </p>
                              )}
                            </div>
                            {project.isOwner && (
                              <span
                                className={[
                                  'mono shrink-0 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[.14em]',
                                  role.status === 'OPEN'
                                    ? 'bg-cream ring-1 ring-line text-mute'
                                    : 'bg-cream-2 ring-1 ring-line-2 text-mute',
                                ].join(' ')}
                              >
                                {role.status === 'OPEN' ? 'aberta' : 'fechada'}
                              </span>
                            )}
                          </div>
                          {project.isOwner && (
                            <div className="mt-4 flex items-center gap-2 border-t pt-4 hairline">
                              <button
                                type="button"
                                onClick={() => handleStartEditRole(role)}
                                className="inline-flex h-8 items-center rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteRole(role.id)}
                                disabled={deleteRoleMutation.isPending}
                                className="inline-flex h-8 items-center rounded-full px-4 text-[13px] font-medium text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                              >
                                Remover
                              </button>
                            </div>
                          )}
                          {canApply && (
                            <div className="mt-4">
                              {role.hasApplied ? (
                                <p className="text-[13px] text-mute">Você já se candidatou.</p>
                              ) : (
                                <button
                                  type="button"
                                  aria-expanded={openApplicationRoleId === role.id}
                                  aria-controls={`application-panel-${role.id}`}
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
                      )}
                      {canApply && !role.hasApplied && openApplicationRoleId === role.id && (
                        <ApplicationPanel
                          id={`application-panel-${role.id}`}
                          roleTitle={role.title}
                          onClose={() => setOpenApplicationRoleId(null)}
                          onSubmit={async (message) => {
                            await applyToRole({ projectRoleId: role.id, message });
                            await queryClient.invalidateQueries({
                              queryKey: ['project', projectId],
                            });
                            setOpenApplicationRoleId(null);
                          }}
                        />
                      )}
                    </div>
                  ))}

                  {project.isOwner && (
                    <div>
                      {addingRole ? (
                        <RoleFormCard
                          title={roleTitle}
                          description={roleDescription}
                          status={roleStatus}
                          error={roleFormError}
                          isSaving={createRoleMutation.isPending}
                          onChangeTitle={setRoleTitle}
                          onChangeDescription={setRoleDescription}
                          onChangeStatus={(v) => setRoleStatus(v as RoleStatus)}
                          onSave={() => void handleSaveNewRole()}
                          onCancel={handleCancelRoleForm}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={handleStartAddRole}
                          className="w-full rounded-2xl border border-dashed border-line-2 py-4 text-[14px] font-medium text-mute transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                        >
                          + Adicionar vaga
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </SectionLayout>

              {project.isOwner && <OwnerApplicationsSection projectId={projectId} />}

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
                <ApiProjectRail
                  project={project}
                  onEdit={project.isOwner && !isEditing ? handleStartEditing : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface RoleFormCardProps {
  title: string;
  description: string;
  status: string;
  error: string | null;
  isSaving: boolean;
  onChangeTitle: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangeStatus: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function RoleFormCard({
  title,
  description,
  status,
  error,
  isSaving,
  onChangeTitle,
  onChangeDescription,
  onChangeStatus,
  onSave,
  onCancel,
}: RoleFormCardProps) {
  return (
    <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-ink/20 md:p-6">
      <div className="flex flex-col gap-4">
        <ProjectField
          label="Função"
          placeholder="Ex: Dev front-end, Designer, Redator…"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
        <ProjectTextarea
          label="O que essa pessoa faria?"
          placeholder="Descreva o que espera dessa pessoa…"
          rows={3}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
        />
        <ProjectSelect
          label="Situação"
          options={ROLE_STATUS_OPTIONS}
          placeholder="Status da vaga"
          value={status}
          onChange={onChangeStatus}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-red-600">
          {error}
        </p>
      )}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
        >
          {isSaving ? 'Salvando…' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ApiProjectRail({ project, onEdit }: { project: ProjectDetail; onEdit?: () => void }) {
  return (
    <RailCard>
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">status</div>
      <div className="display mt-3 text-[24px] font-bold text-ink">
        {PROJECT_STATUS_LABELS[project.status]}
      </div>
      <div className="dotted my-6" aria-hidden="true" />
      <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">criado por</div>
      <p className="mt-2 text-[15px] font-medium text-ink">{project.creator.name}</p>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Editar projeto
        </button>
      )}
    </RailCard>
  );
}
