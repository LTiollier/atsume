import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

// Input styles tokens — applied via inline CSS so they pick up the active palette
const inputBase: React.CSSProperties = {
  background: 'var(--input)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontFamily: 'var(--font-body)',
};

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Slot for an icon or button inside the input on the right */
  right?: ReactNode;
}

/**
 * FormField — champ de formulaire labelisé avec style Void.
 * Utilisé uniquement dans des Client Components (react-hook-form).
 * Pas de "use client" nécessaire — la frontière est dans le parent.
 */
export function FormField({
  label,
  error,
  hint,
  right,
  id,
  className,
  style,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium leading-none"
        style={{ color: 'var(--foreground)' }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={fieldId}
          {...inputProps}
          className={cn(
            'w-full h-10 px-3 text-sm',
            'transition-shadow duration-150',
            'placeholder:text-[var(--muted-foreground)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]',
            error && 'ring-2 ring-[var(--destructive)]',
            right && 'pr-10',
            className,
          )}
          style={{ ...inputBase, ...style }}
          aria-describedby={
            error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
          }
          aria-invalid={!!error}
        />
        {right && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {right}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="text-xs"
          style={{ color: 'var(--destructive)' }}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
