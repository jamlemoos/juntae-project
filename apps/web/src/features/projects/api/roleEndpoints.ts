import { http } from '../../../shared/api/http';
import { mapProjectRole, type ProjectRoleApiResponse } from './mappers';
import type { CreateProjectRoleRequest, ProjectRole, UpdateProjectRoleRequest } from './types';

export async function createProjectRole(data: CreateProjectRoleRequest): Promise<ProjectRole> {
  const raw = await http.post<ProjectRoleApiResponse>('/project-roles', {
    title: data.title,
    description: data.description ?? '',
    status: data.status,
    project_id: data.projectId,
  });
  return mapProjectRole(raw);
}

export async function updateProjectRole(
  id: string,
  data: UpdateProjectRoleRequest
): Promise<ProjectRole> {
  const raw = await http.put<ProjectRoleApiResponse>(`/project-roles/${id}`, {
    title: data.title,
    description: data.description ?? '',
    status: data.status,
  });
  return mapProjectRole(raw);
}

export async function deleteProjectRole(id: string): Promise<void> {
  return http.del<void>(`/project-roles/${id}`);
}
