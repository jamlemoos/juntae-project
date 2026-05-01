import { http } from '../../../shared/api/http';
import type {
  CreateProjectRequest,
  GetProjectsFilter,
  ProjectDetail,
  ProjectListItem,
  ProjectResponse,
  ProjectRole,
  UpdateProjectRequest,
} from './types';

export function getProjects(filter?: GetProjectsFilter): Promise<ProjectListItem[]> {
  if (filter) {
    const params = new URLSearchParams({ status: filter.status, city: filter.city });
    return http.get<ProjectListItem[]>(`/projects?${params}`);
  }
  return http.get<ProjectListItem[]>('/projects');
}

export function getProjectById(id: string): Promise<ProjectResponse> {
  return http.get<ProjectResponse>(`/projects/${id}`);
}

export function getProjectDetails(id: string): Promise<ProjectDetail> {
  return http.get<ProjectDetail>(`/projects/${id}/details`);
}

export function createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
  return http.post<ProjectResponse>('/projects', data);
}

export function updateProject(id: string, data: UpdateProjectRequest): Promise<ProjectResponse> {
  return http.put<ProjectResponse>(`/projects/${id}`, data);
}

export function getProjectRoles(projectId: string): Promise<ProjectRole[]> {
  return http.get<ProjectRole[]>(`/projects/${projectId}/roles`);
}
