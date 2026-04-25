import type { HTMLAttributes } from 'react';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={['mx-auto w-full max-w-5xl px-4 sm:px-6', className].filter(Boolean).join(' ')}
    />
  );
}
