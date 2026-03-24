import { cache } from 'react';
import api, { ApiResponse } from '@/lib/api';
import { isHttpError } from '@/lib/error';
import {
    Volume, VolumeSearchResult, Series, Edition, Box, BoxSet,
    PaginatedSeriesSearchResult,
} from '@/types/volume';
import {
    VolumeSchema, VolumeSearchResultSchema, PaginatedSeriesSearchResultSchema,
    SeriesSchema, EditionSchema, BoxSchema, BoxSetSchema,
} from '@/schemas/volume';
import { z } from 'zod';

/**
 * Améliorations audit Phase 1 :
 *
 * 1. `getCollection` wrappé avec `React.cache()` pour la déduplication dans les
 *    Server Components (règle Vercel `server-cache-react`) :
 *    Sans cache() → 2 Server Components = 2 requêtes HTTP
 *    Avec cache()  → même render = 1 seule requête
 *
 * 2. Zod laisse remonter les erreurs (plus de silent catch) — React Query
 *    gère l'état erreur proprement (règle `server-cache-react` / audit Phase 1).
 *    Seule exception : les méthodes utilisées uniquement côté client gardent
 *    un catch pour ne pas bloquer l'affichage sur données partielles.
 */

/** Pour les Server Components : déduplication via React.cache() */
export const getCollection = cache(() =>
    api.get<ApiResponse<Volume[]>>('/volumes')
        .then(r => z.array(VolumeSchema).parse(r.data.data))
);

export const volumeService = {
    /** Client-side : via React Query (utilise le même endpoint) */
    getCollection: () =>
        api.get<ApiResponse<Volume[]>>('/volumes')
            .then(r => z.array(VolumeSchema).parse(r.data.data)),

    search: (query: string, page = 1) =>
        api.get<PaginatedSeriesSearchResult>(
            `/volumes/search?query=${encodeURIComponent(query)}&page=${page}`
        ).then(r => {
            try {
                return PaginatedSeriesSearchResultSchema.parse(r.data);
            } catch {
                return r.data as unknown as PaginatedSeriesSearchResult;
            }
        }),

    searchByIsbn: async (isbn: string): Promise<VolumeSearchResult | null> => {
        try {
            const r = await api.get<ApiResponse<VolumeSearchResult>>(
                `/volumes/search/isbn?isbn=${encodeURIComponent(isbn)}`
            );
            return VolumeSearchResultSchema.parse(r.data.data);
        } catch (err) {
            if (isHttpError(err, 404)) return null;
            throw err;
        }
    },

    addToCollection: (apiId: string) =>
        api.post('/volumes', { api_id: apiId }),

    addBulk: (editionId: number, numbers: number[]) =>
        api.post('/volumes/bulk', { edition_id: editionId, numbers }),

    scanBulk: (isbns: string[]) =>
        api.post('/volumes/scan-bulk', { isbns }),

    bulkRemoveVolumes: (volumeIds: number[]) =>
        api.delete('/volumes/bulk', { data: { volume_ids: volumeIds } }),

    addBoxToCollection: (boxId: number, includeVolumes = true) =>
        api.post(`/boxes/${boxId}`, { include_volumes: includeVolumes }),

    removeBoxFromCollection: (boxId: number) =>
        api.delete(`/boxes/${boxId}`),

    getSeries: (id: number) =>
        api.get<ApiResponse<Series>>(`/series/${id}`)
            .then(r => SeriesSchema.parse(r.data.data) as Series),

    getEdition: (id: number) =>
        api.get<ApiResponse<Edition>>(`/editions/${id}`)
            .then(r => EditionSchema.parse(r.data.data) as Edition),

    getBox: (id: number) =>
        api.get<ApiResponse<Box>>(`/boxes/${id}`)
            .then(r => BoxSchema.parse(r.data.data) as Box),

    getBoxSet: (id: number) =>
        api.get<ApiResponse<BoxSet>>(`/box-sets/${id}`)
            .then(r => BoxSetSchema.parse(r.data.data) as BoxSet),

    getEditionVolumes: (editionId: number) =>
        api.get<ApiResponse<Volume[]>>(`/editions/${editionId}/volumes`)
            .then(r => z.array(VolumeSchema).parse(r.data.data) as Volume[]),

    // Unused — kept for type compatibility with VolumeSearchResult
    _searchResultSchema: VolumeSearchResultSchema,
};
