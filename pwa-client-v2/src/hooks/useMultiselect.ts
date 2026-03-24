import { useState } from 'react';

interface SelectableItem {
  id: number;
}

/**
 * Generic multiselect over a list of items (owned or all).
 * Functional setState keeps callbacks referentially stable against stale closures.
 * (rerender-functional-setstate)
 */
export function useMultiselect<T extends SelectableItem>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(() => new Set());

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;

  function handleToggle(item: T) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds(prev => {
      if (isAllSelected) return new Set();
      return new Set(items.map(i => i.id));
    });
  }

  function selectMany(subset: T[]) {
    setSelectedIds(new Set(subset.map(i => i.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  return { 
    selectedIds, 
    handleToggle, 
    toggleSelectAll, 
    selectMany, 
    clearSelection,
    isAllSelected,
  };
}
