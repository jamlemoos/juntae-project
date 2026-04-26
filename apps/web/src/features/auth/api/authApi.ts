// TODO: implement when backend exposes auth endpoints.
// The backend currently has no /api/auth/* routes.

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
