import { useState } from 'react';
import type { EditingSection, ProjectData } from '../types';
import { emptyProject } from './useProjectDraft';

export function useProjectDetailEditing() {
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [editDraftState, setEditDraftState] = useState<ProjectData>(emptyProject());

  function startEditing(section: Exclude<EditingSection, null>, current: ProjectData) {
    setEditDraftState({ ...current, roles: [...current.roles], members: [...current.members] });
    setEditingSection(section);
  }

  function cancelEditing() {
    setEditingSection(null);
  }

  function setEditDraft(updater: (prev: ProjectData) => ProjectData) {
    setEditDraftState(updater);
  }

  return { editingSection, editDraft: editDraftState, setEditDraft, startEditing, cancelEditing };
}
