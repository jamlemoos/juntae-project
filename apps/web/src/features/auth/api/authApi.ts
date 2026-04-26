import { apiFetch } from '../../../shared/api/http';

export type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function login(input: LoginInput) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
