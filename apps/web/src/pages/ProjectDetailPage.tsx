import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useProjectDraft } from '../features/projects/detail/hooks/useProjectDraft';
import { useProjectDetailEditing } from '../features/projects/detail/hooks/useProjectDetailEditing';
import { formatWorkMode } from '../features/projects/detail/utils';
import { ProjectDetailHeader } from '../features/projects/detail/components/ProjectDetailHeader';
import { ProjectStatusRail } from '../features/projects/detail/components/ProjectStatusRail';
import { ProjectAboutSection } from '../features/projects/detail/components/ProjectAboutSection';
import { ProjectTeamSection } from '../features/projects/detail/components/ProjectTeamSection';
import { ProjectNeededRolesSection } from '../features/projects/detail/components/ProjectNeededRolesSection';
import type { PublishStatus } from '../features/projects/detail/types';

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });

  const { project, setProject } = useProjectDraft(projectId);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('draft');
  const { editingSection, editDraft, setEditDraft, startEditing, cancelEditing } =
    useProjectDetailEditing();

  const workModeDisplay = formatWorkMode(project.workMode, project.city);

  const checklist = [
    { label: 'Nome claro', done: project.title.trim().length > 0 },
    { label: 'Ideia explicada', done: project.description.trim().length > 0 },
    { label: 'Pelo menos uma pessoa', done: true },
    { label: 'Forma de trabalho definida', done: project.workMode !== '' },
  ];

  function handleSave() {
    setProject(editDraft);
    cancelEditing();
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ProjectDetailHeader
        title={project.title}
        description={project.description}
        workModeDisplay={workModeDisplay}
        publishStatus={publishStatus}
      />

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              <ProjectAboutSection
                project={project}
                workModeDisplay={workModeDisplay}
                isEditing={editingSection === 'sobre'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onStartEditing={() => startEditing('sobre', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <ProjectTeamSection
                isEditing={editingSection === 'time'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                members={project.members}
                onStartEditing={() => startEditing('time', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <ProjectNeededRolesSection
                isEditing={editingSection === 'procurando'}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                roles={project.roles}
                onStartEditing={() => startEditing('procurando', project)}
                onSave={handleSave}
                onCancel={cancelEditing}
              />

              <div className="border-t pt-10 hairline">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-[14px] text-ink-2 transition-colors hover:text-ink"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Voltar para projetos
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 lg:pt-14">
                <ProjectStatusRail
                  publishStatus={publishStatus}
                  checklist={checklist}
                  onPublish={() => setPublishStatus('published')}
                  onEditProject={() => startEditing('sobre', project)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
