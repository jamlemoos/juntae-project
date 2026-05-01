import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { ProjectTextarea } from '../../components/ProjectTextarea';

interface ApplicationPanelProps {
  roleTitle: string;
  onClose: () => void;
}

type PanelState = 'idle' | 'submitted';

export function ApplicationPanel({ roleTitle, onClose }: ApplicationPanelProps) {
  const [message, setMessage] = useState('');
  const [relevantSkill, setRelevantSkill] = useState('');
  const [errors, setErrors] = useState<{ message?: string; relevantSkill?: string }>({});
  const [panelState, setPanelState] = useState<PanelState>('idle');

  function validate() {
    const next: typeof errors = {};
    if (message.trim().length === 0) next.message = 'Obrigatório';
    if (relevantSkill.trim().length === 0) next.relevantSkill = 'Obrigatório';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setPanelState('submitted');
  }

  return (
    <div className="mt-3 rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
            candidatura
          </p>
          <h3 className="display mt-0.5 text-[16px] font-semibold text-ink">
            {roleTitle || 'Papel sem título'}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar candidatura"
          onClick={onClose}
          className="mt-0.5 shrink-0 rounded text-mute transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {panelState === 'submitted' ? (
        <div className="rounded-xl bg-cream px-5 py-4 ring-1 ring-line">
          <p className="text-[14px] font-medium text-ink">Candidatura recebida.</p>
          <p className="mt-1 text-[13px] leading-relaxed text-mute">
            Candidatura ainda não está conectada ao backend.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <ProjectTextarea
              label="Mensagem curta"
              placeholder="Me conta um pouco sobre você e por que quer participar…"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={errors.message}
            />
            <ProjectTextarea
              label="Como posso ajudar"
              placeholder="Quais habilidades ou experiências você traz para esse papel…"
              rows={3}
              value={relevantSkill}
              onChange={(e) => setRelevantSkill(e.target.value)}
              error={errors.relevantSkill}
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Quero participar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
