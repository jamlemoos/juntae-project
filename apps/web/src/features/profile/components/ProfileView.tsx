import { ProfileSection } from './ProfileSection';
import { ProfileEmptyState } from './ProfileEmptyState';
import { ProfileLinksManager } from './ProfileLinksManager';
import { ProfileProjectsSection } from './ProfileProjectsSection';
import { getAvailabilityLabel } from '../utils/profileDisplay';
import type { UserResponse } from '../../users/api/types';
import type { UserProfileResponse } from '../../users/api/profileEndpoints';

interface ProfileViewProps {
  user: UserResponse | null;
  profile: UserProfileResponse | undefined;
  onStartEdit: () => void;
}

export function ProfileView({ user, profile, onStartEdit }: ProfileViewProps) {
  const availabilityLabel = getAvailabilityLabel(profile?.availability);

  return (
    <>
      <ProfileSection eyebrow="00 · título" title="Headline" divider={false}>
        {profile?.headline ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[16px] leading-[1.65] text-ink-2">{profile.headline}</p>
            <span className="inline-flex h-6 items-center rounded-full bg-cream-2 px-2.5 text-[11px] font-medium uppercase tracking-[.16em] text-mute ring-1 ring-line">
              {availabilityLabel}
            </span>
          </div>
        ) : (
          <ProfileEmptyState cta="adicionar headline" onCta={onStartEdit}>
            Uma linha sobre o que você faz — "Designer de produto" ou "Estudante de Engenharia de
            Software". Ajuda outros a te entender rápido.
          </ProfileEmptyState>
        )}
      </ProfileSection>

      <ProfileSection eyebrow="01 · sobre" title="Bio" divider={false}>
        {user?.bio ? (
          <p className="text-[16px] leading-[1.65] text-ink-2">{user.bio}</p>
        ) : (
          <ProfileEmptyState cta="adicionar bio" onCta={onStartEdit}>
            Conte em poucas linhas como você gosta de contribuir num projeto — o que você topa
            fazer, o ritmo que combina com você, o tipo de coisa que te anima.
            <br />É o que outras pessoas vão ler primeiro.
          </ProfileEmptyState>
        )}
      </ProfileSection>

      <ProfileSection eyebrow="02 · onde" title="Cidade">
        {user?.city ? (
          <p className="text-[16px] text-ink-2">{user.city}</p>
        ) : (
          <ProfileEmptyState cta="adicionar cidade" onCta={onStartEdit}>
            De onde você está construindo? Algumas pessoas gostam de encontrar gente da mesma cidade
            pra projetos presenciais — outras fazem tudo remoto.
          </ProfileEmptyState>
        )}
      </ProfileSection>

      <ProfileSection eyebrow="03 · como contribuo" title="Skills">
        {user?.skills && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex h-8 items-center rounded-full bg-cream-2 px-3.5 text-[13px] text-ink ring-1 ring-line"
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <ProfileEmptyState cta="adicionar skills" onCta={onStartEdit}>
            Liste o que você topa fazer num time — design, código, escrita, produto, organização, o
            que for.{' '}
            <span className="not-italic font-medium text-ink">
              Skills ajudam outras pessoas a te chamar pro projeto certo.
            </span>
          </ProfileEmptyState>
        )}
      </ProfileSection>

      <ProfileSection eyebrow="04 · onde te encontrar" title="Links">
        <ProfileLinksManager />
      </ProfileSection>

      <ProfileSection eyebrow="05 · projetos no Juntaê" title="Construções">
        <ProfileProjectsSection />
      </ProfileSection>
    </>
  );
}
