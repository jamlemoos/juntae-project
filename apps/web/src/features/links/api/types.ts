export type LinkKind =
  | 'LINKEDIN'
  | 'GITHUB'
  | 'BEHANCE'
  | 'DRIBBBLE'
  | 'FIGMA'
  | 'PORTFOLIO'
  | 'OTHER';

export const LINK_KIND_OPTIONS: { value: LinkKind; label: string }[] = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'BEHANCE', label: 'Behance' },
  { value: 'DRIBBBLE', label: 'Dribbble' },
  { value: 'FIGMA', label: 'Figma' },
  { value: 'PORTFOLIO', label: 'Portfolio' },
  { value: 'OTHER', label: 'Outro' },
];

export type UserLink = {
  id: string;
  kind: LinkKind;
  label: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLinkRequest = {
  kind: LinkKind;
  label?: string;
  url: string;
};

export type UpdateLinkRequest = {
  kind: LinkKind;
  label?: string;
  url: string;
};
