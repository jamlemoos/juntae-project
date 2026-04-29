import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface ProjectTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  error?: string;
}

export function ProjectTextarea({
  label,
  error,
  rows = 4,
  className,
  ...props
}: ProjectTextareaProps) {
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
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
        className={[
          'w-full resize-y rounded-xl bg-cream px-4 py-3 text-[15px] text-ink',
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
