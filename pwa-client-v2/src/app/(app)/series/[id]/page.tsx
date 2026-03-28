import type { Metadata } from 'next';
import { SeriesDetailClient } from './SeriesDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Server Component — reads [id] from route params (Next.js 15 async params).
 * Data fetching is client-side (SeriesDetailClient) — same constraint as
 * DashboardPage: session cookie forwarding not yet configured for RSC.
 *
 * generateMetadata: attempts to fetch series title for dynamic OG tags.
 * Falls back to generic title until Sanctum cookie forwarding is configured.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (!isNaN(seriesId)) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/series/${seriesId}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        const series = json.data;
        return {
          title: `${series.title} — Atsume`,
          openGraph: {
            title: series.title,
            images: series.cover_url ? [series.cover_url] : [],
          },
        };
      }
    } catch {
      // fallback ci-dessous
    }
  }

  return { title: 'Série — Atsume' };
}

export default async function SeriesPage({ params }: Props) {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-6 lg:max-w-4xl">
      <SeriesDetailClient seriesId={isNaN(seriesId) ? 0 : seriesId} />
    </div>
  );
}
