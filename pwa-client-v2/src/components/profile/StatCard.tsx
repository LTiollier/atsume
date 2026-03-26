'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { statCardVariants } from '@/lib/motion';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  highlight?: boolean;
}

export function StatCard({ icon: Icon, value, label, highlight = false }: StatCardProps) {
  const displayValue =
    typeof value === 'number' ? value.toLocaleString('fr-FR') : value;

  const iconColor = highlight ? 'var(--primary)' : 'var(--muted-foreground)';
  const valueColor = highlight ? 'var(--primary)' : 'var(--foreground)';

  return (
    <motion.div
      variants={statCardVariants}
      className="flex flex-col gap-3 p-4 rounded-[calc(var(--radius)*2)]"
      style={{
        background: highlight
          ? 'color-mix(in oklch, var(--primary) 10%, var(--card))'
          : 'var(--card)',
        boxShadow: highlight ? 'var(--shadow-glow-sm)' : 'var(--shadow-xs)',
      }}
    >
      <div className="flex items-center justify-between">
        <Icon size={20} style={{ color: iconColor }} aria-hidden />
        <span
          className="font-bold leading-none tabular-nums"
          style={{
            fontSize: 32,
            color: valueColor,
            fontFamily: 'var(--font-display)',
          }}
        >
          {displayValue}
        </span>
      </div>
      <span
        className="text-[13px] leading-none"
        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
    </motion.div>
  );
}
