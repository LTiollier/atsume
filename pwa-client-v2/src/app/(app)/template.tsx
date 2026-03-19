'use client';

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

/**
 * template.tsx re-monte à chaque navigation (contrairement à layout.tsx).
 * → Permet le fade entre les pages (dashboard → collection → search…)
 * → Shell (layout) reste monté en permanence : BottomNav ne clignote pas
 *
 * Règle animations : transitions de page ✅ — fade 200ms/150ms (pageVariants)
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
