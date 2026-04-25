interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-3"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-content-secondary" aria-hidden="true">
        {message}
      </p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
