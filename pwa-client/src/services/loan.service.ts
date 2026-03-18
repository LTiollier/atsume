import api, { ApiResponse } from '@/lib/api';
import { Loan } from '@/types/manga';
import { LoanSchema } from '@/schemas/manga';
import { z } from 'zod';

export const loanService = {
    /** Récupère tous les prêts de l'utilisateur */
    getAll: () =>
        api.get<ApiResponse<Loan[]>>('/loans').then(r => {
            try {
                return z.array(LoanSchema).parse(r.data.data);
            } catch (error) {
                console.error("Loan validation failed:", error);
                return r.data.data as unknown as Loan[];
            }
        }),

    /** Déclare un prêt pour un objet unique (volume ou box) */
    create: (id: number, type: 'volume' | 'box', borrowerName: string, notes?: string | null) =>
        api.post('/loans', { 
            loanable_id: id, 
            loanable_type: type, 
            borrower_name: borrowerName, 
            notes: notes ?? null 
        }),

    /** Déclare un prêt groupé pour plusieurs volumes (transactionnel) */
    /** NOTE: Pour l'instant on garde volume_ids pour la compatibilité backend BulkLoanMangaAction */
    createBulk: (volumeIds: number[], borrowerName: string, notes?: string | null) =>
        api.post<ApiResponse<Loan[]>>('/loans/bulk', {
            volume_ids: volumeIds,
            borrower_name: borrowerName,
            notes: notes ?? null
        }).then(r => {
            try {
                return z.array(LoanSchema).parse(r.data.data);
            } catch (error) {
                console.error("Bulk loan validation failed:", error);
                return r.data.data as unknown as Loan[];
            }
        }),

    /** Marque un objet comme rendu */
    markReturned: (id: number, type: 'volume' | 'box') =>
        api.post('/loans/return', { 
            loanable_id: id, 
            loanable_type: type 
        }),

    /** Marque plusieurs objets comme rendus (transactionnel) */
    markManyReturned: (items: {id: number, type: 'volume' | 'box'}[]) =>
        api.post<ApiResponse<Loan[]>>('/loans/return/bulk', {
            items: items
        }).then(r => {
            try {
                return z.array(LoanSchema).parse(r.data.data);
            } catch (error) {
                console.error("Return bulk loan validation failed:", error);
                return r.data.data as unknown as Loan[];
            }
        }),
};
