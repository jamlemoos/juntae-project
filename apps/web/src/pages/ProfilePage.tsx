import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, X, Trash2 } from 'lucide-react';
import { CompletionCard } from '../features/profile/components/CompletionCard';
import { ProfileEmptyState } from '../features/profile/components/ProfileEmptyState';
import { ProfileSection } from '../features/profile/components/ProfileSection';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useUpdateUserMutation } from '../features/users/hooks/useUserMutations';
import { useSkillsQuery } from '../features/skills/hooks/useSkillsQuery';
import { useMyProjectsQuery } from '../features/projects/hooks/useProjectsQuery';
import { ApiProjectCard } from '../features/projects/components/ApiProjectCard';
import { ApiError } from '../shared/api/http';
import { validateName, validateCity } from '../features/auth/utils/authValidation';
import { CityAutocomplete } from '../shared/ui/CityAutocomplete';
import { useLinksQuery } from '../features/links/hooks/useLinksQuery';
import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
} from '../features/links/hooks/useLinkMutations';
import { LINK_KIND_OPTIONS } from '../features/links/api/types';
import type { LinkKind } from '../features/links/api/types';

export function ProfilePage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCity, setEditCity] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateMutation = useUpdateUserMutation();
  const { data: availableSkills } = useSkillsQuery();
  const { data: myProjects, isLoading: projectsLoading } = useMyProjectsQuery();

  function handleStartEdit() {
    setEditName(user?.name ?? '');
    setEditEmail(user?.email ?? '');
    setEditBio(user?.bio ?? '');
    setEditCity(user?.city ?? '');
    setSelectedSkillIds(user?.skills?.map((s) => s.id) ?? []);
    setEditErrors({});
    setSaveError(null);
    setIsEditing(true);
  }

  function toggleSkill(id: string) {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (!user) return;

    const errors: Record<string, string> = {};
    const nameErr = validateName(editName);
    if (nameErr) errors.name = nameErr;
    const cityErr = validateCity(editCity);
    if (cityErr) errors.city = cityErr;
    if (!editEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail))
      errors.email = 'E-mail inválido';

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setSaveError(null);
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          name: editName,
          email: editEmail,
          bio: editBio,
          city: editCity,
          skillIds: selectedSkillIds,
        },
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setSaveError('Esse e-mail já está em uso por outra conta.');
        } else if (err.status === 0) {
          setSaveError('Sem conexão. Verifique sua internet.');
        } else {
          setSaveError('Algo deu errado. Tente novamente.');
        }
      } else {
        setSaveError('Algo deu errado. Tente novamente.');
      }
    }
  }

  const completionItems = [
    { label: 'Nome', done: !!user?.name },
    { label: 'Bio', done: !!user?.bio },
    { label: 'Cidade', done: !!user?.city },
    { label: 'Skills', done: (user?.skills?.length ?? 0) > 0 },
  ];

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : null;

  const isSaving = updateMutation.isPending;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <section className="relative overflow-hidden paper-tex">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">perfil</div>
            <span className="h-px w-8 bg-line-2" />
            <span className="serif italic text-[14px] text-mute">
              visível pra outras pessoas construindo na Juntaê
            </span>
          </div>

          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 lg:col-span-9">
              <div className="flex items-center gap-5">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-ink-2 text-[26px] font-bold text-cream display">
                  {avatarInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                    {user?.name ?? 'Seu nome'}
                  </h1>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 pl-[92px] text-[14px] text-ink-2">
                <span className="mono">{user?.email}</span>
                {memberSince && (
                  <>
                    <span className="text-mute">·</span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--color-mute)' }}
                      />
                      desde {memberSince}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 lg:text-right">
              <p className="serif italic max-w-[28ch] text-[17px] leading-[1.5] text-ink-2 lg:ml-auto">
                Seu jeito de aparecer pra quem quer construir{' '}
                <span className="text-accent">junto</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              {isEditing ? (
                <EditForm
                  editName={editName}
                  editEmail={editEmail}
                  editBio={editBio}
                  editCity={editCity}
                  selectedSkillIds={selectedSkillIds}
                  availableSkills={availableSkills ?? []}
                  errors={editErrors}
                  saveError={saveError}
                  isSaving={isSaving}
                  onChangeName={setEditName}
                  onChangeEmail={setEditEmail}
                  onChangeBio={setEditBio}
                  onChangeCity={setEditCity}
                  onToggleSkill={toggleSkill}
                  onSave={() => void handleSave()}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <>
                  <ProfileSection eyebrow="01 · sobre" title="Bio" divider={false}>
                    {user?.bio ? (
                      <p className="text-[16px] leading-[1.65] text-ink-2">{user.bio}</p>
                    ) : (
                      <ProfileEmptyState cta="adicionar bio" onCta={handleStartEdit}>
                        Conte em poucas linhas como você gosta de contribuir num projeto — o que
                        você topa fazer, o ritmo que combina com você, o tipo de coisa que te anima.
                        <br />É o que outras pessoas vão ler primeiro.
                      </ProfileEmptyState>
                    )}
                  </ProfileSection>

                  <ProfileSection eyebrow="02 · onde" title="Cidade">
                    {user?.city ? (
                      <p className="text-[16px] text-ink-2">{user.city}</p>
                    ) : (
                      <ProfileEmptyState cta="adicionar cidade" onCta={handleStartEdit}>
                        De onde você está construindo? Algumas pessoas gostam de encontrar gente da
                        mesma cidade pra projetos presenciais — outras fazem tudo remoto.
                      </ProfileEmptyState>
                    )}
                  </ProfileSection>

                  <ProfileSection eyebrow="03 · como contribuo" title="Skills">
                    {user?.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex h-8 items-center rounded-full bg-cream-2 px-3.5 text-[13px] text-ink ring-1 ring-line"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <ProfileEmptyState cta="adicionar skills" onCta={handleStartEdit}>
                        Liste o que você topa fazer num time — design, código, escrita, produto,
                        organização, o que for.{' '}
                        <span className="not-italic font-medium text-ink">
                          Skills ajudam outras pessoas a te chamar pro projeto certo.
                        </span>
                      </ProfileEmptyState>
                    )}
                  </ProfileSection>

                  <ProfileSection eyebrow="04 · onde te encontrar" title="Links">
                    <LinksManager />
                  </ProfileSection>

                  <ProfileSection eyebrow="05 · projetos no Juntaê" title="Construções">
                    <ProjectHistory projects={myProjects ?? []} isLoading={projectsLoading} />
                  </ProfileSection>
                </>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <CompletionCard items={completionItems} onEdit={handleStartEdit} />

                <div className="mt-5 rounded-[20px] bg-cream p-5 ring-1 ring-line">
                  <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">conta</div>
                  <ul className="mt-3 divide-y divide-line text-[14px]">
                    <li className="py-3 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex w-full items-center justify-between gap-2 text-accent"
                      >
                        Sair da Juntaê
                        <span className="text-accent">
                          <ArrowRight size={14} aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface EditFormProps {
  editName: string;
  editEmail: string;
  editBio: string;
  editCity: string;
  selectedSkillIds: string[];
  availableSkills: { id: string; name: string }[];
  errors: Record<string, string>;
  saveError: string | null;
  isSaving: boolean;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeBio: (v: string) => void;
  onChangeCity: (v: string) => void;
  onToggleSkill: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditForm({
  editName,
  editEmail,
  editBio,
  editCity,
  selectedSkillIds,
  availableSkills,
  errors,
  saveError,
  isSaving,
  onChangeName,
  onChangeEmail,
  onChangeBio,
  onChangeCity,
  onToggleSkill,
  onSave,
  onCancel,
}: EditFormProps) {
  return (
    <div className="rounded-[24px] bg-cream-2 p-6 ring-1 ring-line md:p-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <div className="display text-[20px] font-semibold text-ink">Editar perfil</div>
          <div className="mt-0.5 text-[13px] text-mute">as alterações são salvas na sua conta</div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancelar edição"
          className="flex h-8 w-8 items-center justify-center rounded-full text-mute ring-1 ring-line transition hover:text-ink"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-5">
        <EditField
          label="nome"
          value={editName}
          onChange={onChangeName}
          error={errors.name}
          autoComplete="given-name"
        />
        <EditField
          label="email"
          type="email"
          value={editEmail}
          onChange={onChangeEmail}
          error={errors.email}
          autoComplete="email"
        />
        <CityAutocomplete
          label="cidade"
          value={editCity}
          onChange={onChangeCity}
          error={errors.city}
        />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute">
            bio
          </label>
          <textarea
            value={editBio}
            onChange={(e) => onChangeBio(e.target.value)}
            rows={4}
            placeholder="Conte como você gosta de contribuir…"
            className="w-full resize-none rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>

        {availableSkills.length > 0 && (
          <div>
            <div className="mb-2.5 text-[12px] font-medium uppercase tracking-[.18em] text-mute">
              skills
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => {
                const selected = selectedSkillIds.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => onToggleSkill(skill.id)}
                    className={[
                      'inline-flex h-8 items-center rounded-full px-3.5 text-[13px] transition',
                      selected
                        ? 'bg-ink text-cream ring-1 ring-ink'
                        : 'bg-transparent text-mute ring-1 ring-dashed ring-line-2 hover:text-ink hover:ring-ink',
                    ].join(' ')}
                  >
                    {selected ? '✓ ' : '+ '}
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {saveError && (
        <p role="alert" className="mt-5 text-center text-[13px] text-accent">
          {saveError}
        </p>
      )}

      <div className="mt-7 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-ink text-[14px] font-medium text-cream transition-colors hover:bg-black disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          {isSaving ? 'Salvando…' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

interface EditFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

function EditField({ label, value, onChange, error, type = 'text', autoComplete }: EditFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={[
          'w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink placeholder:text-mute focus:outline-none focus:ring-2',
          error ? 'ring-1 ring-accent focus:ring-accent' : 'ring-1 ring-line focus:ring-ink',
        ].join(' ')}
      />
      {error && <p className="mt-1 text-[12px] text-accent">{error}</p>}
    </div>
  );
}

function LinksManager() {
  const { data: links, isLoading } = useLinksQuery();
  const createMutation = useCreateLinkMutation();
  const deleteMutation = useDeleteLinkMutation();

  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<LinkKind>('LINKEDIN');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [addError, setAddError] = useState('');

  function resetForm() {
    setKind('LINKEDIN');
    setLabel('');
    setUrl('');
    setUrlError('');
    setAddError('');
    setAdding(false);
  }

  async function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError('URL é obrigatória');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setUrlError('URL inválida');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setUrlError('Use http:// ou https://');
      return;
    }
    setUrlError('');
    setAddError('');
    try {
      await createMutation.mutateAsync({ kind, label: label.trim() || undefined, url: trimmed });
      resetForm();
    } catch {
      setAddError('Não foi possível adicionar o link. Tente novamente.');
    }
  }

  if (isLoading) {
    return <p className="text-[13px] text-mute">Carregando links…</p>;
  }

  return (
    <div className="space-y-3">
      {links && links.length > 0 && (
        <ul className="space-y-2">
          {links.map((link) => {
            const kindLabel =
              LINK_KIND_OPTIONS.find((o) => o.value === link.kind)?.label ?? link.kind;
            return (
              <li
                key={link.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-cream-2 px-4 py-3 ring-1 ring-line"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] uppercase tracking-[.18em] text-mute">
                      {kindLabel}
                    </span>
                    {link.label && <span className="text-[13px] text-ink-2">· {link.label}</span>}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block truncate text-[13px] text-ink underline-offset-2 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(link.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Remover link ${kindLabel}`}
                  className="shrink-0 rounded-lg p-1.5 text-mute transition hover:bg-cream hover:text-accent disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <div className="rounded-xl bg-cream-2 p-4 ring-1 ring-line space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute">
              tipo
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as LinkKind)}
              className="w-full rounded-xl bg-cream px-4 py-3 text-[14px] text-ink ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-ink"
            >
              {LINK_KIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute">
              rótulo <span className="normal-case font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: meu portfólio"
              className="w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://"
              className={[
                'w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink placeholder:text-mute focus:outline-none focus:ring-2',
                urlError
                  ? 'ring-1 ring-accent focus:ring-accent'
                  : 'ring-1 ring-line focus:ring-ink',
              ].join(' ')}
            />
            {urlError && <p className="mt-1 text-[12px] text-accent">{urlError}</p>}
          </div>
          {addError && (
            <p role="alert" className="text-[12px] text-accent">
              {addError}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={createMutation.isPending}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-cream transition hover:bg-black disabled:pointer-events-none disabled:opacity-50"
            >
              {createMutation.isPending ? 'Salvando…' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={createMutation.isPending}
              className="inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-line transition hover:bg-cream disabled:pointer-events-none disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-dashed ring-line-2 transition hover:ring-ink"
        >
          + Adicionar link
        </button>
      )}
    </div>
  );
}

interface ProjectHistoryProps {
  projects: import('../features/projects/api/types').ProjectListItem[];
  isLoading: boolean;
}

function ProjectHistory({ projects, isLoading }: ProjectHistoryProps) {
  if (isLoading) {
    return <div className="py-6 text-center text-[13px] text-mute">Carregando projetos…</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-6 md:p-7">
        <div className="display text-[20px] font-semibold leading-tight text-ink">
          Você ainda não criou nenhum projeto.
        </div>
        <p className="serif italic mt-3 max-w-[52ch] text-[16px] leading-[1.55] text-ink-2">
          Crie o seu projeto ou entre em um que já está acontecendo.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-cream transition-colors hover:bg-black"
          >
            Criar projeto
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2"
          >
            Explorar projetos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ApiProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
