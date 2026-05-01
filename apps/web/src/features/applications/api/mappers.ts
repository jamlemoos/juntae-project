import { mapPublicUser, type PublicUserApiResponse } from '../../../shared/api/mappers';
import type { ApplicationDetailResponse, ApplicationResponse, ApplicationStatus } from './types';

type ApplicationApiResponse = {
  id: string;
  message: string;
  status: ApplicationStatus;
  user_id: string;
  project_role_id: string;
  created_at: string;
  updated_at: string;
};

type ApplicationDetailApiResponse = {
  id: string;
  message: string;
  status: ApplicationStatus;
  user: PublicUserApiResponse;
  project_role_id: string;
  role_title: string;
  created_at: string;
  updated_at: string;
};

export function mapApplication(raw: ApplicationApiResponse): ApplicationResponse {
  return {
    id: raw.id,
    message: raw.message,
    status: raw.status,
    userId: raw.user_id,
    projectRoleId: raw.project_role_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapApplicationDetail(raw: ApplicationDetailApiResponse): ApplicationDetailResponse {
  return {
    id: raw.id,
    message: raw.message,
    status: raw.status,
    user: mapPublicUser(raw.user),
    projectRoleId: raw.project_role_id,
    roleTitle: raw.role_title,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export type { ApplicationApiResponse, ApplicationDetailApiResponse };
