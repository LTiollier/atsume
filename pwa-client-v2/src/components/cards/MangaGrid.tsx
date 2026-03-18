import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MangaGridProps {
  children: ReactNode;
  /**
   * 'volumes' (défaut) — grille dense covers : 2→3→4→5→6 cols
   *   Utilise la classe CSS .manga-grid (globals.css).
   *   ⚠️ PAS d'animation sur les items — lag garanti sur 50+ volumes.
   *
   * 'series' — grille cartes séries : 2→3→4→5 cols
   *   Cartes plus larges avec espace pour titre + progress bar.
   */
  variant?: 'volumes' | 'series';
  className?: string;
}

export function MangaGrid({ children, variant = 'volumes', className }: MangaGridProps) {
  if (variant === 'series') {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn('manga-grid', className)}>
      {children}
    </div>
  );
}
