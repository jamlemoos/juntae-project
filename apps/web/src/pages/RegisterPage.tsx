import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { AuthField } from '../components/auth/AuthField';
import { ArrowIcon } from '../components/ui/ArrowIcon';
import { Header } from '../layouts/Header';

const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');
const emailSchema = z.string().min(1, 'E-mail obrigatório').email('E-mail inválido');
const passwordSchema = z.string().min(8, 'Senha deve ter pelo menos 8 caracteres');

type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

type PasswordStrength = {
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

const MIN_PASSWORD_LENGTH = 8;

function assessPasswordStrength(password: string): PasswordStrength {
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

const BENEFITS = [
  { key: 'de graça', value: 'pra sempre, pra quem constrói.' },
  { key: 'só o essencial', value: 'nome, email, senha. nada de questionário.' },
  { key: 'seu ritmo', value: 'comece quando quiser, pause quando precisar.' },
];

export function RegisterPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async () => {
      if (!termsAccepted) return;
      setServerError(null);
      // TODO: call auth API — on failure: setServerError('Não foi possível criar sua conta.')
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header variant="register" />

      <section className="relative flex-1 overflow-hidden paper-tex">
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 items-start gap-8 px-6 py-20">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-4 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
              entra junto
            </div>
            <h1 className="display max-w-[15ch] text-[52px] font-bold leading-[1.0] text-ink md:text-[68px] lg:text-[78px]">
              Você não tá entrando num{' '}
              <span className="serif italic font-medium text-accent">site,</span> tá entrando numa{' '}
              <span className="text-accent">comunidade.</span>
            </h1>
            <p className="mt-7 max-w-md text-[16.5px] leading-[1.6] text-ink-2">
              Cria sua conta em um minuto. Depois você decide se quer começar um projeto ou entrar
              num que já está acontecendo. Sem pressão.
            </p>
            <ul className="mt-10 max-w-md space-y-4 text-[14.5px] text-ink-2">
              {BENEFITS.map(({ key, value }) => (
                <li key={key} className="flex items-baseline gap-4">
                  <span className="display min-w-[110px] text-[15px] font-semibold text-ink">
                    {key}
                  </span>
                  <span className="flex-1 border-b hairline pb-2">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="lift relative rounded-[28px] bg-cream-2 p-7 ring-1 ring-line md:p-8"
              noValidate
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-cream"
                  >
                    V
                  </span>
                  <div>
                    <div className="text-[13px] font-medium text-ink">Bem, vamos lá.</div>
                    <div className="text-[11.5px] text-mute">leva um minuto</div>
                  </div>
                </div>
                <span className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
                  criar conta
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <form.Field
                  name="name"
                  validators={{
                    onBlur: ({ value }) => {
                      const r = nameSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <AuthField
                      label="como te chamam"
                      type="text"
                      autoComplete="given-name"
                      placeholder="seu primeiro nome basta"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] as string | undefined}
                    />
                  )}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) => {
                      const r = emailSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <AuthField
                      label="seu email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      hint="usamos pra te avisar quando alguém topar seu projeto."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] as string | undefined}
                    />
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onBlur: ({ value }) => {
                      const r = passwordSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const pw = field.state.value;
                    const passwordStrength = assessPasswordStrength(pw);
                    const rightLabel =
                      passwordStrength.level === 'empty' ? '8+ caracteres' : passwordStrength.label;
                    return (
                      <div>
                        <AuthField
                          label="escolha uma senha"
                          type="password"
                          autoComplete="new-password"
                          placeholder="•••••••••"
                          value={pw}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={field.state.meta.errors[0] as string | undefined}
                          rightLabel={rightLabel}
                        />
                        <div className="mt-2 flex gap-1.5" aria-hidden="true">
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={`h-[3px] flex-1 rounded-full transition-colors ${i < passwordStrength.score ? 'bg-accent' : 'bg-line'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="confirmPassword"
                  validators={{
                    onBlur: ({ value, fieldApi }) => {
                      if (!value) return 'Confirme sua senha';
                      const password = fieldApi.form.getFieldValue('password');
                      if (value !== password) return 'As senhas não coincidem';
                    },
                  }}
                >
                  {(field) => (
                    <AuthField
                      label="confirma a senha"
                      type="password"
                      autoComplete="new-password"
                      placeholder="•••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] as string | undefined}
                    />
                  )}
                </form.Field>
              </div>

              <div className="dotted my-7 text-line-2" aria-hidden="true" />

              <label className="mb-5 flex cursor-pointer items-start gap-3 text-[12.5px] leading-snug text-ink-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer rounded accent-ink"
                />
                <span>
                  topo os{' '}
                  <button type="button" className="ulink font-medium text-ink">
                    termos
                  </button>{' '}
                  e a{' '}
                  <button type="button" className="ulink font-medium text-ink">
                    forma de cuidar dos meus dados
                  </button>
                  . nada de spam.
                </span>
              </label>

              {serverError && (
                <p role="alert" className="mb-4 text-center text-[13px] text-accent">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={form.state.isSubmitting || !termsAccepted}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:brightness-105 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {form.state.isSubmitting ? 'Criando conta…' : 'Criar conta'}
                {!form.state.isSubmitting && <ArrowIcon />}
              </button>

              <p className="mt-5 text-center text-[13.5px] text-ink-2">
                já está dentro?{' '}
                <Link to="/login" className="ulink font-medium text-ink">
                  entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
