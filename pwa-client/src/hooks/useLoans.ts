"use client";

import { useState, useCallback } from "react";
import { Loan } from "@/types/manga";
import { toast } from "sonner";
import { loanService } from "@/services/loan.service";

interface UseLoansReturn {
    loans: Loan[];
    isLoading: boolean;
    fetchLoans: () => Promise<void>;
    handleReturn: (id: number, type: 'volume' | 'box') => Promise<void>;
    handleBulkReturn: (items: {id: number, type: 'volume' | 'box'}[]) => Promise<void>;
}

export function useLoans(): UseLoansReturn {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLoans = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await loanService.getAll();
            setLoans(data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des prêts");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReturn = useCallback(async (id: number, type: 'volume' | 'box') => {
        try {
            await loanService.markReturned(id, type);
            toast.success("Marqué comme rendu");
            await fetchLoans();
        } catch (error) {
            toast.error("Erreur lors de la validation du rendu");
            console.error(error);
        }
    }, [fetchLoans]);

    const handleBulkReturn = useCallback(async (items: {id: number, type: 'volume' | 'box'}[]) => {
        if (items.length === 0) return;
        try {
            await loanService.markManyReturned(items);
            toast.success("Marqués comme rendus");
            await fetchLoans();
        } catch (error) {
            toast.error("Erreur lors de la validation du rendu");
            console.error(error);
        }
    }, [fetchLoans]);

    return { loans, isLoading, fetchLoans, handleReturn, handleBulkReturn };
}
