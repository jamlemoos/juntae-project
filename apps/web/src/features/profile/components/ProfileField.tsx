import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface ProfileFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
}

export function ProfileField({ label, error, ...props }: ProfileFieldProps) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12px] font-medium uppercase tracking-[.18em] text-mute"
      >
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={[
          'w-full rounded-xl bg-cream px-4 py-3 text-[14.5px] text-ink placeholder:text-mute focus:outline-none focus:ring-2',
          error ? 'ring-1 ring-error focus:ring-error' : 'ring-1 ring-line focus:ring-primary',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[12px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
