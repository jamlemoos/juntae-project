import { useId } from 'react';
import { X } from 'lucide-react';
import { ProfileField } from './ProfileField';
import { ProfileSkillsSelector } from './ProfileSkillsSelector';
import { CityAutocomplete } from '../../../shared/ui/CityAutocomplete';
import { AVAILABILITY_OPTIONS } from '../utils/profileDisplay';
import type { ProfileEditFormValues } from '../hooks/useProfileEditForm';

interface ProfileEditFormProps {
  fields: ProfileEditFormValues;
  errors: Record<string, string>;
  saveError: string | null;
  isSaving: boolean;
  availableSkills: { id: string; name: string }[];
  onSetField: <K extends keyof ProfileEditFormValues>(
    key: K,
    value: ProfileEditFormValues[K]
  ) => void;
  onToggleSkill: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  fields,
  errors,
  saveError,
  isSaving,
  availableSkills,
  onSetField,
  onToggleSkill,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const availabilityId = useId();
  const bioId = useId();

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
        <ProfileField
          label="nome"
          value={fields.name}
          onChange={(e) => onSetField('name', e.target.value)}
          error={errors.name}
          autoComplete="given-name"
        />
        <ProfileField
          label="email"
          type="email"
          value={fields.email}
          onChange={(e) => onSetField('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <CityAutocomplete
          label="cidade"
          value={fields.city}
          onChange={(v) => onSetField('city', v)}
          error={errors.city}
        />
        <ProfileField
          label="headline"
          value={fields.headline}
          onChange={(e) => onSetField('headline', e.target.value)}
          placeholder="Ex: Desenvolvedor Backend · UFRN"
        />
        <div>
          <label
            htmlFor={availabilityId}
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
          >
            disponibilidade
          </label>
          <select
            id={availabilityId}
            value={fields.availability}
            onChange={(e) => onSetField('availability', e.target.value)}
            className="w-full rounded-xl bg-cream px-4 py-3 text-[14px] text-ink ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-ink"
          >
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={bioId}
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
          >
            bio
          </label>
          <textarea
            id={bioId}
            value={fields.bio}
            onChange={(e) => onSetField('bio', e.target.value)}
            rows={4}
            placeholder="Conte como você gosta de contribuir…"
            className="w-full resize-none rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>

        <ProfileSkillsSelector
          availableSkills={availableSkills}
          selectedSkillIds={fields.selectedSkillIds}
          onToggle={onToggleSkill}
        />
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
