import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ProfileEmptyStateProps {
  children: ReactNode;
  cta?: string;
}

export function ProfileEmptyState({ children, cta }: ProfileEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
      <p className="serif italic max-w-[44ch] text-[17px] leading-[1.55] text-ink-2">{children}</p>
      {cta && (
        <button
          type="button"
          className="ulink mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent"
        >
          {cta} <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
