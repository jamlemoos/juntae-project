export type FormProjectStatus = 'idea' | 'forming_team' | 'in_progress' | 'closed';
export type RoleStatus = 'open' | 'filled';

export const PROJECT_STATUS_OPTIONS: { value: FormProjectStatus; label: string }[] = [
  { value: 'idea', label: 'Só uma ideia ainda' },
  { value: 'forming_team', label: 'Montando o time' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'closed', label: 'Encerrado' },
];

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
