import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={[
          'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-content',
          'placeholder:text-content-tertiary',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-error' : 'border-border',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p id={errorId} className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
