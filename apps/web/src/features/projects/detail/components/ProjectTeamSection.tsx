import { useState } from 'react';
import { SectionLayout } from '../../../../shared/ui/SectionLayout';
import { Pencil, X } from 'lucide-react';
import type { MemberDraft, ProjectData } from '../types';
import { ProjectMemberCard } from './ProjectMemberCard';
import { ProjectField } from '../../components/ProjectField';

interface ProjectTeamSectionProps {
  isEditing: boolean;
  editDraft: ProjectData;
  setEditDraft: (updater: (prev: ProjectData) => ProjectData) => void;
  members: MemberDraft[];
  onStartEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectTeamSection({
  isEditing,
  editDraft,
  setEditDraft,
  members,
  onStartEditing,
  onSave,
  onCancel,
}: ProjectTeamSectionProps) {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  function addMember() {
    const trimmedName = newName.trim();
    if (!trimmedName) return;
    const member: MemberDraft = {
      id: crypto.randomUUID(),
      name: trimmedName,
      role: newRole.trim(),
    };
    setEditDraft((p) => ({ ...p, members: [...p.members, member] }));
    setNewName('');
    setNewRole('');
  }

  function removeMember(id: string) {
    setEditDraft((p) => ({ ...p, members: p.members.filter((m) => m.id !== id) }));
  }

  function handleSave() {
    setNewName('');
    setNewRole('');
    onSave();
  }

  function handleCancel() {
    setNewName('');
    setNewRole('');
    onCancel();
  }

  return (
    <SectionLayout
      eyebrow="02 · time"
      title="Quem já está"
      id="section-time"
      divider
      action={
        !isEditing ? (
          <button
            type="button"
            aria-label="Editar seção Time"
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
          <ProjectMemberCard name="Você" role="Criador do projeto" isCreator />

          {editDraft.members.map((member) => (
            <div key={member.id} className="group relative">
              <ProjectMemberCard name={member.name} role={member.role} />
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                aria-label={`Remover ${member.name}`}
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-mute opacity-0 transition group-hover:opacity-100 hover:bg-cream hover:text-ink focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
            <p className="mono mb-3 text-[11px] uppercase tracking-[.18em] text-mute">
              adicionar pessoa
            </p>
            <div className="flex flex-col gap-3">
              <ProjectField
                label="Nome"
                placeholder="Ex: Maria Silva"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <ProjectField
                label="Papel no projeto"
                placeholder="Ex: Designer, Dev back-end"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <button
                type="button"
                onClick={addMember}
                disabled={!newName.trim()}
                className="inline-flex h-9 w-fit items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-9 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ProjectMemberCard name="Você" role="Criador do projeto" isCreator />
          {members.map((member) => (
            <ProjectMemberCard key={member.id} name={member.name} role={member.role} />
          ))}
          {members.length === 0 && (
            <p className="serif italic mt-2 text-[14px] leading-[1.55] text-ink-2">
              Você começou esse projeto. Agora é hora de chamar quem falta.
            </p>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
