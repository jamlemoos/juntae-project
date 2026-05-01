// Auth API integration for existing endpoints:
// POST /api/auth/login
// POST /api/auth/register

export type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
