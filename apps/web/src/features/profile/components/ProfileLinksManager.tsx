import { useState, useId } from 'react';
import { Trash2 } from 'lucide-react';
import { useLinksQuery } from '../../links/hooks/useLinksQuery';
import { useCreateLinkMutation, useDeleteLinkMutation } from '../../links/hooks/useLinkMutations';
import { LINK_KIND_OPTIONS } from '../../links/api/types';
import type { LinkKind } from '../../links/api/types';

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
              className="w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink"
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
                  ? 'ring-1 ring-accent focus:ring-accent'
                  : 'ring-1 ring-line focus:ring-ink',
              ].join(' ')}
            />
            {urlError && (
              <p id={`${urlId}-err`} className="mt-1 text-[12px] text-accent">
                {urlError}
              </p>
            )}
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
