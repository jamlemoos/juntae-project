interface Skill {
  id: string;
  name: string;
}

interface ProfileSkillsSelectorProps {
  availableSkills: Skill[];
  selectedSkillIds: string[];
  onToggle: (id: string) => void;
}

export function ProfileSkillsSelector({
  availableSkills,
  selectedSkillIds,
  onToggle,
}: ProfileSkillsSelectorProps) {
  if (availableSkills.length === 0) return null;

  return (
    <div>
      <div className="mb-2.5 text-[12px] font-medium uppercase tracking-[.18em] text-mute">
        skills
      </div>
      <div className="flex flex-wrap gap-2">
        {availableSkills.map((skill) => {
          const selected = selectedSkillIds.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => onToggle(skill.id)}
              className={[
                'inline-flex h-8 items-center rounded-full px-3.5 text-[13px] transition',
                selected
                  ? 'bg-ink text-cream ring-1 ring-ink'
                  : 'bg-transparent text-mute ring-1 ring-dashed ring-line-2 hover:text-ink hover:ring-ink',
              ].join(' ')}
            >
              {selected ? '✓ ' : '+ '}
              {skill.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
