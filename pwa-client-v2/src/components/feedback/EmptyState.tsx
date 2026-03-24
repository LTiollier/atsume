import Link from 'next/link';
import {
  BookOpen,
  Heart,
  BookUp,
  Search,
  BookMarked,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

// Hoisted config par contexte — (rendering-hoist-jsx + js-index-maps)
const CONTEXT_CONFIG: Record<
  string,
  { icon: LucideIcon; title: string; description: string }
> = {
  collection: {
    icon: BookOpen,
    title: 'Votre collection est vide',
    description: 'Ajoutez des mangas via le scanner ou la recherche.',
  },
  wishlist: {
    icon: Heart,
    title: 'Votre wishlist est vide',
    description: 'Sauvegardez les éditions que vous souhaitez acquérir.',
  },
  loans: {
    icon: BookUp,
    title: 'Aucun prêt actif',
    description: "Vous n'avez actuellement aucun volume prêté.",
  },
  search: {
    icon: Search,
    title: 'Aucun résultat',
    description: 'Essayez avec un autre titre ou un ISBN.',
  },
  reading: {
    icon: BookMarked,
    title: 'Aucune progression enregistrée',
    description: 'Marquez vos volumes comme lus depuis votre collection.',
  },
  completion: {
    icon: CheckCircle2,
    title: 'Toutes vos séries sont complètes !',
    description: 'Aucun tome manquant dans vos éditions.',
  },
};

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  /** Contexte prédéfini — remplace icon/title/description si fourni */
  context?: keyof typeof CONTEXT_CONFIG;
  /** Overrides individuels (prioritaires sur context) */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

/**
 * EmptyState — composant d'état vide déclinable.
 * Server Component — aucun JS client.
 *
 * Utilisation :
 *   <EmptyState context="collection" action={{ label: "Scanner", href: "/scan" }} />
 *   <EmptyState title="Rien ici" description="..." />
 */
export function EmptyState({
  context,
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const preset = context ? CONTEXT_CONFIG[context] : null;

  const Icon = icon ?? preset?.icon ?? BookOpen;
  const resolvedTitle = title ?? preset?.title ?? 'Rien ici';
  const resolvedDescription = description ?? preset?.description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className,
      )}
      role="status"
    >
      {/* Icône dans un halo */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full"
        style={{
          background: 'color-mix(in oklch, var(--muted) 80%, var(--primary) 10%)',
        }}
        aria-hidden
      >
        <Icon
          size={28}
          style={{ color: 'var(--muted-foreground)' }}
          strokeWidth={1.5}
        />
      </div>

      {/* Texte */}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <p
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          {resolvedTitle}
        </p>
        {resolvedDescription && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {resolvedDescription}
          </p>
        )}
      </div>

      {/* CTA optionnel */}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center h-9 px-4 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
            }}
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center h-9 px-4 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
            }}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
