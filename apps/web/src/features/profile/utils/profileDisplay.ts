import type { UserResponse } from '../../users/api/types';
import type { UserProfileResponse } from '../../users/api/profileEndpoints';
import type { CompletionItem } from '../types';

export const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Disponível' },
  { value: 'busy', label: 'Ocupado(a)' },
  { value: 'open_to_opportunities', label: 'Aberto(a) a oportunidades' },
] as const;

export function getAvatarInitial(name: string | undefined | null): string {
  return name?.charAt(0)?.toUpperCase() ?? '?';
}

export function getMemberSince(createdAt: string | undefined | null): string | null {
  if (!createdAt) return null;
  return new Date(createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function getAvailabilityLabel(availability: string | undefined | null): string {
  return AVAILABILITY_OPTIONS.find((o) => o.value === availability)?.label ?? 'Disponível';
}

export function getCompletionItems(
  user: UserResponse | null | undefined,
  profile: UserProfileResponse | undefined
): CompletionItem[] {
  return [
    { label: 'Nome', done: !!user?.name },
    { label: 'Bio', done: !!user?.bio },
    { label: 'Cidade', done: !!user?.city },
    { label: 'Skills', done: (user?.skills?.length ?? 0) > 0 },
    { label: 'Headline', done: !!profile?.headline },
  ];
}
