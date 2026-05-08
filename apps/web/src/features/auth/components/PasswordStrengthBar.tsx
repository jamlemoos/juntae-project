interface PasswordStrengthBarProps {
  score: 0 | 1 | 2 | 3;
}

export function PasswordStrengthBar({ score }: PasswordStrengthBarProps) {
  return (
    <div className="mt-2 flex gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-[3px] flex-1 rounded-full transition-colors ${i < score ? 'bg-primary' : 'bg-line'}`}
        />
      ))}
    </div>
  );
}
