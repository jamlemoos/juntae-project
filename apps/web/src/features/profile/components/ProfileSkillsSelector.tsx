import { useState } from 'react';
import { X } from 'lucide-react';

interface ProfileSkillsSelectorProps {
  skills: string[];
  onAddSkill: (name: string) => void;
  onRemoveSkill: (name: string) => void;
  disabled?: boolean;
}

export function ProfileSkillsSelector({
  skills,
  onAddSkill,
  onRemoveSkill,
  disabled,
}: ProfileSkillsSelectorProps) {
  const [inputValue, setInputValue] = useState('');

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) return;
    onAddSkill(name);
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div>
      <div className="mb-2.5 text-[12px] font-medium uppercase tracking-[.18em] text-mute">
        skills
      </div>

      {skills.length === 0 ? (
        <p className="mb-3 text-[13px] text-mute">Nenhuma skill adicionada ainda.</p>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          {skills.map((name) => (
            <span
              key={name}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary/10 pl-3.5 pr-2 text-[13px] text-primary ring-1 ring-primary/30"
            >
              {name}
              <button
                type="button"
                onClick={() => onRemoveSkill(name)}
                disabled={disabled}
                aria-label={`Remover ${name}`}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-primary/60 transition hover:bg-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="ex: frontend, design…"
          className="min-w-0 flex-1 rounded-xl bg-cream px-4 py-2 text-[13px] text-ink ring-1 ring-line placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim() || disabled}
          className="cursor-pointer rounded-xl px-4 py-2 text-[13px] font-medium text-primary ring-1 ring-primary/50 transition hover:bg-primary/5 active:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
