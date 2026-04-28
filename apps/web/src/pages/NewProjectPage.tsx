import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { ArrowRight, Plus } from 'lucide-react';
import { GuidanceCard } from '../features/projects/components/GuidanceCard';
import { ProjectField } from '../features/projects/components/ProjectField';
import { ProjectSelect } from '../features/projects/components/ProjectSelect';
import { ProjectTextarea } from '../features/projects/components/ProjectTextarea';
import { RoleCard } from '../features/projects/components/RoleCard';
import type { RoleDraft, RoleErrors } from '../features/projects/types';

const PROJECT_STATUS_OPTIONS = [
  { value: 'idea', label: 'Só uma ideia ainda' },
  { value: 'forming_team', label: 'Montando o time' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'paused', label: 'Em pausa' },
];

const titleSchema = z.string().min(1, 'Nome do projeto obrigatório');
const descriptionSchema = z.string().min(1, 'Conta a ideia do projeto');
const statusSchema = z.string().min(1, 'Escolha o momento do projeto');

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

function validateRoles(roles: RoleDraft[]): RoleErrors[] {
  return roles.map((role) => ({
    title: role.title.trim() ? undefined : 'Nome do papel obrigatório',
    description: role.description.trim() ? undefined : 'Descrição obrigatória',
    status: role.status ? undefined : 'Selecione a situação',
  }));
}

export function NewProjectPage() {
  const [roles, setRoles] = useState<RoleDraft[]>([]);
  const [roleErrors, setRoleErrors] = useState<RoleErrors[]>([]);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: '',
    },
    onSubmit: async () => {
      const errors = validateRoles(roles);
      const hasRoleErrors = errors.some((e) => e.title || e.description || e.status);
      if (hasRoleErrors) {
        setRoleErrors(errors);
        return;
      }
      setSubmitMessage('Criação de projeto ainda não está conectada ao backend.');
    },
  });

  const [tracked, setTracked] = useState({ title: '', description: '', status: '' });

  function addRole() {
    setRoles((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: '', description: '', status: '' },
    ]);
    setRoleErrors((prev) => [...prev, {}]);
  }

  function removeRole(id: string) {
    const idx = roles.findIndex((r) => r.id === id);
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setRoleErrors((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateRole(id: string, field: 'title' | 'description' | 'status', value: string) {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    const idx = roles.findIndex((r) => r.id === id);
    if (value && roleErrors[idx]?.[field]) {
      setRoleErrors((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e)));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ── Hero ── */}
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
                  setRoleErrors(validateRoles(roles));
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
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {roles.map((role, idx) => (
                          <RoleCard
                            key={role.id}
                            index={idx}
                            role={role}
                            errors={roleErrors[idx] ?? {}}
                            onChange={(field, value) => updateRole(role.id, field, value)}
                            onRemove={() => removeRole(role.id)}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addRole}
                      className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <Plus size={14} aria-hidden="true" />
                      adicionar pessoa
                    </button>
                  </div>
                </section>

                <div className="flex flex-col items-start gap-4 border-t py-10 hairline">
                  {submitMessage && (
                    <p
                      role="status"
                      className="serif italic rounded-xl bg-cream-2 px-4 py-3 text-[14px] text-ink-2 ring-1 ring-line"
                    >
                      {submitMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={form.state.isSubmitting}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-[15px] font-medium text-cream transition-colors hover:brightness-105 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {form.state.isSubmitting ? 'Criando…' : 'Criar projeto'}
                    {!form.state.isSubmitting && <ArrowRight size={14} aria-hidden="true" />}
                  </button>
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
