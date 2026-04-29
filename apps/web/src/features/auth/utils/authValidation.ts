import { z } from 'zod';

const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');
const emailSchema = z.string().min(1, 'E-mail obrigatório').email('E-mail inválido');
const loginPasswordSchema = z.string().min(1, 'Senha obrigatória');
const registerPasswordSchema = z.string().min(8, 'Senha deve ter pelo menos 8 caracteres');

export function validateName(value: string) {
  const r = nameSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

export function validateEmail(value: string) {
  const r = emailSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

/** Login: required only. */
export function validateLoginPassword(value: string) {
  const r = loginPasswordSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

/** Register: minimum 8 characters. */
export function validateRegisterPassword(value: string) {
  const r = registerPasswordSchema.safeParse(value);
  return r.success ? undefined : r.error.issues[0]?.message;
}

export function validateConfirmPassword(value: string, password: string) {
  if (!value) return 'Confirme sua senha';
  if (value !== password) return 'As senhas não coincidem';
}
