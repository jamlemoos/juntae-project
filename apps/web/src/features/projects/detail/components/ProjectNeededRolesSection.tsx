import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { SectionLayout } from '../../../../shared/ui/SectionLayout';
import type { ProjectData, PublishStatus } from '../types';
import type { RoleDraft } from '../../types';
import { RoleCard } from '../../components/RoleCard';
import { ProjectRoleCard } from './ProjectRoleCard';
import { ApplicationPanel } from './ApplicationPanel';

interface ProjectNeededRolesSectionProps {
  isEditing: boolean;
  editDraft: ProjectData;
  setEditDraft: (updater: (prev: ProjectData) => ProjectData) => void;
  roles: RoleDraft[];
  publishStatus: PublishStatus;
  onStartEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectNeededRolesSection({
  isEditing,
  editDraft,
  setEditDraft,
  roles,
  publishStatus,
  onStartEditing,
  onSave,
  onCancel,
}: ProjectNeededRolesSectionProps) {
  const [openApplicationRoleId, setOpenApplicationRoleId] = useState<string | null>(null);
  function addRole() {
    const newRole: RoleDraft = { id: crypto.randomUUID(), title: '', description: '', status: '' };
    setEditDraft((p) => ({ ...p, roles: [...p.roles, newRole] }));
  }

  function removeRole(id: string) {
    setEditDraft((p) => ({ ...p, roles: p.roles.filter((r) => r.id !== id) }));
  }

  function updateRole(id: string, field: 'title' | 'description' | 'status', value: string) {
    setEditDraft((p) => ({
      ...p,
      roles: p.roles.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  }

  return (
    <SectionLayout
      eyebrow="03 · procurando"
      title="Quem falta"
      id="section-procurando"
      divider
      action={
        !isEditing ? (
          <button
            type="button"
            aria-label="Editar seção Procurando"
            onClick={onStartEditing}
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded text-[13px] text-mute transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Pencil size={13} aria-hidden="true" />
            editar
          </button>
        ) : undefined
      }
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          {editDraft.roles.map((role, idx) => (
            <RoleCard
              key={role.id}
              index={idx}
              role={role}
              errors={{}}
              onChange={(field, value) => updateRole(role.id, field, value)}
              onRemove={() => removeRole(role.id)}
            />
          ))}
          <button
            type="button"
            onClick={addRole}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Plus size={14} aria-hidden="true" />
            Adicionar papel
          </button>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : roles.length > 0 ? (
        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <div key={role.id}>
              <ProjectRoleCard
                role={role}
                onApply={
                  publishStatus === 'published'
                    ? () => setOpenApplicationRoleId((prev) => (prev === role.id ? null : role.id))
                    : undefined
                }
              />
              {publishStatus === 'published' && openApplicationRoleId === role.id && (
                <ApplicationPanel
                  roleTitle={role.title}
                  onClose={() => setOpenApplicationRoleId(null)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
          <div className="display text-[17px] font-semibold text-ink">
            Adicione papéis para mostrar quem você procura no time.
          </div>
          <p className="serif italic mt-2 text-[16px] leading-[1.55] text-ink-2">
            Papéis ajudam outras pessoas a entender se têm o que o projeto precisa.
          </p>
        </div>
      )}
    </SectionLayout>
  );
}
