import { http, TOKEN_KEY } from '../../../shared/api/http';
import { mapUser, type UserApiResponse } from '../../users/api/mappers';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';
import type { UserResponse } from '../../users/api/types';

type AuthApiResponse = {
  token: string;
  user: UserApiResponse;
};

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const raw = await http.post<AuthApiResponse>('/auth/login', data);
  localStorage.setItem(TOKEN_KEY, raw.token);
  return { token: raw.token, user: mapUser(raw.user) };
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const { skillIds, ...rest } = data;
  const raw = await http.post<UserApiResponse>('/auth/register', {
    ...rest,
    ...(skillIds !== undefined && { skill_ids: skillIds }),
  });
  return mapUser(raw);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
