import { http } from '../../../shared/api/http';
import {
  mapApplication,
  mapApplicationDetail,
  type ApplicationApiResponse,
  type ApplicationDetailApiResponse,
} from './mappers';
import type {
  ApplicationDetailResponse,
  ApplicationResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  UpdateApplicationStatusRequest,
} from './types';

export async function getMyApplications(): Promise<ApplicationResponse[]> {
  const raw = await http.get<ApplicationApiResponse[]>('/applications');
  return raw.map(mapApplication);
}

export async function getApplicationById(id: string): Promise<ApplicationResponse> {
  const raw = await http.get<ApplicationApiResponse>(`/applications/${id}`);
  return mapApplication(raw);
}

export async function applyToRole(data: CreateApplicationRequest): Promise<ApplicationResponse> {
  const { projectRoleId, ...rest } = data;
  const raw = await http.post<ApplicationApiResponse>('/applications', {
    ...rest,
    project_role_id: projectRoleId,
  });
  return mapApplication(raw);
}

export async function updateApplication(
  id: string,
  data: UpdateApplicationRequest
): Promise<ApplicationResponse> {
  const raw = await http.put<ApplicationApiResponse>(`/applications/${id}`, data);
  return mapApplication(raw);
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusRequest
): Promise<ApplicationResponse> {
  const raw = await http.patch<ApplicationApiResponse>(`/applications/${id}/status`, data);
  return mapApplication(raw);
}

export async function getProjectApplications(
  projectId: string
): Promise<ApplicationDetailResponse[]> {
  const raw = await http.get<ApplicationDetailApiResponse[]>(`/projects/${projectId}/applications`);
  return raw.map(mapApplicationDetail);
}

export async function deleteApplication(id: string): Promise<void> {
  return http.del<void>(`/applications/${id}`);
}
