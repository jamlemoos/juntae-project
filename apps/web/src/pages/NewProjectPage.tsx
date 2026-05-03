import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { ArrowRight, Plus } from 'lucide-react';
import { GuidanceCard } from '../features/projects/components/GuidanceCard';
import { ProjectField } from '../features/projects/components/ProjectField';
import { ProjectSelect } from '../features/projects/components/ProjectSelect';
import { ProjectTextarea } from '../features/projects/components/ProjectTextarea';
import { RoleCard } from '../features/projects/components/RoleCard';
import {
  useProjectRoles,
  validateRolesForSubmit,
} from '../features/projects/hooks/useProjectRoles';
import { useCreateProjectMutation } from '../features/projects/hooks/useProjectMutations';
import type { FormProjectStatus, RoleStatus } from '../features/projects/types';
import { PROJECT_STATUS_OPTIONS } from '../features/projects/types';
import type { ProjectStatus as ApiProjectStatus } from '../features/projects/api/types';

const titleSchema = z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres.');
const descriptionSchema = z
  .string()
  .trim()
  .min(10, 'A descrição deve ter pelo menos 10 caracteres.');
const statusSchema = z.string().trim().min(1, 'Escolha o momento do projeto');

function validateTitle(value: string) {
  const r = titleSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

function validateDescription(value: string) {
  const r = descriptionSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

function validateStatus(value: string) {
  const r = statusSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

const FORM_STATUS_TO_API: Record<FormProjectStatus, ApiProjectStatus> = {
  idea: 'OPEN',
  forming_team: 'OPEN',
  in_progress: 'IN_PROGRESS',
  closed: 'CLOSED',
};

const ROLE_STATUS_TO_API: Record<Exclude<RoleStatus, ''>, 'OPEN' | 'CLOSED'> = {
  open: 'OPEN',
  filled: 'CLOSED',
};

function isFormProjectStatus(s: string): s is FormProjectStatus {
  return s in FORM_STATUS_TO_API;
}

function mapFormStatusToApi(status: FormProjectStatus): ApiProjectStatus {
  return FORM_STATUS_TO_API[status];
}

function mapRoleStatusToApi(status: RoleStatus): 'OPEN' | 'CLOSED' {
  if (status === '') return 'OPEN';
  return ROLE_STATUS_TO_API[status];
}

export function NewProjectPage() {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProjectMutation();
  const { roles, roleErrors, addRole, removeRole, updateRole, applyRoleValidation } =
    useProjectRoles();
  const [noRolesError, setNoRolesError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tracked, setTracked] = useState({ title: '', description: '', status: '' });

  const form = useForm({
    defaultValues: { title: '', description: '', status: '' },
    onSubmit: async ({ value }) => {
      if (roles.length === 0) return;
      const errors = validateRolesForSubmit(roles);
      if (errors.some((e) => e.title || e.description || e.status)) return;
      if (!isFormProjectStatus(value.status)) return;

      try {
        const project = await createProjectMutation.mutateAsync({
          title: value.title.trim(),
          description: value.description.trim(),
          status: mapFormStatusToApi(value.status),
          roles: roles.map((role) => ({
            title: role.title.trim(),
            description: role.description.trim(),
            status: mapRoleStatusToApi(role.status),
          })),
        });
        setSaveError(null);
        void navigate({ to: '/projects/$projectId', params: { projectId: project.id } });
      } catch {
        setSaveError('Não foi possível criar o projeto. Tente novamente.');
      }
    },
  });

  function handleAddRole() {
    addRole();
    setNoRolesError(null);
  }

  function handleRemoveRole(id: string) {
    removeRole(id);
  }

  function handleUpdateRole(id: string, field: 'title' | 'description' | 'status', value: string) {
    updateRole(id, field, value);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <section className="relative overflow-hidden paper-tex">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">
              novo projeto
            </div>
            <span className="h-px w-8 bg-line-2" />
            <span className="serif italic text-[14px] text-mute">encontre o que falta</span>
          </div>

          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                Tire sua ideia do papel
              </h1>
              <p className="mt-4 max-w-[52ch] text-[16.5px] leading-[1.6] text-ink-2">
                Comece descrevendo o que você quer construir e quem precisa no time.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <p className="serif italic max-w-[28ch] text-[17px] leading-[1.5] text-ink-2 lg:ml-auto">
                "Conta sua ideia e quem você precisa para{' '}
                <span className="text-accent">começar</span>."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (roles.length === 0) {
                    setNoRolesError('Adicione pelo menos uma pessoa para formar o time.');
                  } else {
                    setNoRolesError(null);
                    applyRoleValidation();
                  }
                  void form.handleSubmit();
                }}
                noValidate
              >
                <section
                  className="grid grid-cols-12 gap-8 py-14"
                  aria-labelledby="section-projeto"
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">
                      01 · projeto
                    </div>
                    <div
                      id="section-projeto"
                      className="display mt-2 text-[20px] font-semibold leading-tight text-ink"
                    >
                      Sobre o projeto
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-5 md:col-span-9">
                    <form.Field
                      name="title"
                      validators={{
                        onBlur: ({ value }) => validateTitle(value),
                        onSubmit: ({ value }) => validateTitle(value),
                      }}
                    >
                      {(field) => (
                        <ProjectField
                          label="Nome do projeto"
                          placeholder="Ex: App para organizar times de hackathon"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setTracked((prev) => ({ ...prev, title: e.target.value }));
                          }}
                          onBlur={field.handleBlur}
                          error={field.state.meta.errors[0] as string | undefined}
                        />
                      )}
                    </form.Field>

                    <form.Field
                      name="description"
                      validators={{
                        onBlur: ({ value }) => validateDescription(value),
                        onSubmit: ({ value }) => validateDescription(value),
                      }}
                    >
                      {(field) => (
                        <ProjectTextarea
                          label="Conte a ideia"
                          placeholder="Qual problema você quer resolver? O que já existe? O que você imagina construir primeiro?"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setTracked((prev) => ({ ...prev, description: e.target.value }));
                          }}
                          onBlur={field.handleBlur}
                          rows={5}
                          error={field.state.meta.errors[0] as string | undefined}
                        />
                      )}
                    </form.Field>

                    <form.Field
                      name="status"
                      validators={{
                        onBlur: ({ value }) => validateStatus(value),
                        onSubmit: ({ value }) => validateStatus(value),
                      }}
                    >
                      {(field) => (
                        <ProjectSelect
                          label="Momento do projeto"
                          options={PROJECT_STATUS_OPTIONS}
                          placeholder="Em que fase está?"
                          value={field.state.value}
                          onChange={(v) => {
                            field.handleChange(v);
                            setTracked((prev) => ({ ...prev, status: v }));
                          }}
                          onBlur={field.handleBlur}
                          error={field.state.meta.errors[0] as string | undefined}
                        />
                      )}
                    </form.Field>
                  </div>
                </section>

                <section
                  className="grid grid-cols-12 gap-8 border-t py-14 hairline"
                  aria-labelledby="section-time"
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">
                      02 · time
                    </div>
                    <div
                      id="section-time"
                      className="display mt-2 text-[20px] font-semibold leading-tight text-ink"
                    >
                      Quem você procura
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-9">
                    {roles.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
                        <div className="display text-[17px] font-semibold text-ink">
                          Você ainda não disse quem falta no time.
                        </div>
                        <p className="serif italic mt-2 text-[16px] leading-[1.55] text-ink-2">
                          Adicione pelo menos uma pessoa pra esse projeto sair do papel.
                        </p>
                        {noRolesError && (
                          <p role="alert" className="mt-3 text-[13px] font-medium text-accent">
                            {noRolesError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {roles.map((role, idx) => (
                          <RoleCard
                            key={role.id}
                            index={idx}
                            role={role}
                            errors={roleErrors[idx] ?? {}}
                            onChange={(field, value) => handleUpdateRole(role.id, field, value)}
                            onRemove={() => handleRemoveRole(role.id)}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddRole}
                      className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <Plus size={14} aria-hidden="true" />
                      adicionar pessoa
                    </button>
                  </div>
                </section>

                <div className="flex flex-col items-start gap-4 border-t py-10 hairline">
                  <button
                    type="submit"
                    disabled={form.state.isSubmitting}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-[15px] font-medium text-cream transition-colors hover:brightness-105 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {form.state.isSubmitting ? 'Criando…' : 'Criar projeto'}
                    {!form.state.isSubmitting && <ArrowRight size={14} aria-hidden="true" />}
                  </button>
                  {saveError && (
                    <p role="alert" className="text-[13px] text-red-600">
                      {saveError}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 lg:pt-14">
                <GuidanceCard
                  titleFilled={tracked.title.trim().length > 0}
                  descriptionFilled={tracked.description.trim().length > 0}
                  statusFilled={tracked.status.length > 0}
                  hasRoles={roles.length > 0}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
