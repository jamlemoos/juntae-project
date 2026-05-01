import { useState, useEffect } from 'react';
import type { RoleDraft } from '../../types';
import type { MemberDraft, ProjectData, StoredDraft } from '../types';

export function emptyProject(): ProjectData {
  return {
    title: '',
    description: '',
    workMode: '',
    city: '',
    roles: [],
    members: [],
    publishStatus: 'draft',
  };
}

function readStoredString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readStoredWorkMode(value: unknown): ProjectData['workMode'] {
  if (value === 'remote' || value === 'presential' || value === 'hybrid') return value;
  return '';
}

function readStoredPublishStatus(value: unknown): ProjectData['publishStatus'] {
  if (value === 'published') return 'published';
  return 'draft';
}

function isValidRoleDraft(value: unknown): value is RoleDraft {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    (obj.status === '' || obj.status === 'open' || obj.status === 'filled')
  );
}

function isValidMemberDraft(value: unknown): value is MemberDraft {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && typeof obj.name === 'string' && typeof obj.role === 'string';
}

const DRAFT_KEY_PREFIX = 'project-draft-';

function readStored(projectId: string): ProjectData {
  try {
    const raw = sessionStorage.getItem(`${DRAFT_KEY_PREFIX}${projectId}`);
    if (!raw) return emptyProject();
    const stored = JSON.parse(raw) as StoredDraft;
    return {
      title: readStoredString(stored.title),
      description: readStoredString(stored.description),
      workMode: readStoredWorkMode(stored.workMode),
      city: readStoredString(stored.city),
      roles: Array.isArray(stored.roles) ? stored.roles.filter(isValidRoleDraft) : [],
      members: Array.isArray(stored.members) ? stored.members.filter(isValidMemberDraft) : [],
      publishStatus: readStoredPublishStatus(stored.publishStatus),
    };
  } catch {
    return emptyProject();
  }
}

function writeStored(projectId: string, data: ProjectData): boolean {
  try {
    sessionStorage.setItem(`${DRAFT_KEY_PREFIX}${projectId}`, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function saveProjectDraft(
  projectId: string,
  data: Omit<ProjectData, 'workMode' | 'city' | 'members' | 'publishStatus'>
): boolean {
  return writeStored(projectId, {
    workMode: '',
    city: '',
    members: [],
    publishStatus: 'draft',
    ...data,
  });
}

export type ProjectDraftEntry = { id: string; data: ProjectData };

export function readAllProjectDrafts(): ProjectDraftEntry[] {
  try {
    const result: ProjectDraftEntry[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(DRAFT_KEY_PREFIX)) {
        const id = key.slice(DRAFT_KEY_PREFIX.length);
        if (id) result.push({ id, data: readStored(id) });
      }
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  } catch {
    return [];
  }
}

export function useProjectDraft(projectId: string) {
  const [project, setProjectState] = useState<ProjectData>(() =>
    projectId ? readStored(projectId) : emptyProject()
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjectState(projectId ? readStored(projectId) : emptyProject());
  }, [projectId]);

  function setProject(next: ProjectData) {
    if (projectId) writeStored(projectId, next);
    setProjectState(next);
  }

  return { project, setProject };
}
