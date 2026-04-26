import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  rightLabel?: ReactNode;
}

export function AuthField({ label, error, hint, rightLabel, className, ...props }: AuthFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute"
        >
          {label}
        </label>
        {error ? (
          <span id={`${id}-error`} className="text-[11.5px] font-medium text-accent">
            {error}
          </span>
        ) : (
          rightLabel && <span className="serif italic text-[11.5px] text-mute">{rightLabel}</span>
        )}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
        className={[
          'h-12 w-full rounded-xl bg-cream px-4 text-[15px] text-ink',
          'placeholder:font-normal placeholder:text-mute',
          'outline-none ring-1 transition',
          error ? 'ring-accent' : 'ring-line hover:ring-line-2 focus:ring-ink',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] leading-snug text-mute">
          {hint}
        </p>
      )}
    </div>
  );
}
