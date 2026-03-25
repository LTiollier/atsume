import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 safe-area-top safe-area-bottom">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Atsume"
            width={64}
            height={64}
            priority
            unoptimized
            style={{ borderRadius: 'calc(var(--radius) * 2)' }}
          />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            Atsume
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
