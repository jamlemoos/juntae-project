import type { LinkKind, UserLink } from './types';

type UserLinkApiResponse = {
  id: string;
  kind: string;
  label: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export function mapUserLink(raw: UserLinkApiResponse): UserLink {
  return {
    id: raw.id,
    kind: raw.kind as LinkKind,
    label: raw.label,
    url: raw.url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export type { UserLinkApiResponse };
