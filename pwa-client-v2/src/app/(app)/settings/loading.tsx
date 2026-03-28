// ─── Skeletons hoisted at module level (rendering-hoist-jsx) ──────────────────

const sectionHeaderSkeleton = (
  <div className="mb-5" aria-hidden>
    <div className="skeleton h-3 w-24 rounded mb-2" />
    <div className="skeleton h-3.5 w-full rounded" />
    <div className="skeleton h-3.5 w-3/4 rounded mt-1" />
  </div>
);

const fieldSkeleton = (
  <div className="flex flex-col gap-1.5" aria-hidden>
    <div className="skeleton h-3 w-20 rounded" />
    <div className="skeleton h-10 w-full rounded-[calc(var(--radius)*1.5)]" />
  </div>
);

const toggleRowSkeleton = (
  <div className="flex items-center justify-between gap-4 py-1" aria-hidden>
    <div className="flex flex-col gap-1">
      <div className="skeleton h-3.5 w-28 rounded" />
      <div className="skeleton h-3 w-40 rounded" />
    </div>
    <div className="skeleton h-6 w-10 rounded-full shrink-0" />
  </div>
);

const swatchRowSkeleton = (
  <div className="flex gap-2 py-1" aria-hidden>
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} className="skeleton w-8 h-8 rounded-full" />
    ))}
  </div>
);

const divider = (
  <div className="h-px my-6" style={{ background: 'var(--border)' }} aria-hidden />
);

export default function SettingsLoading() {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        {/* Apparence */}
        {sectionHeaderSkeleton}
        {swatchRowSkeleton}
        {swatchRowSkeleton}
        {divider}

        {/* Profil */}
        {sectionHeaderSkeleton}
        {fieldSkeleton}
        {toggleRowSkeleton}
        {divider}

        {/* Sécurité */}
        {sectionHeaderSkeleton}
        {fieldSkeleton}
        {fieldSkeleton}
      </div>
    </div>
  );
}
