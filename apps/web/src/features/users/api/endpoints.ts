import { http } from '../../../shared/api/http';
import { mapPublicUser, type PublicUserApiResponse } from '../../../shared/api/mappers';
import { mapUser, type UserApiResponse } from './mappers';
import type { PublicUserResponse } from '../../../shared/api/types';
import type { UpdateUserRequest, UserResponse } from './types';

export async function getMe(): Promise<UserResponse> {
  const raw = await http.get<UserApiResponse>('/users/me');
  return mapUser(raw);
}

export async function getUserById(id: string): Promise<PublicUserResponse> {
  const raw = await http.get<PublicUserApiResponse>(`/users/${id}`);
  return mapPublicUser(raw);
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
  const { skillIds, ...rest } = data;
  const raw = await http.put<UserApiResponse>(`/users/${id}`, {
    ...rest,
    skill_ids: skillIds ?? [],
  });
  return mapUser(raw);
}
