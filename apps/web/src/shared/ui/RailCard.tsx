import type { ReactNode } from 'react';

interface RailCardProps {
  children: ReactNode;
  className?: string;
}

export function RailCard({ children, className }: RailCardProps) {
  return (
    <aside
      className={['lift rounded-[28px] bg-cream-2 p-7 ring-1 ring-line', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </aside>
  );
}
