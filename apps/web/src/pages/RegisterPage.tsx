import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { assessPasswordStrength } from '../features/auth/utils/passwordStrength';
import { PasswordStrengthBar } from '../features/auth/components/PasswordStrengthBar';
import { AuthField } from '../components/auth/AuthField';
import { ArrowRight } from 'lucide-react';
import { Header } from '../layouts/Header';
import { Button } from '../shared/ui/Button';
import {
  validateName,
  validateEmail,
  validateRegisterPassword as validatePassword,
  validateConfirmPassword,
  validateCity,
} from '../features/auth/utils/authValidation';
import { register } from '../features/auth/api/endpoints';
import { ApiError } from '../shared/api/http';
import { CityAutocomplete } from '../shared/ui/CityAutocomplete';

const BENEFITS = [
  { key: 'de graça', value: 'pra sempre, pra quem constrói.' },
  { key: 'só o essencial', value: 'nome, email, cidade, senha. pronto.' },
  { key: 'seu ritmo', value: 'comece quando quiser, pause quando precisar.' },
];

export function RegisterPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [registrationSucceeded, setRegistrationSucceeded] = useState(false);

  const form = useForm({
    defaultValues: { name: '', email: '', city: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      if (!termsAccepted) return;
      setServerError(null);
      try {
        await register({
          name: value.name,
          email: value.email,
          city: value.city,
          password: value.password,
        });
        setRegistrationSucceeded(true);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 409) {
            setServerError('Já existe uma conta com esse e-mail.');
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
      <Header variant="register" />

      <section className="relative flex-1 overflow-hidden paper-tex">
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 items-start gap-8 px-6 py-20">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-4 text-[11.5px] font-medium uppercase tracking-[.18em] text-mute">
              entra junto
            </div>
            <h1 className="display max-w-[15ch] text-[52px] font-bold leading-[1.0] text-ink md:text-[68px] lg:text-[78px]">
              Você não tá entrando num{' '}
              <span className="serif italic font-medium text-secondary">site,</span> tá entrando
              numa <span className="text-primary">comunidade.</span>
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
            {registrationSucceeded ? (
              <div className="lift relative rounded-[28px] bg-cream-2 p-7 ring-1 ring-line md:p-8">
                <div className="flex flex-col items-center gap-5 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-[20px] font-bold text-primary ring-1 ring-primary/20">
                    ✓
                  </div>
                  <div>
                    <div className="display text-[22px] font-bold text-ink">Conta criada!</div>
                    <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">
                      Agora é só entrar pra começar a construir.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Fazer login <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary ring-1 ring-primary/20"
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
                      onBlur: ({ value }) => validateName(value),
                      onSubmit: ({ value }) => validateName(value),
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
                        hint="usamos pra te avisar quando alguém topar seu projeto."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0] as string | undefined}
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="city"
                    validators={{
                      onBlur: ({ value }) => validateCity(value),
                      onSubmit: ({ value }) => validateCity(value),
                    }}
                  >
                    {(field) => (
                      <CityAutocomplete
                        label="sua cidade"
                        placeholder="Ex: Natal, São Paulo…"
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
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
                    {(field) => {
                      const pw = field.state.value;
                      const passwordStrength = assessPasswordStrength(pw);
                      const rightLabel =
                        passwordStrength.level === 'empty'
                          ? '8+ caracteres'
                          : passwordStrength.label;
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
                          <PasswordStrengthBar score={passwordStrength.score} />
                        </div>
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onBlur: ({ value, fieldApi }) =>
                        validateConfirmPassword(value, fieldApi.form.getFieldValue('password')),
                      onSubmit: ({ value, fieldApi }) =>
                        validateConfirmPassword(value, fieldApi.form.getFieldValue('password')),
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
                    className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer rounded accent-primary"
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
                  <p role="alert" className="mb-4 text-center text-[13px] text-error">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={form.state.isSubmitting || !termsAccepted}
                  className="w-full rounded-full"
                >
                  {form.state.isSubmitting ? 'Criando conta…' : 'Criar conta'}
                  {!form.state.isSubmitting && <ArrowRight size={14} aria-hidden="true" />}
                </Button>

                <p className="mt-5 text-center text-[13.5px] text-ink-2">
                  já está dentro?{' '}
                  <Link to="/login" className="ulink font-medium text-ink">
                    entrar
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
