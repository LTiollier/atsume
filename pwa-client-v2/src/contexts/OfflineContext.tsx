"use client";

import React, { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface OfflineContextType {
    isOffline: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

// ID stable pour le toast offline — permet de le dismiss par référence et d'éviter
// les doublons si la connexion fluctue rapidement (Sonner déduplique par id).
const OFFLINE_TOAST_ID = "connection-offline";

export function OfflineProvider({ children }: { children: React.ReactNode }) {
    const isOnline = useOnlineStatus();
    const isOffline = !isOnline;
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isOnline) {
            // Dismiss explicite du toast offline avant d'afficher le toast online.
            // Sans ça, le toast duration:Infinity reste jusqu'à fermeture manuelle.
            toast.dismiss(OFFLINE_TOAST_ID);
            toast.success("Vous êtes de nouveau en ligne", {
                description: "Les fonctionnalités de modification sont activées.",
            });
        } else {
            // L'id déduplique : si la connexion flicker, le toast est remplacé sur
            // place plutôt qu'empilé — zéro spam.
            toast.error("Vous êtes hors ligne", {
                id: OFFLINE_TOAST_ID,
                description: "Les modifications sont désactivées jusqu'au retour de la connexion.",
                icon: <WifiOff className="h-4 w-4" />,
                duration: Infinity,
            });
        }
    }, [isOnline]);

    return (
        <OfflineContext.Provider value={{ isOffline }}>
            {children}
        </OfflineContext.Provider>
    );
}

export function useOffline() {
    const context = useContext(OfflineContext);
    if (context === undefined) {
        throw new Error("useOffline must be used within an OfflineProvider");
    }
    return context;
}
