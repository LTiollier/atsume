import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 safe-area-top safe-area-bottom">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
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
            Manga<span style={{ color: 'var(--primary)' }}>store</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm border p-6"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: 'calc(var(--radius) * 2)',
          }}
        >
          {children}
        </div>
    </div>
  );
}
