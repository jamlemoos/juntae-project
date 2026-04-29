import { ArrowRight } from 'lucide-react';
import { getLinkIcon } from '../utils';
import type { ProfileLink } from '../types';

const KIND_LABEL: Record<ProfileLink['kind'], string> = {
  github: 'github',
  linkedin: 'linkedin',
  portfolio: 'portfólio',
  dribbble: 'dribbble',
  behance: 'behance',
};

interface LinkRowProps {
  link: ProfileLink;
}

export function LinkRow({ link }: LinkRowProps) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group -mx-1 flex items-center justify-between gap-4 rounded-md border-b hairline px-1 py-3 transition last:border-b-0 hover:bg-cream-2/40"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-2 ring-1 ring-line text-ink-2">
          {getLinkIcon(link.kind)}
        </span>
        <div className="min-w-0">
          <div className="mono text-[11px] uppercase tracking-[.18em] text-mute">
            {KIND_LABEL[link.kind]}
          </div>
          <div className="truncate text-[14.5px] text-ink">{link.value}</div>
        </div>
      </div>
      <span className="shrink-0 text-mute transition group-hover:text-ink">
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </a>
  );
}
