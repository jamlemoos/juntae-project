export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}
