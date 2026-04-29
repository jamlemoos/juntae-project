export type ProjectStatus = 'idea' | 'forming_team' | 'in_progress' | 'paused';
export type RoleStatus = 'open' | 'filled';

export type RoleDraft = {
  id: string;
  title: string;
  description: string;
  status: RoleStatus | '';
};

export type RoleErrors = {
  title?: string;
  description?: string;
  status?: string;
};
