import type { RoleDraft } from '../types';

export type WorkMode = 'remote' | 'presential' | 'hybrid';
export type PublishStatus = 'draft' | 'published';
export type EditingSection = 'sobre' | 'time' | 'procurando' | null;

export type MemberDraft = {
  id: string;
  name: string;
  role: string;
};

export type ProjectData = {
  title: string;
  description: string;
  workMode: WorkMode | '';
  city: string;
  roles: RoleDraft[];
  members: MemberDraft[];
};

export type StoredDraft = {
  title?: unknown;
  description?: unknown;
  workMode?: unknown;
  city?: unknown;
  roles?: unknown;
  members?: unknown;
};

export type ChecklistItem = {
  label: string;
  done: boolean;
};
