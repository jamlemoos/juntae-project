// TODO: implement when backend exposes auth endpoints.

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
