import type { UserResponse } from '../../users/api/types';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  city: string;
  bio?: string;
  skillIds?: string[];
};

// login returns { token, user }. register returns UserResponse directly (HTTP 201).
export type AuthResponse = {
  token: string;
  user: UserResponse;
};
