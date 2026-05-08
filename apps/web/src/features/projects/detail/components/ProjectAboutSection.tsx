import { Pencil } from 'lucide-react';
import { SectionLayout } from '../../../../shared/ui/SectionLayout';
import type { ProjectData, WorkMode } from '../types';
import { ProjectField } from '../../components/ProjectField';
import { ProjectSelect } from '../../components/ProjectSelect';
import { ProjectTextarea } from '../../components/ProjectTextarea';

const WORK_MODE_OPTIONS: { value: WorkMode; label: string }[] = [
  { value: 'remote', label: 'Remoto' },
  { value: 'presential', label: 'Presencial' },
  { value: 'hybrid', label: 'Híbrido' },
];

interface ProjectAboutSectionProps {
  project: ProjectData;
  workModeDisplay: string;
  isEditing: boolean;
  editDraft: ProjectData;
  setEditDraft: (updater: (prev: ProjectData) => ProjectData) => void;
  onStartEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectAboutSection({
  project,
  workModeDisplay,
  isEditing,
  editDraft,
  setEditDraft,
  onStartEditing,
  onSave,
  onCancel,
}: ProjectAboutSectionProps) {
  return (
    <SectionLayout
      eyebrow="01 · sobre"
      title="Ideia"
      id="section-sobre"
      action={
        !isEditing ? (
          <button
            type="button"
            aria-label="Editar seção Sobre"
            onClick={onStartEditing}
            className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded text-[13px] text-mute transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Pencil size={13} aria-hidden="true" />
            editar
          </button>
        ) : undefined
      }
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <ProjectField
            label="Nome do projeto"
            value={editDraft.title}
            onChange={(e) => setEditDraft((p) => ({ ...p, title: e.target.value }))}
          />
          <ProjectTextarea
            label="Descrição"
            value={editDraft.description}
            onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))}
            rows={4}
          />
          <ProjectSelect
            label="Forma de trabalho"
            value={editDraft.workMode}
            onChange={(v) => setEditDraft((p) => ({ ...p, workMode: v as WorkMode | '' }))}
            options={WORK_MODE_OPTIONS}
            placeholder="Escolha a forma de trabalho…"
          />
          {(editDraft.workMode === 'presential' || editDraft.workMode === 'hybrid') && (
            <ProjectField
              label="Local de referência"
              placeholder="Ex: Natal, RN"
              value={editDraft.city}
              onChange={(e) => setEditDraft((p) => ({ ...p, city: e.target.value }))}
            />
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-9 cursor-pointer items-center rounded-full bg-primary px-5 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 cursor-pointer items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : project.description ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-cream-2 p-5 ring-1 ring-line md:p-6">
            <p className="text-[16px] leading-[1.65] text-ink-2">{project.description}</p>
          </div>
          {workModeDisplay && (
            <p className="mono pl-1 text-[11px] uppercase tracking-[.15em] text-mute">
              {workModeDisplay}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
          <div className="display text-[17px] font-semibold text-ink">
            Adicione uma descrição ao projeto.
          </div>
          <p className="serif italic mt-2 text-[15px] leading-[1.55] text-ink-2">
            Clique em editar para contar a ideia, o problema que você quer resolver e a forma de
            trabalho.
          </p>
        </div>
      )}
    </SectionLayout>
  );
}
