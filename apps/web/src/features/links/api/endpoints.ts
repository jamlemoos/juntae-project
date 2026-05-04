import { http } from '../../../shared/api/http';
import { mapUserLink, type UserLinkApiResponse } from './mappers';
import type { CreateLinkRequest, UpdateLinkRequest, UserLink } from './types';

export async function getMyLinks(): Promise<UserLink[]> {
  const raw = await http.get<UserLinkApiResponse[]>('/users/me/links');
  return raw.map(mapUserLink);
}

export async function createLink(data: CreateLinkRequest): Promise<UserLink> {
  const raw = await http.post<UserLinkApiResponse>('/users/me/links', {
    kind: data.kind,
    label: data.label ?? '',
    url: data.url,
  });
  return mapUserLink(raw);
}

export async function updateLink(id: string, data: UpdateLinkRequest): Promise<UserLink> {
  const raw = await http.put<UserLinkApiResponse>(`/users/me/links/${id}`, {
    kind: data.kind,
    label: data.label ?? '',
    url: data.url,
  });
  return mapUserLink(raw);
}

export async function deleteLink(id: string): Promise<void> {
  return http.del<void>(`/users/me/links/${id}`);
}
