export type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  score: 0 | 1 | 2 | 3;
  label: string;
  feedback: string;
  checks: {
    hasMinimumLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
};

export const MIN_PASSWORD_LENGTH = 8;

export function assessPasswordStrength(password: string): PasswordStrength {
  const checks = {
    hasMinimumLength: password.length >= MIN_PASSWORD_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  if (password.length === 0) {
    return {
      level: 'empty',
      score: 0,
      label: 'vazia',
      feedback: `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      checks,
    };
  }

  if (!checks.hasMinimumLength) {
    return {
      level: 'weak',
      score: 1,
      label: 'fraca',
      feedback: `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      checks,
    };
  }

  const complexityScore = [checks.hasUppercase, checks.hasNumber, checks.hasSymbol].filter(
    Boolean
  ).length;

  if (complexityScore >= 2) {
    return {
      level: 'strong',
      score: 3,
      label: 'forte',
      feedback: 'Boa senha.',
      checks,
    };
  }

  if (complexityScore === 1) {
    return {
      level: 'medium',
      score: 2,
      label: 'média',
      feedback: 'Boa base. Adicione mais variedade para fortalecer.',
      checks,
    };
  }

  return {
    level: 'weak',
    score: 1,
    label: 'fraca',
    feedback: 'Adicione letras maiúsculas, números ou símbolos.',
    checks,
  };
}
