import { X } from 'lucide-react';
import type { RoleDraft, RoleErrors } from '../types';
import { ProjectField } from './ProjectField';
import { ProjectSelect } from './ProjectSelect';
import { ProjectTextarea } from './ProjectTextarea';

const ROLE_STATUS_OPTIONS = [
  { value: 'open', label: 'Procurando alguém' },
  { value: 'filled', label: 'Vaga preenchida' },
];

interface RoleCardProps {
  index: number;
  role: RoleDraft;
  errors: RoleErrors;
  onChange: (field: 'title' | 'description' | 'status', value: string) => void;
  onRemove: () => void;
}

export function RoleCard({ index, role, errors, onChange, onRemove }: RoleCardProps) {
  return (
    <div className="rounded-[20px] bg-cream-2 p-6 ring-1 ring-line">
      <div className="mb-5 flex items-center justify-between">
        <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">
          papel {String(index + 1).padStart(2, '0')}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover papel ${index + 1}`}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-mute transition hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <ProjectField
          label="Função"
          placeholder="Ex: Dev front-end, Designer de produto, Pessoa de negócios"
          value={role.title}
          onChange={(e) => onChange('title', e.target.value)}
          error={errors.title}
        />
        <ProjectTextarea
          label="O que essa pessoa faria?"
          placeholder="Descreva o que espera dessa pessoa — o que ela vai fazer, o que facilita a colaboração."
          value={role.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
          error={errors.description}
        />
        <ProjectSelect
          label="Situação"
          options={ROLE_STATUS_OPTIONS}
          placeholder="Como está essa vaga?"
          value={role.status}
          onChange={(v) => onChange('status', v)}
          error={errors.status}
        />
      </div>
    </div>
  );
}
