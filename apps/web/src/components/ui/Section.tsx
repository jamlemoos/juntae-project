import type { HTMLAttributes, ReactNode } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section {...props} className={['py-16 sm:py-20', className].filter(Boolean).join(' ')}>
      {children}
    </section>
  );
}
