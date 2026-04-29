import { useState } from 'react';
import type { ProjectData, StoredDraft } from '../types';

export function emptyProject(): ProjectData {
  return { title: '', description: '', workMode: '', city: '', roles: [], members: [] };
}

function readStored(projectId: string): ProjectData {
  try {
    const raw = sessionStorage.getItem(`project-draft-${projectId}`);
    if (!raw) return emptyProject();
    const stored = JSON.parse(raw) as StoredDraft;
    return {
      title: stored.title?.trim() ?? '',
      description: stored.description?.trim() ?? '',
      workMode: '',
      city: '',
      roles: Array.isArray(stored.roles) ? stored.roles : [],
      members: [],
    };
  } catch {
    return emptyProject();
  }
}

function writeStored(projectId: string, data: ProjectData): void {
  try {
    sessionStorage.setItem(`project-draft-${projectId}`, JSON.stringify(data));
  } catch {
    // storage may be unavailable
  }
}

export function saveProjectDraft(
  projectId: string,
  data: Omit<ProjectData, 'workMode' | 'city' | 'members'>
): void {
  writeStored(projectId, { workMode: '', city: '', members: [], ...data });
}

export function useProjectDraft(projectId: string) {
  const [project, setProjectState] = useState<ProjectData>(() =>
    projectId ? readStored(projectId) : emptyProject()
  );

  function setProject(next: ProjectData) {
    if (projectId) writeStored(projectId, next);
    setProjectState(next);
  }

  return { project, setProject };
}
