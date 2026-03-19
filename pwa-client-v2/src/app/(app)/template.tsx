'use client';

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

/**
 * template.tsx remounts on every navigation (unlike layout.tsx).
 * → Enables page fade (dashboard → collection → search…)
 * → Shell (layout) stays mounted: BottomNav does not flicker
 *
 * Animation rule: page transitions ✅ — fade 200ms/150ms (pageVariants)
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
