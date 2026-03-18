'use client';

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

/**
 * template.tsx re-monte à chaque navigation (contrairement à layout.tsx).
 * Permet les transitions de page avec AnimatePresence implicite.
 * (règle animations : transitions de page ✅)
 */
export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
