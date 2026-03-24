'use client'

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import FirefliesBackground from '@/components/FirefliesBackground';

export default function GlobalError({
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
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: '#0a0a0b',
          color: '#f4f4f5',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <FirefliesBackground />
        {/* Icon */}
        <div
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(239,68,68,0.15)',
          }}
          aria-hidden
        >
          <AlertTriangle size={28} color="#ef4444" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '20rem' }}>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#f4f4f5' }}>
            Erreur critique
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: '#a1a1aa' }}>
            L&apos;application a rencontré un problème inattendu.
          </p>
          {error.digest && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#71717a', fontFamily: 'monospace' }}>
              #{error.digest}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2.25rem',
            padding: '0 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            opacity: 1,
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
