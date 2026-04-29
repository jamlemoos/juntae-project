import type { ReactNode } from 'react';
import { SectionLayout } from '../../../shared/ui/SectionLayout';

interface ProfileSectionProps {
  eyebrow: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  divider?: boolean;
}

export function ProfileSection({ divider = true, ...props }: ProfileSectionProps) {
  return <SectionLayout divider={divider} {...props} />;
}
