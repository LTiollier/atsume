import type { Metadata } from 'next';
import { ScanClient } from './ScanClient';

export const metadata: Metadata = {
  title: 'Scanner — Mangastore',
};

export default function ScanPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-6">
      <ScanClient />
    </div>
  );
}
