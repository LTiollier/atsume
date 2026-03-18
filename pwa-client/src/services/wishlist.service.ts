import api, { ApiResponse } from '@/lib/api';
import { WishlistItem } from '@/types/manga';
import { WishlistItemSchema } from '@/schemas/manga';
import { z } from 'zod';

export const wishlistService = {
    /** Récupère la liste de souhaits (éditions et coffrets) */
    getAll: () =>
        api.get<ApiResponse<WishlistItem[]>>('/wishlist').then(r => {
            try {
                return z.array(WishlistItemSchema).parse(r.data.data) as WishlistItem[];
            } catch (error) {
                console.error('Wishlist validation failed:', error);
                return r.data.data as unknown as WishlistItem[];
            }
        }),

    /** Ajoute une édition par son ID local */
    addByEditionId: (editionId: number) =>
        api.post('/wishlist', { edition_id: editionId }),

    /** Ajoute un item (coffret/box_set) via son api_id externe */
    add: (apiId: string) =>
        api.post('/wishlist', { api_id: apiId }),

    /** Retire un item de la wishlist (type: 'edition' | 'box') */
    remove: (id: number, type: 'edition' | 'box') =>
        api.delete(`/wishlist/${id}`, { data: { type } }),
};
