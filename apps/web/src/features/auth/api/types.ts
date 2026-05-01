import type { UserResponse } from '../../users/api/types';

export type LoginRequest = {
  email: string;
  password: string;
};

// city is required by the backend (validate:"required,min=2").
// skillIds maps to backend field skill_ids ([]uuid.UUID).
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
