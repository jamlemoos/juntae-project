import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-content-tertiary" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-content mb-1">{title}</h3>
      {description && <p className="text-sm text-content-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
