export type LinkKind = 'github' | 'linkedin' | 'portfolio' | 'dribbble' | 'behance';

export type ProfileLink = {
  kind: LinkKind;
  label: string;
  value: string;
  href: string;
};

export type ProjectStatus = 'ativo' | 'buscando' | 'pausado';

export type ProfileProject = {
  name: string;
  role: string;
  status: ProjectStatus;
  context: string;
};

export type CompletionItem = {
  label: string;
  done: boolean;
};
