import { Link } from '@tanstack/react-router';
import { ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { CompletionCard } from '../features/profile/components/CompletionCard';
import { ProfileEmptyState } from '../features/profile/components/ProfileEmptyState';
import { ProfileSection } from '../features/profile/components/ProfileSection';
import type { CompletionItem, LinkKind } from '../features/profile/types';

function getLinkIcon(kind: LinkKind) {
  if (kind === 'portfolio') return <Globe size={14} aria-hidden="true" />;
  return <ExternalLink size={14} aria-hidden="true" />;
}

const COMPLETION_ITEMS: CompletionItem[] = [
  { label: 'Nome', done: false },
  { label: 'Bio', done: false },
  { label: 'Cidade', done: false },
  { label: 'Skills', done: false },
  { label: 'Links', done: false },
];

const SKILL_SUGGESTIONS = [
  'Front-end',
  'Back-end',
  'Design',
  'Pesquisa',
  'Escrita',
  'Produto',
  'Facilitação',
  'Dados',
];

const LINK_SUGGESTIONS: { kind: LinkKind; label: string }[] = [
  { kind: 'github', label: 'GitHub' },
  { kind: 'linkedin', label: 'LinkedIn' },
  { kind: 'portfolio', label: 'Portfólio' },
  { kind: 'dribbble', label: 'Dribbble' },
  { kind: 'behance', label: 'Behance' },
];

export function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden paper-tex">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">perfil</div>
            <span className="h-px w-8 bg-line-2" />
            <span className="serif italic text-[14px] text-mute">
              visível pra outras pessoas construindo na Juntaê
            </span>
          </div>

          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 lg:col-span-9">
              <div className="flex items-center gap-5">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-ink-2 text-[26px] font-bold text-cream display">
                  ?
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                    Seu nome
                  </h1>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 pl-[92px] text-[14px] text-ink-2">
                <span className="mono">seu@email.com</span>
                <span className="text-mute">·</span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--color-mute)' }}
                  />
                  conta criada
                </span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 lg:text-right">
              <p className="serif italic max-w-[28ch] text-[17px] leading-[1.5] text-ink-2 lg:ml-auto">
                Seu jeito de aparecer pra quem quer construir{' '}
                <span className="text-accent">junto</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            {/* Left — sections */}
            <div className="col-span-12 lg:col-span-8">
              <ProfileSection eyebrow="01 · sobre" title="Bio" divider={false}>
                <ProfileEmptyState cta="adicionar bio">
                  Conte em poucas linhas como você gosta de contribuir num projeto — o que você topa
                  fazer, o ritmo que combina com você, o tipo de coisa que te anima.
                  <br />É o que outras pessoas vão ler primeiro.
                </ProfileEmptyState>
              </ProfileSection>

              <ProfileSection eyebrow="02 · onde" title="Cidade">
                <ProfileEmptyState cta="adicionar cidade">
                  De onde você está construindo? Algumas pessoas gostam de encontrar gente da mesma
                  cidade pra projetos presenciais — outras fazem tudo remoto. Você decide.
                </ProfileEmptyState>
              </ProfileSection>

              <ProfileSection eyebrow="03 · como contribuo" title="Skills">
                <ProfileEmptyState cta="adicionar skills">
                  Liste o que você topa fazer num time — design, código, escrita, produto,
                  organização, o que for.{' '}
                  <span className="not-italic font-medium text-ink">
                    Skills ajudam outras pessoas a te chamar pro projeto certo.
                  </span>
                </ProfileEmptyState>
                <div className="mt-5">
                  <div className="mono mb-2.5 text-[12px] uppercase tracking-[.18em] text-mute">
                    sugestões pra começar
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-transparent px-3.5 text-[13px] text-mute ring-1 ring-dashed ring-line-2 transition hover:text-ink hover:ring-ink"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </ProfileSection>

              <ProfileSection eyebrow="04 · onde te encontrar" title="Links">
                <ProfileEmptyState cta="adicionar links">
                  Adicione links para que outras pessoas conheçam melhor seu trabalho.
                </ProfileEmptyState>
                <div className="mt-5">
                  <div className="mono mb-2.5 text-[12px] uppercase tracking-[.18em] text-mute">
                    o que dá pra adicionar
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LINK_SUGGESTIONS.map((o) => (
                      <button
                        key={o.kind}
                        type="button"
                        className="inline-flex h-8 items-center gap-2 rounded-full bg-transparent px-3.5 text-[13px] text-mute ring-1 ring-dashed ring-line-2 transition hover:text-ink hover:ring-ink"
                      >
                        {getLinkIcon(o.kind)}
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </ProfileSection>

              <ProfileSection eyebrow="05 · projetos no Juntaê" title="Construções">
                <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-6 md:p-7">
                  <div className="display text-[20px] font-semibold leading-tight text-ink">
                    Você ainda não participou de nenhum projeto.
                  </div>
                  <p className="serif italic mt-3 max-w-[52ch] text-[16px] leading-[1.55] text-ink-2">
                    Entre em um projeto ou crie o seu para começar a construir com outras pessoas.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-cream transition-colors hover:bg-black"
                    >
                      Explorar projetos
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <Link
                      to="/projects/new"
                      className="inline-flex items-center rounded-full px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2"
                    >
                      Criar projeto
                    </Link>
                  </div>
                </div>
              </ProfileSection>
            </div>

            {/* Right rail */}
            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <CompletionCard items={COMPLETION_ITEMS} />

                <div className="mt-5 rounded-[20px] bg-cream p-5 ring-1 ring-line">
                  <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">conta</div>
                  <ul className="mt-3 divide-y divide-line text-[14px]">
                    {(['Email e senha', 'Notificações', 'Sair da Juntaê'] as const).map(
                      (item, i) => (
                        <li
                          key={item}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <button
                            type="button"
                            className={[
                              'inline-flex w-full items-center justify-between gap-2',
                              i === 2 ? 'text-accent' : 'text-ink-2',
                            ].join(' ')}
                          >
                            {item}
                            <span className={i === 2 ? 'text-accent' : 'text-mute'}>
                              <ArrowRight size={14} aria-hidden="true" />
                            </span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
