import type { Metadata } from 'next';
import { SeriesDetailClient } from './SeriesDetailClient';

export const metadata: Metadata = {
  title: 'Série — Atsume',
};

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Server Component — reads [id] from route params (Next.js 15 async params).
 * Data fetching is client-side (SeriesDetailClient) — same constraint as
 * DashboardPage: session cookie forwarding not yet configured for RSC.
 */
export default async function SeriesPage({ params }: Props) {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-6 lg:max-w-4xl">
      <SeriesDetailClient seriesId={isNaN(seriesId) ? 0 : seriesId} />
    </div>
  );
}
