import type { Metadata } from 'next';
import { BoxSetDetailClient } from './BoxSetDetailClient';

export const metadata: Metadata = {
  title: 'Coffret — Mangastore',
};

interface Props {
  params: Promise<{ id: string; boxSetId: string }>;
}

export default async function BoxSetPage({ params }: Props) {
  const { id, boxSetId } = await params;
  const seriesId = parseInt(id, 10);
  const parsedBoxSetId = parseInt(boxSetId, 10);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-6 lg:max-w-4xl">
      <BoxSetDetailClient
        seriesId={isNaN(seriesId) ? 0 : seriesId}
        boxSetId={isNaN(parsedBoxSetId) ? 0 : parsedBoxSetId}
      />
    </div>
  );
}
