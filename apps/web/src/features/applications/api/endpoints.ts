import { http } from '../../../shared/api/http';
import type {
  ApplicationDetailResponse,
  ApplicationResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  UpdateApplicationStatusRequest,
} from './types';

export function getMyApplications(): Promise<ApplicationResponse[]> {
  return http.get<ApplicationResponse[]>('/applications');
}

export function getApplicationById(id: string): Promise<ApplicationResponse> {
  return http.get<ApplicationResponse>(`/applications/${id}`);
}

export function applyToRole(data: CreateApplicationRequest): Promise<ApplicationResponse> {
  const { projectRoleId, ...rest } = data;
  return http.post<ApplicationResponse>('/applications', {
    ...rest,
    project_role_id: projectRoleId,
  });
}

export function updateApplication(
  id: string,
  data: UpdateApplicationRequest
): Promise<ApplicationResponse> {
  return http.put<ApplicationResponse>(`/applications/${id}`, data);
}

export function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusRequest
): Promise<ApplicationResponse> {
  return http.patch<ApplicationResponse>(`/applications/${id}/status`, data);
}

export function getProjectApplications(projectId: string): Promise<ApplicationDetailResponse[]> {
  return http.get<ApplicationDetailResponse[]>(`/projects/${projectId}/applications`);
}

export function deleteApplication(id: string): Promise<void> {
  return http.del<void>(`/applications/${id}`);
}
