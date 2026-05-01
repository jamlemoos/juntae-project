import { http } from '../../../shared/api/http';
import {
  mapProjectDetail,
  mapProjectListItem,
  mapProjectResponse,
  mapProjectRole,
  type ProjectDetailApiResponse,
  type ProjectListItemApiResponse,
  type ProjectResponseApi,
  type ProjectRoleApiResponse,
} from './mappers';
import type {
  CreateProjectRequest,
  GetProjectsFilter,
  ProjectDetail,
  ProjectListItem,
  ProjectResponse,
  ProjectRole,
  UpdateProjectRequest,
} from './types';

export async function getProjects(filter?: GetProjectsFilter): Promise<ProjectListItem[]> {
  const path = filter
    ? `/projects?${new URLSearchParams({ status: filter.status, city: filter.city })}`
    : '/projects';
  const raw = await http.get<ProjectListItemApiResponse[]>(path);
  return raw.map(mapProjectListItem);
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  const raw = await http.get<ProjectResponseApi>(`/projects/${id}`);
  return mapProjectResponse(raw);
}

export async function getProjectDetails(id: string): Promise<ProjectDetail> {
  const raw = await http.get<ProjectDetailApiResponse>(`/projects/${id}/details`);
  return mapProjectDetail(raw);
}

export async function createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
  const raw = await http.post<ProjectResponseApi>('/projects', data);
  return mapProjectResponse(raw);
}

export async function updateProject(
  id: string,
  data: UpdateProjectRequest
): Promise<ProjectResponse> {
  const raw = await http.put<ProjectResponseApi>(`/projects/${id}`, data);
  return mapProjectResponse(raw);
}

export async function getProjectRoles(projectId: string): Promise<ProjectRole[]> {
  const raw = await http.get<ProjectRoleApiResponse[]>(`/projects/${projectId}/roles`);
  return raw.map(mapProjectRole);
}
