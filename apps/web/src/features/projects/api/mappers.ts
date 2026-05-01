import { mapPublicUser, type PublicUserApiResponse } from '../../../shared/api/mappers';
import type {
  ProjectDetail,
  ProjectListItem,
  ProjectResponse,
  ProjectRole,
  ProjectStatus,
  RoleStatus,
} from './types';

type ProjectResponseApi = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  creator_id: string;
  created_at: string;
  updated_at: string;
};

type ProjectRoleApiResponse = {
  id: string;
  title: string;
  description: string;
  status: RoleStatus;
  project_id: string;
  applications_count: number;
  has_applied: boolean;
  created_at: string;
  updated_at: string;
};

type ProjectListItemApiResponse = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  creator: PublicUserApiResponse;
  open_roles_count: number;
  total_roles_count: number;
  has_applied: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
};

type ProjectDetailApiResponse = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  is_owner: boolean;
  creator: PublicUserApiResponse;
  roles: ProjectRoleApiResponse[];
  created_at: string;
  updated_at: string;
};

export function mapProjectResponse(raw: ProjectResponseApi): ProjectResponse {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    creatorId: raw.creator_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapProjectRole(raw: ProjectRoleApiResponse): ProjectRole {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    projectId: raw.project_id,
    applicationsCount: raw.applications_count,
    hasApplied: raw.has_applied,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapProjectListItem(raw: ProjectListItemApiResponse): ProjectListItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    creator: mapPublicUser(raw.creator),
    openRolesCount: raw.open_roles_count,
    totalRolesCount: raw.total_roles_count,
    hasApplied: raw.has_applied,
    isOwner: raw.is_owner,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapProjectDetail(raw: ProjectDetailApiResponse): ProjectDetail {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    isOwner: raw.is_owner,
    creator: mapPublicUser(raw.creator),
    roles: raw.roles.map(mapProjectRole),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export type {
  ProjectResponseApi,
  ProjectRoleApiResponse,
  ProjectListItemApiResponse,
  ProjectDetailApiResponse,
};
