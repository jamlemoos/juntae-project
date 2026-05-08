import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { FALLBACK_CITIES, searchCities } from '../../features/location/cities';
import { useCitiesQuery } from '../../features/location/hooks/useCitiesQuery';
import type { CityOption } from '../../features/location/api/types';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  onBlur,
  error,
  label = 'Cidade',
  placeholder = 'Ex: Natal, São Paulo…',
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const { data: cities, isLoading, isError } = useCitiesQuery();
  const allCities = isError || !cities ? FALLBACK_CITIES : cities;

  const options = useMemo(() => searchCities(allCities, value), [allCities, value]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const listboxId = useId();
  const errorId = error ? `${inputId}-error` : undefined;

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

  function handleFocus() {
    setHighlighted(-1);
    setOpen(true);
  }

  function handleBlur(e: React.FocusEvent) {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setOpen(false);
    onBlur?.();
  }

  function selectOption(city: CityOption) {
    onChange(city.label);
    setOpen(false);
    setHighlighted(-1);
    inputRef.current?.focus();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setHighlighted(-1);
    setOpen(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHighlighted(0);
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
        setHighlighted((h) => Math.max(h - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0 && options[highlighted]) {
          selectOption(options[highlighted]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setHighlighted(-1);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  }

  const ringClass = error
    ? 'ring-error'
    : open
      ? 'ring-primary'
      : 'ring-line hover:ring-line-2 focus:ring-primary';

  const showDropdown = open && (isLoading || options.length > 0);

  return (
    <div ref={containerRef} onBlur={handleBlur}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={inputId}
          className="text-[11.5px] font-medium uppercase tracking-[.18em] text-mute"
        >
          {label}
        </label>
        {error && (
          <span id={errorId} role="alert" className="text-[11.5px] font-medium text-error">
            {error}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={[
            'h-12 w-full rounded-xl bg-cream px-4 text-[15px] text-ink',
            'placeholder:font-normal placeholder:text-mute',
            'outline-none ring-1 transition',
            ringClass,
          ].join(' ')}
        />

        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl bg-cream p-1.5 shadow-lg ring-1 ring-line"
          >
            {isLoading && !cities ? (
              <li className="px-3.5 py-2.5 text-[13px] text-mute">Carregando cidades…</li>
            ) : (
              options.map((city, idx) => (
                <li
                  key={city.id}
                  id={`${listboxId}-opt-${idx}`}
                  role="option"
                  aria-selected={value === city.label}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(city);
                  }}
                  className={[
                    'flex cursor-pointer select-none items-center justify-between',
                    'rounded-[10px] px-3.5 py-2.5 text-[15px] text-ink transition',
                    highlighted === idx ? 'bg-cream-2' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span>{city.name}</span>
                  <span className="mono ml-2 shrink-0 text-[11px] text-mute">{city.state}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
