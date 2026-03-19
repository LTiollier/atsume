'use client';

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

/**
 * template.tsx remounts on every navigation (unlike layout.tsx).
 * Enables page transitions with implicit AnimatePresence.
 * (animation rule: page transitions ✅)
 */
export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
