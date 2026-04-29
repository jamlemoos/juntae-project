import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface ProjectSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function ProjectSelect({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Selecione...',
  error,
}: ProjectSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const valueTextId = useId();
  const listboxId = useId();
  const errorId = error ? `${labelId}-error` : undefined;

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  function openDropdown() {
    const idx = options.findIndex((o) => o.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setHighlighted(-1);
    triggerRef.current?.focus();
  }

  function selectOption(optValue: string) {
    onChange(optValue);
    setOpen(false);
    setHighlighted(-1);
    triggerRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlighted >= 0) selectOption(options[highlighted].value);
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  }

  const ringClass = error
    ? 'ring-accent'
    : open
      ? 'ring-ink'
      : 'ring-line hover:ring-line-2 focus:ring-ink';

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span
          id={labelId}
          className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute"
        >
          {label}
        </span>
        {error && (
          <span id={errorId} role="alert" className="text-[11.5px] font-medium text-accent">
            {error}
          </span>
        )}
      </div>

      <div className="relative" ref={containerRef}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${labelId} ${valueTextId}`}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onBlur={onBlur}
          onClick={() => (open ? closeDropdown() : openDropdown())}
          onKeyDown={handleKeyDown}
          className={[
            'flex h-12 w-full items-center justify-between rounded-xl bg-cream px-4',
            'text-[15px] outline-none ring-1 transition',
            ringClass,
            !selectedLabel ? 'text-mute' : 'text-ink',
          ].join(' ')}
        >
          <span id={valueTextId}>{selectedLabel ?? placeholder}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={[
              'shrink-0 text-mute transition-transform duration-150',
              open && 'rotate-180',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl bg-cream p-1.5 shadow-lg ring-1 ring-line"
          >
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={opt.value === value}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => selectOption(opt.value)}
                className={[
                  'flex cursor-pointer select-none items-center justify-between',
                  'rounded-[10px] px-3.5 py-2.5 text-[15px] text-ink transition',
                  highlighted === idx ? 'bg-cream-2' : '',
                  opt.value === value ? 'font-medium' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <Check size={13} aria-hidden="true" className="text-accent" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
