import type { Metadata } from 'next';
import { CollectionHub } from './CollectionHub';

export const metadata: Metadata = {
  title: 'Collection — Mangastore',
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

/**
 * Server Component — reads active tab from URL server-side.
 * CollectionHub receives defaultTab as prop: no useSearchParams client-side,
 * no Suspense boundary needed.
 */
export default async function CollectionPage({ searchParams }: Props) {
  const { tab = 'library' } = await searchParams;
  return <CollectionHub defaultTab={tab} />;
}
