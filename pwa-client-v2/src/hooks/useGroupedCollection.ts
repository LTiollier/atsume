"use client";

import { useMemo } from "react";
import { Volume, GroupedSeries } from "@/types/volume";

/**
 * Groupe un tableau de Volume par série.
 * Les volumes sans série sont groupés sous une série synthétique.
 *
 * Règle Vercel `rerender-memo` : les deux useMemo sont distincts pour éviter
 * de recalculer le groupement quand seul le filtre change.
 */
export function useGroupedCollection(volumes: Volume[], searchQuery: string = ""): GroupedSeries[] {
    const filteredVolumes = useMemo(() =>
        volumes.filter(volume =>
            volume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (volume.series?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (volume.authors?.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
        ),
        [volumes, searchQuery]
    );

    return useMemo(() => {
        const grouped = filteredVolumes.reduce((acc, volume) => {
            const seriesId = volume.series?.id || 0;
            if (!acc[seriesId]) {
                acc[seriesId] = {
                    series: volume.series || {
                        id: 0,
                        title: volume.title,
                        authors: volume.authors,
                        cover_url: volume.cover_url,
                    },
                    volumes: [],
                };
            }
            acc[seriesId].volumes.push(volume);
            return acc;
        }, {} as Record<number, GroupedSeries>);

        return Object.values(grouped);
    }, [filteredVolumes]);
}
