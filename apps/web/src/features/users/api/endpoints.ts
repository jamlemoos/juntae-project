import { http } from '../../../shared/api/http';
import type { PublicUserResponse } from '../../../shared/api/types';
import type { UserResponse } from './types';

export function getMe(): Promise<UserResponse> {
  return http.get<UserResponse>('/users/me');
}

export function getUserById(id: string): Promise<PublicUserResponse> {
  return http.get<PublicUserResponse>(`/users/${id}`);
}
