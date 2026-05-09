import type { PublicUserResponse } from '../../../shared/api/types';

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type RoleStatus = 'OPEN' | 'CLOSED';

export type CreateProjectRoleInput = {
  title: string;
  description?: string;
  status: RoleStatus;
};

export type ProjectResponse = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRole = {
  id: string;
  title: string;
  description: string;
  status: RoleStatus;
  projectId: string;
  applicationsCount: number;
  hasApplied: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  creator: PublicUserResponse;
  openRolesCount: number;
  totalRolesCount: number;
  hasApplied: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  isOwner: boolean;
  creator: PublicUserResponse;
  roles: ProjectRole[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectSearchFilter = {
  q?: string;
  status?: string;
};

export type ProjectsPagination = {
  page?: number;
  limit?: number;
};

export type GetProjectsFilter = ProjectSearchFilter & ProjectsPagination;

export type CreateProjectRequest = {
  title: string;
  description: string;
  status: ProjectStatus;
  roles?: CreateProjectRoleInput[];
};

export type UpdateProjectRequest = {
  title: string;
  description: string;
  status: ProjectStatus;
};

export type CreateProjectRoleRequest = {
  projectId: string;
  title: string;
  description?: string;
  status: RoleStatus;
};

export type UpdateProjectRoleRequest = {
  title: string;
  description?: string;
  status: RoleStatus;
};
