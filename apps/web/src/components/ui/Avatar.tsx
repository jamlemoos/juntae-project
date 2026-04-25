import type { CSSProperties } from 'react';

type AvatarSize = 'sm' | 'md';

interface AvatarProps {
  name: string;
  initials: string;
  avatarColor: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
};

export function Avatar({ name, initials, avatarColor, size = 'md' }: AvatarProps) {
  const style: CSSProperties = { backgroundColor: avatarColor };
  return (
    <span
      className={[
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ring-surface',
        sizeClasses[size],
      ].join(' ')}
      style={style}
      aria-label={name}
      title={name}
    >
      {initials}
    </span>
  );
}
