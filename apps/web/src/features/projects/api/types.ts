import type { PublicUserResponse } from '../../../shared/api/types';

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type RoleStatus = 'OPEN' | 'CLOSED';

// Inline role input used only inside CreateProjectRequest.
export type CreateProjectRoleInput = {
  title: string;
  description?: string;
  status: RoleStatus;
};

// Flat response from POST /projects, GET /projects/:id, PUT /projects/:id.
export type ProjectResponse = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

// Full role shape returned by all ProjectRoleResponse endpoints.
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

// List shape returned by GET /projects.
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

// Detail shape returned by GET /projects/:id/details.
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

type ProjectSearchFilter =
  | { status?: never; city?: never }
  | { status: ProjectStatus; city: string };

export type ProjectsPagination = {
  page?: number;
  limit?: number;
};

export type GetProjectsFilter = ProjectSearchFilter & ProjectsPagination;

// status is required by the backend (validate:"required,oneof=OPEN IN_PROGRESS CLOSED").
// roles is optional; each role's status must be OPEN or CLOSED.
export type CreateProjectRequest = {
  title: string;
  description: string;
  status: ProjectStatus;
  roles?: CreateProjectRoleInput[];
};

// All fields are required by the backend (each has validate:"required").
export type UpdateProjectRequest = {
  title: string;
  description: string;
  status: ProjectStatus;
};
