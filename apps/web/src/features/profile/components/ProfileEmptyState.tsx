import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ProfileEmptyStateProps {
  children: ReactNode;
  cta?: string;
  onCta?: () => void;
}

export function ProfileEmptyState({ children, cta, onCta }: ProfileEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-5 md:p-6">
      <p className="serif italic max-w-[44ch] text-[17px] leading-[1.55] text-ink-2">{children}</p>
      {cta && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="ulink mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-error cursor-pointer"
        >
          {cta} <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
