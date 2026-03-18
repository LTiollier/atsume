'use client';

import { useRef, useState, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  /** Appelé sur chaque keystroke — wrappé dans startTransition (non-urgent) */
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
}

/**
 * SearchBar — icône loupe intégrée, clear button, transition non-urgente.
 *
 * Pattern Vercel `rerender-transitions` : le callback onChange est wrappé
 * dans startTransition — l'input reste responsive même si le parent
 * re-render lentement (filtrage d'une grande liste par ex).
 *
 * `hasValue` est le seul état React — le DOM garde la vraie valeur string,
 * évitant un re-render complet à chaque keystroke pour le contenu parent.
 */
export function SearchBar({
  placeholder = 'Rechercher…',
  defaultValue = '',
  onChange,
  onClear,
  className,
  autoFocus,
}: SearchBarProps) {
  // Seul le booléen est en state React — pas la chaîne complète (rerender-use-ref-transient-values)
  const [hasValue, setHasValue] = useState(!!defaultValue);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setHasValue(next.length > 0);
    // Non-urgent : laisse l'input fluide pendant que le parent filtre
    startTransition(() => {
      onChange?.(next);
    });
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = '';
    setHasValue(false);
    startTransition(() => {
      onChange?.('');
      onClear?.();
    });
    inputRef.current?.focus();
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      {/* Loupe — ou spinner pendant la transition */}
      <div
        className="absolute left-3 pointer-events-none"
        aria-hidden
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
        ) : (
          <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
        )}
      </div>

      <input
        ref={inputRef}
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          'w-full h-10 pl-9 pr-9 text-sm',
          'placeholder:text-[var(--muted-foreground)]',
          'transition-shadow duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]',
          // Hide native clear button (webkit)
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        style={{
          background: 'var(--input)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)',
        }}
        aria-label={placeholder}
      />

      {/* Clear button — visible uniquement si texte présent */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 flex items-center justify-center w-4 h-4 rounded-full transition-opacity hover:opacity-80"
          style={{ background: 'var(--muted-foreground)' }}
          aria-label="Effacer la recherche"
        >
          <X size={10} style={{ color: 'var(--background)' }} />
        </button>
      )}
    </div>
  );
}
