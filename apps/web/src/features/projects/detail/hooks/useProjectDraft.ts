import { useState } from 'react';
import type { ProjectData, StoredDraft } from '../types';

export function emptyProject(): ProjectData {
  return { title: '', description: '', workMode: '', city: '', roles: [], members: [] };
}

function readStoredString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readStoredArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function readStoredWorkMode(value: unknown): ProjectData['workMode'] {
  if (value === 'remote' || value === 'presential' || value === 'hybrid') return value;
  return '';
}

function readStored(projectId: string): ProjectData {
  try {
    const raw = sessionStorage.getItem(`project-draft-${projectId}`);
    if (!raw) return emptyProject();
    const stored = JSON.parse(raw) as StoredDraft;
    return {
      title: readStoredString(stored.title),
      description: readStoredString(stored.description),
      workMode: readStoredWorkMode(stored.workMode),
      city: readStoredString(stored.city),
      roles: readStoredArray(stored.roles),
      members: readStoredArray(stored.members),
    };
  } catch {
    return emptyProject();
  }
}

function writeStored(projectId: string, data: ProjectData): boolean {
  try {
    sessionStorage.setItem(`project-draft-${projectId}`, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function saveProjectDraft(
  projectId: string,
  data: Omit<ProjectData, 'workMode' | 'city' | 'members'>
): boolean {
  return writeStored(projectId, { workMode: '', city: '', members: [], ...data });
}

export function useProjectDraft(projectId: string) {
  const [trackedId, setTrackedId] = useState(projectId);
  const [project, setProjectState] = useState<ProjectData>(() =>
    projectId ? readStored(projectId) : emptyProject()
  );

  if (trackedId !== projectId) {
    setTrackedId(projectId);
    setProjectState(projectId ? readStored(projectId) : emptyProject());
  }

  function setProject(next: ProjectData) {
    if (projectId) writeStored(projectId, next);
    setProjectState(next);
  }

  return { project, setProject };
}
