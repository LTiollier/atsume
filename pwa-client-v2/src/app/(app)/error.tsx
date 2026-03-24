'use client'

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center w-full">
      {/* Icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full"
        style={{
          background: 'color-mix(in oklch, var(--muted) 80%, var(--destructive) 15%)',
        }}
        aria-hidden
      >
        <AlertTriangle size={28} style={{ color: 'var(--destructive)' }} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <p
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Une erreur est survenue
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir plus tard.
        </p>
        {error.digest && (
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
            #{error.digest}
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center justify-center h-9 px-4 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
