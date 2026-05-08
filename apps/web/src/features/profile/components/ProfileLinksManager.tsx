import { useState, useId } from 'react';
import {
  FaLinkedin,
  FaGithub,
  FaFigma,
  FaBehance,
  FaDribbble,
  FaGlobe,
  FaPencil,
  FaTrashCan,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { useLinksQuery } from '../../links/hooks/useLinksQuery';
import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useUpdateLinkMutation,
} from '../../links/hooks/useLinkMutations';
import { LINK_KIND_OPTIONS } from '../../links/api/types';
import type { LinkKind, UserLink } from '../../links/api/types';

// ─── platform metadata ───────────────────────────────────────────────────────

type LinkMeta = {
  label: string;
  BrandIcon: IconType;
  color: string;
};

function getLinkMeta(kind: LinkKind): LinkMeta {
  switch (kind) {
    case 'LINKEDIN':
      return { label: 'LinkedIn', BrandIcon: FaLinkedin, color: 'text-[#0A66C2]' };
    case 'GITHUB':
      return { label: 'GitHub', BrandIcon: FaGithub, color: 'text-ink' };
    case 'FIGMA':
      return { label: 'Figma', BrandIcon: FaFigma, color: 'text-[#F24E1E]' };
    case 'BEHANCE':
      return { label: 'Behance', BrandIcon: FaBehance, color: 'text-[#1769FF]' };
    case 'DRIBBBLE':
      return { label: 'Dribbble', BrandIcon: FaDribbble, color: 'text-[#EA4C89]' };
    case 'PORTFOLIO':
      return { label: 'Portfólio', BrandIcon: FaGlobe, color: 'text-primary' };
    default:
      return { label: 'Site', BrandIcon: FaGlobe, color: 'text-mute' };
  }
}

// ─── link row ────────────────────────────────────────────────────────────────

interface LinkRowProps {
  link: UserLink;
  onDelete: () => void;
  isDeleting: boolean;
}

function LinkRow({ link, onDelete, isDeleting }: LinkRowProps) {
  const updateMutation = useUpdateLinkMutation();

  const [editing, setEditing] = useState(false);
  const [editKind, setEditKind] = useState<LinkKind>(link.kind);
  const [editLabel, setEditLabel] = useState(link.label ?? '');
  const [editUrl, setEditUrl] = useState(link.url);
  const [editUrlError, setEditUrlError] = useState('');
  const [editError, setEditError] = useState('');

  const kindId = useId();
  const labelId = useId();
  const urlId = useId();

  function startEdit() {
    setEditKind(link.kind);
    setEditLabel(link.label ?? '');
    setEditUrl(link.url);
    setEditUrlError('');
    setEditError('');
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function handleSave() {
    const trimmed = editUrl.trim();
    if (!trimmed) {
      setEditUrlError('URL é obrigatória');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setEditUrlError('URL inválida');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setEditUrlError('Use http:// ou https://');
      return;
    }
    setEditUrlError('');
    setEditError('');
    try {
      await updateMutation.mutateAsync({
        id: link.id,
        data: { kind: editKind, label: editLabel.trim() || undefined, url: trimmed },
      });
      setEditing(false);
    } catch {
      setEditError('Não foi possível salvar. Tente novamente.');
    }
  }

  const meta = getLinkMeta(link.kind);
  const kindLabel = LINK_KIND_OPTIONS.find((o) => o.value === link.kind)?.label ?? link.kind;

  if (editing) {
    return (
      <li className="rounded-xl bg-cream-2 p-4 ring-1 ring-primary/40 space-y-3">
        <div>
          <label
            htmlFor={kindId}
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
          >
            tipo
          </label>
          <select
            id={kindId}
            value={editKind}
            onChange={(e) => setEditKind(e.target.value as LinkKind)}
            className="w-full rounded-xl bg-cream px-4 py-3 text-[14px] text-ink ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {LINK_KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={labelId}
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
          >
            rótulo <span className="normal-case font-normal">(opcional)</span>
          </label>
          <input
            id={labelId}
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            placeholder="Ex: meu portfólio"
            className="w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor={urlId}
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
          >
            URL
          </label>
          <input
            id={urlId}
            type="url"
            value={editUrl}
            onChange={(e) => {
              setEditUrl(e.target.value);
              setEditUrlError('');
            }}
            placeholder="https://"
            aria-invalid={editUrlError ? true : undefined}
            aria-describedby={editUrlError ? `${urlId}-err` : undefined}
            className={[
              'w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink placeholder:text-mute focus:outline-none focus:ring-2',
              editUrlError
                ? 'ring-1 ring-error focus:ring-error'
                : 'ring-1 ring-line focus:ring-primary',
            ].join(' ')}
          />
          {editUrlError && (
            <p id={`${urlId}-err`} className="mt-1 text-[12px] text-error">
              {editUrlError}
            </p>
          )}
        </div>
        {editError && (
          <p role="alert" className="text-[12px] text-error">
            {editError}
          </p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateMutation.isPending}
            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full bg-primary text-[13px] font-medium text-white transition hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {updateMutation.isPending ? 'Salvando…' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            disabled={updateMutation.isPending}
            className="inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-line transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between py-2">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
      >
        <meta.BrandIcon className={`size-4 shrink-0 ${meta.color}`} aria-hidden="true" />
        <span className="text-sm font-medium text-ink group-hover:underline">
          {link.label ? `${meta.label} · ${link.label}` : meta.label}
        </span>
      </a>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={startEdit}
          disabled={isDeleting}
          aria-label={`Editar link ${kindLabel}`}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-mute transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaPencil size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Remover link ${kindLabel}`}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-mute transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaTrashCan size={13} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function ProfileLinksManager() {
  const { data: links, isLoading } = useLinksQuery();
  const createMutation = useCreateLinkMutation();
  const deleteMutation = useDeleteLinkMutation();

  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<LinkKind>('LINKEDIN');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [addError, setAddError] = useState('');

  const kindId = useId();
  const labelId = useId();
  const urlId = useId();

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
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onDelete={() => deleteMutation.mutate(link.id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </ul>
      )}

      {adding ? (
        <div className="rounded-xl bg-cream-2 p-4 ring-1 ring-line space-y-3">
          <div>
            <label
              htmlFor={kindId}
              className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
            >
              tipo
            </label>
            <select
              id={kindId}
              value={kind}
              onChange={(e) => setKind(e.target.value as LinkKind)}
              className="w-full rounded-xl bg-cream px-4 py-3 text-[14px] text-ink ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {LINK_KIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={labelId}
              className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
            >
              rótulo <span className="normal-case font-normal">(opcional)</span>
            </label>
            <input
              id={labelId}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: meu portfólio"
              className="w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor={urlId}
              className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
            >
              URL
            </label>
            <input
              id={urlId}
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://"
              aria-invalid={urlError ? true : undefined}
              aria-describedby={urlError ? `${urlId}-err` : undefined}
              className={[
                'w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink placeholder:text-mute focus:outline-none focus:ring-2',
                urlError
                  ? 'ring-1 ring-error focus:ring-error'
                  : 'ring-1 ring-line focus:ring-primary',
              ].join(' ')}
            />
            {urlError && (
              <p id={`${urlId}-err`} className="mt-1 text-[12px] text-error">
                {urlError}
              </p>
            )}
          </div>
          {addError && (
            <p role="alert" className="text-[12px] text-error">
              {addError}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={createMutation.isPending}
              className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full bg-primary text-[13px] font-medium text-white transition hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {createMutation.isPending ? 'Salvando…' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={createMutation.isPending}
              className="inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-medium text-ink ring-1 ring-line transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] cursor-pointer font-medium text-ink ring-1 ring-dashed ring-line-2 transition hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Adicionar link
        </button>
      )}
    </div>
  );
}
