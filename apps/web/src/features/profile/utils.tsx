import { ExternalLink, Globe } from 'lucide-react';
import type { ProfileLink } from './types';

export function getLinkIcon(kind: ProfileLink['kind']) {
  if (kind === 'portfolio') return <Globe size={14} aria-hidden="true" />;
  return <ExternalLink size={14} aria-hidden="true" />;
}
