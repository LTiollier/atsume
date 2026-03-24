import Link from 'next/link';
import { BookOpen, SearchX } from 'lucide-react';
import FirefliesBackground from '@/components/FirefliesBackground';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ position: 'relative', zIndex: 1, background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <FirefliesBackground />
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div
          className="w-11 h-11 flex items-center justify-center"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 'calc(var(--radius) * 2)',
          }}
        >
          <BookOpen size={22} aria-hidden />
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Atsume
        </span>
      </div>

      {/* Icon */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'color-mix(in oklch, var(--muted) 80%, var(--primary) 10%)',
        }}
        aria-hidden
      >
        <SearchX size={36} style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 max-w-xs text-center mb-8">
        <p
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          404
        </p>
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Page introuvable
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
        }}
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
