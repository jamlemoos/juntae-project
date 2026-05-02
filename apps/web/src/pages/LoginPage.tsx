import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { AuthField } from '../components/auth/AuthField';
import { ArrowRight } from 'lucide-react';
import { Header } from '../layouts/Header';
import {
  validateEmail,
  validateLoginPassword as validatePassword,
} from '../features/auth/utils/authValidation';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ApiError } from '../shared/api/http';

export function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await login(value.email, value.password);
        void navigate({ to: '/projects' });
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setServerError('E-mail ou senha incorretos.');
          } else if (err.status === 0) {
            setServerError('Sem conexão. Verifique sua internet.');
          } else {
            setServerError('Algo deu errado. Tente novamente.');
          }
        } else {
          setServerError('Algo deu errado. Tente novamente.');
        }
      }
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header variant="login" />

      <section className="relative flex-1 overflow-hidden paper-tex">
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 items-center gap-8 px-6 py-20">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="display max-w-[14ch] text-[56px] font-bold leading-[1.0] text-ink md:text-[72px] lg:text-[80px]">
              De volta pra <span className="serif italic font-medium text-accent">construir</span>.
            </h1>
            <p className="mt-7 max-w-md text-[16.5px] leading-[1.6] text-ink-2">
              Continua de onde parou: seu time, suas conversas e os projetos que você está
              acompanhando ficam aqui.
            </p>
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
                    <div className="text-[13px] font-medium text-ink">Voltar pra Juntaê</div>
                    <div className="text-[11.5px] text-mute">é rapidinho</div>
                  </div>
                </div>
                <span className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
                  entrar
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <form.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) => validateEmail(value),
                    onSubmit: ({ value }) => validateEmail(value),
                  }}
                >
                  {(field) => (
                    <AuthField
                      label="seu email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
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
                    onBlur: ({ value }) => validatePassword(value),
                    onSubmit: ({ value }) => validatePassword(value),
                  }}
                >
                  {(field) => (
                    <AuthField
                      label="senha"
                      type="password"
                      autoComplete="current-password"
                      placeholder="•••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] as string | undefined}
                    />
                  )}
                </form.Field>

                <div className="flex justify-end pt-1">
                  <span className="text-[13px] text-mute">esqueci a senha</span>
                </div>
              </div>

              <div className="dotted my-7 text-line-2" aria-hidden="true" />

              {serverError && (
                <p role="alert" className="mb-4 text-center text-[13px] text-accent">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={form.state.isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-cream transition-colors hover:bg-black disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                {form.state.isSubmitting ? 'Entrando…' : 'Entrar'}
                {!form.state.isSubmitting && <ArrowRight size={14} aria-hidden="true" />}
              </button>

              <p className="mt-5 text-center text-[13.5px] text-ink-2">
                primeira vez?{' '}
                <Link to="/register" className="ulink font-medium text-ink">
                  criar conta
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
