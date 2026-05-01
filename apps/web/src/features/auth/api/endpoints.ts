import { http, TOKEN_KEY } from '../../../shared/api/http';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';
import type { UserResponse } from '../../users/api/types';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await http.post<AuthResponse>('/auth/login', data);
  localStorage.setItem(TOKEN_KEY, response.token);
  return response;
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const { skillIds, ...rest } = data;
  return http.post<UserResponse>('/auth/register', {
    ...rest,
    ...(skillIds !== undefined && { skill_ids: skillIds }),
  });
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
