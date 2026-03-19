'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Library, UserX, ChevronRight } from 'lucide-react';

import { usePublicProfileQuery, usePublicCollectionQuery } from '@/hooks/queries';
import { StatGrid } from '@/components/dashboard/StatGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { sectionVariants } from '@/lib/motion';

// ─── Hoisted static JSX (rendering-hoist-jsx) ─────────────────────────────────

const profileSkeleton = (
  <div className="flex flex-col items-center gap-5 py-8" aria-busy aria-hidden>
    <div className="skeleton w-20 h-20 rounded-full" />
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="skeleton h-5 w-36 rounded" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
    <div className="w-full grid grid-cols-2 gap-3 mt-1">
      <div className="skeleton h-[88px] rounded-[calc(var(--radius)*2)]" />
      <div className="skeleton h-[88px] rounded-[calc(var(--radius)*2)]" />
    </div>
    <div className="skeleton h-11 w-full rounded mt-1" />
  </div>
);

const notFoundState = (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <div
      className="flex items-center justify-center w-16 h-16 rounded-full"
      style={{ background: 'var(--muted)' }}
    >
      <UserX size={28} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
    </div>
    <div className="flex flex-col gap-1">
      <p
        className="text-base font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
      >
        Profil introuvable
      </p>
      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Ce profil est privé ou n&apos;existe pas.
      </p>
    </div>
    <Link
      href="/"
      className="text-sm font-medium transition-opacity hover:opacity-70"
      style={{ color: 'var(--primary)' }}
    >
      ← Retour à l&apos;accueil
    </Link>
  </div>
);

// ─── PublicProfileClient ──────────────────────────────────────────────────────

interface PublicProfileClientProps {
  username: string;
}

export function PublicProfileClient({ username }: PublicProfileClientProps) {
  // 2 queries fired simultaneously by React Query — no waterfall (async-parallel)
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = usePublicProfileQuery(username);

  const { data: collection = [], isLoading: collectionLoading } =
    usePublicCollectionQuery(username);

  const isLoading = profileLoading || collectionLoading;

  // Stats derived during render — no useEffect (rerender-derived-state-no-effect)
  // Set for O(1) unique series deduplication (js-set-map-lookups)
  const { seriesCount, volumeCount } = useMemo(() => {
    const seriesIds = new Set(
      collection
        .filter(m => m.series?.id != null)
        .map(m => m.series!.id),
    );
    return { seriesCount: seriesIds.size, volumeCount: collection.length };
  }, [collection]);

  // Avatar letter — first char of username or name
  const avatarLetter = profile
    ? (profile.username?.[0] ?? profile.name?.[0] ?? '?').toUpperCase()
    : '?';

  if (isLoading) return profileSkeleton;
  if (profileError || !profile) return notFoundState;

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center gap-6 pt-4 pb-2"
    >
      {/* Avatar — first letter, primary background */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold select-none"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          fontFamily: 'var(--font-display)',
          // Subtle glow matching current palette
          boxShadow: 'var(--shadow-glow-sm)',
        }}
        aria-hidden
      >
        {avatarLetter}
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          @{profile.username}
        </p>
        {profile.name && profile.name !== profile.username && (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {profile.name}
          </p>
        )}
      </div>

      {/* Stats — 2 cards with stagger (StatGrid handles the animation container) */}
      <div className="w-full">
        <StatGrid>
          <StatCard icon={Library} value={seriesCount} label="Séries" />
          <StatCard icon={BookOpen} value={volumeCount} label="Volumes" highlight />
        </StatGrid>
      </div>

      {/* CTA */}
      <Link
        href={`/user/${username}/collection`}
        className="w-full flex items-center justify-center gap-2 h-11 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
        }}
      >
        Voir la collection
        <ChevronRight size={16} aria-hidden />
      </Link>
    </motion.div>
  );
}
