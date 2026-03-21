'use client';

import { useState, useCallback } from 'react';

interface ConfirmationConfig {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  icon?: 'alert' | 'help';
  onConfirm: () => void;
}

/**
 * useConfirmationDialog — Hook pour gérer l'état et la configuration d'un dialog de confirmation.
 * Permet d'utiliser un seul composant Dialog pour plusieurs actions différentes.
 */
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmationConfig | null>(null);

  const confirm = useCallback((newConfig: ConfirmationConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  }, [config]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    confirm,
    handleConfirm,
    close,
    config,
  };
}
