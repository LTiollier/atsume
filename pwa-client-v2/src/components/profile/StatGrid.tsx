'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { statContainerVariants } from '@/lib/motion';

interface StatGridProps {
  children: ReactNode;
}

export function StatGrid({ children }: StatGridProps) {
  return (
    <motion.div
      variants={statContainerVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 gap-3 md:gap-4"
    >
      {children}
    </motion.div>
  );
}
