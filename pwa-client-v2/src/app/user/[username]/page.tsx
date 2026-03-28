import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PublicProfileClient } from './PublicProfileClient';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const name: string = json.data?.name ?? `@${username}`;
      return {
        title: `${name} (@${username}) — Atsume`,
        description: `Collection publique de ${name} sur Atsume.`,
        openGraph: {
          title: `${name} (@${username}) — Atsume`,
          description: `Collection publique de ${name} sur Atsume.`,
        },
      };
    }
  } catch {
    // fallback ci-dessous
  }

  return {
    title: `@${username} — Atsume`,
    description: `Collection publique de @${username} sur Atsume.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-sm mx-auto px-4 pt-4 pb-6">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-4 transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ChevronLeft size={15} aria-hidden />
          Atsume
        </Link>

        <PublicProfileClient username={username} />
      </div>
    </div>
  );
}
