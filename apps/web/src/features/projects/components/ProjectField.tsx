import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface ProjectFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
}

export function ProjectField({ label, error, className, ...props }: ProjectFieldProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute"
        >
          {label}
        </label>
        {error && (
          <span id={errorId} role="alert" className="text-[11.5px] font-medium text-accent">
            {error}
          </span>
        )}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
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
    </div>
  );
}
