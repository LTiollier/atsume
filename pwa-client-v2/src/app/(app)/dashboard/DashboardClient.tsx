'use client';

import { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Library, BookMarked, Users, AlertTriangle } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { useMangas, useLoansQuery, useReadingProgressQuery } from '@/hooks/queries';
import { StatGrid } from '@/components/dashboard/StatGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { VolumeCard } from '@/components/cards/VolumeCard';
import { SkeletonCard } from '@/components/feedback/SkeletonCard';
import { sectionVariants } from '@/lib/motion';
import type { Manga } from '@/types/manga';

const OVERDUE_DAYS = 30;
const RECENT_COUNT = 8;

// ─── Hoisted static JSX (rendering-hoist-jsx) ────────────────────────────────

const statsSkeletons = (
  <div
    className="grid grid-cols-2 gap-3 md:gap-4"
    aria-busy
    aria-label="Chargement des statistiques"
  >
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="skeleton h-[88px] rounded-[calc(var(--radius)*2)]" aria-hidden />
    ))}
  </div>
);

const recentSkeletons = (
  <div className="flex gap-3" aria-busy aria-label="Chargement">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="shrink-0 w-[72px]">
        <SkeletonCard />
      </div>
    ))}
  </div>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMangaHref(manga: Manga): string {
  const { series, edition } = manga;
  if (series?.id && edition?.id) return `/series/${series.id}/edition/${edition.id}`;
  return '/collection';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardClient() {
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 3 parallel queries — React Query fires them simultaneously (async-parallel)
  const { data: mangas = [], isLoading: mangasLoading } = useMangas();
  const { data: loans = [], isLoading: loansLoading } = useLoansQuery();
  const { data: readingProgress = [], isLoading: progressLoading } = useReadingProgressQuery();

  const statsLoading = mangasLoading || loansLoading || progressLoading;

  // Check for verification success
  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      toast.success('Email vérifié avec succès !');

      // Refresh user data to get the updated email_verified_at
      userService.getCurrentUser().then(updatedUser => {
        updateUser(updatedUser);
      }).catch(console.error);

      // Clean up URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('verified');
      const query = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/dashboard${query}`);
    }
  }, [searchParams, router, updateUser]);

  // Derived stats during render — no useEffect (rerender-derived-state-no-effect)
  const stats = useMemo(() => {
    const owned = mangas.filter(m => m.is_owned);
    // Set for O(1) lookup on unique series (js-set-map-lookups)
    const seriesIds = new Set(owned.map(m => m.series?.id).filter((id): id is number => id != null));
    return {
      totalVolumes: owned.length,
      totalSeries: seriesIds.size,
      totalRead: readingProgress.length,
      activeLoans: loans.filter(l => !l.is_returned).length,
    };
  }, [mangas, loans, readingProgress]);

  // Overdue loans — active for >= OVERDUE_DAYS
  const overdueCount = useMemo(
    () =>
      loans.filter(
        l =>
          !l.is_returned &&
          differenceInDays(new Date(), new Date(l.loaned_at)) >= OVERDUE_DAYS,
      ).length,
    [loans],
  );

  // Recent additions — first RECENT_COUNT owned volumes (API returns newest first)
  const recentMangas = useMemo(
    () => mangas.filter(m => m.is_owned).slice(0, RECENT_COUNT),
    [mangas],
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Collector';

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <motion.div variants={sectionVariants} initial="initial" animate="animate">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Bonjour,
        </p>
        <h1
          className="text-2xl font-bold mt-0.5 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          {firstName}
        </h1>
      </motion.div>

      {/* Overdue loans alert */}
      {!loansLoading && overdueCount > 0 && (
        <motion.div variants={sectionVariants} initial="initial" animate="animate">
          <Link
            href="/collection"
            className="flex items-center gap-3 p-4 transition-opacity hover:opacity-80"
            style={{
              background: 'color-mix(in oklch, var(--destructive) 12%, var(--card))',
              border: '1px solid color-mix(in oklch, var(--destructive) 35%, transparent)',
              borderRadius: 'calc(var(--radius) * 2)',
            }}
          >
            <AlertTriangle
              size={18}
              aria-hidden
              style={{ color: 'var(--destructive)', flexShrink: 0 }}
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {overdueCount} prêt{overdueCount > 1 ? 's' : ''} en retard
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Plus de {OVERDUE_DAYS} jours sans retour · Voir les prêts →
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Stats 2×2 */}
      <motion.section
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        aria-label="Statistiques de la collection"
      >
        <h2
          className="text-xs font-semibold uppercase mb-3"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
        >
          Ma collection
        </h2>
        {statsLoading ? (
          statsSkeletons
        ) : (
          <StatGrid>
            <StatCard icon={BookOpen} value={stats.totalVolumes} label="Volumes possédés" highlight />
            <StatCard icon={Library} value={stats.totalSeries} label="Séries" />
            <StatCard icon={BookMarked} value={stats.totalRead} label="Volumes lus" />
            <StatCard icon={Users} value={stats.activeLoans} label="Prêts actifs" />
          </StatGrid>
        )}
      </motion.section>

      {/* Recent additions */}
      {(mangasLoading || recentMangas.length > 0) && (
        <motion.section
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          aria-label="Derniers ajouts à la collection"
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xs font-semibold uppercase"
              style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
            >
              Derniers ajouts
            </h2>
            <Link
              href="/collection"
              className="text-xs transition-opacity hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Voir tout
            </Link>
          </div>

          {/*
           * -mx-4 + px-4: scroll bleeds to screen edges
           * while keeping the first item indented
           */}
          <div className="overflow-x-auto -mx-4 px-4">
            {mangasLoading ? (
              recentSkeletons
            ) : (
              <div className="flex gap-3 pb-1">
                {recentMangas.map(manga => (
                  <div key={manga.id} className="shrink-0 w-[72px]">
                    <VolumeCard manga={manga} href={getMangaHref(manga)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
}
