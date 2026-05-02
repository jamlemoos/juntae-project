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
  let path = '/projects';
  if (filter) {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.city) params.set('city', filter.city);
    if (filter.page != null) params.set('page', String(filter.page));
    if (filter.limit != null) params.set('limit', String(filter.limit));
    const qs = params.toString();
    if (qs) path = `/projects?${qs}`;
  }
  const raw = await http.get<ProjectListItemApiResponse[]>(path);
  return raw.map(mapProjectListItem);
}

export async function getMyProjects(): Promise<ProjectListItem[]> {
  const raw = await http.get<ProjectListItemApiResponse[]>('/projects/me');
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
