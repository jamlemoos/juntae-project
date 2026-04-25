import { Avatar } from './Avatar';

interface AvatarGroupMember {
  name: string;
  initials: string;
  avatarColor: string;
}

interface AvatarGroupProps {
  members: AvatarGroupMember[];
  max?: number;
}

export function AvatarGroup({ members, max = 4 }: AvatarGroupProps) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((member) => (
        <Avatar
          key={member.name}
          name={member.name}
          initials={member.initials}
          avatarColor={member.avatarColor}
          size="sm"
        />
      ))}
      {overflow > 0 && (
        <span
          className="w-7 h-7 rounded-full bg-surface-subtle border border-border text-xs font-medium text-content-secondary flex items-center justify-center flex-shrink-0 ring-2 ring-surface"
          aria-label={`Mais ${overflow} pessoas`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
