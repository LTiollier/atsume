"use client";

import { Manga } from "@/types/manga";
import Image from "next/image";
import { ArrowLeftRight, Check, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VolumeUI {
    id?: number;
    number: number;
    isPossessed: boolean;
    cover_url: string | null;
    manga: Manga | null;
}

interface VolumeListProps {
    volumesUI: VolumeUI[];
    isReadOnly?: boolean;
    selectedMissing?: number[];
    selectedMangaForLoan?: Manga[];
    onVolumeClick?: (vol: VolumeUI) => void;
    onLoanClick?: (vol: VolumeUI) => void;
}

export function VolumeGrid({
    volumesUI,
    isReadOnly = false,
    selectedMissing = [],
    selectedMangaForLoan = [],
    onVolumeClick,
    onLoanClick
}: VolumeListProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {volumesUI.map((vol) => {
                const isSelected = selectedMissing.includes(vol.number);
                const isLoanSelected = selectedMangaForLoan.some(m => m.id === vol.manga?.id);

                return (
                    <div
                        key={vol.number}
                        onClick={() => !isReadOnly && onVolumeClick?.(vol)}
                        className={cn(
                            "relative aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-500 manga-panel group",
                            !isReadOnly && "cursor-pointer hover:scale-[1.02] hover:-translate-y-1",
                            vol.isPossessed 
                                ? (isLoanSelected ? 'ring-4 ring-blue-500' : 'ring-2 ring-primary border-none') 
                                : (!isReadOnly ? 'border-2 border-dashed border-border/50 bg-secondary/5 opacity-60' : ''),
                            isSelected && !vol.isPossessed && 'ring-4 ring-blue-500 opacity-100'
                        )}
                    >
                        {vol.cover_url ? (
                            <Image 
                                src={vol.cover_url} 
                                alt={`Volume ${vol.number}`} 
                                fill 
                                className={cn(
                                    "object-cover transition-transform duration-700 group-hover:scale-110",
                                    !vol.isPossessed && "grayscale opacity-20"
                                )} 
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-muted-foreground text-xs font-black uppercase tracking-widest">
                                T{vol.number}
                            </div>
                        )}

                        <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded font-display font-black text-xs uppercase tracking-tighter shadow-lg">
                                #{vol.number}
                            </span>
                        </div>

                        {/* Missing volume placeholder/selection indicator */}
                        {!vol.isPossessed && !isReadOnly && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {isSelected ? (
                                    <div className="bg-blue-600 text-white rounded-full p-2 shadow-xl animate-in zoom-in">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                ) : (
                                    <div className="bg-background/40 backdrop-blur-sm text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                                        <Circle className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Loan button for possessed but not loaned manga */}
                        {vol.isPossessed && !vol.manga?.is_loaned && !isReadOnly && (
                            <div
                                className={cn(
                                    "absolute bottom-3 left-3 h-10 w-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border-2",
                                    isLoanSelected 
                                        ? "bg-blue-600 text-white border-white scale-110" 
                                        : "bg-background/90 text-primary border-primary/20 hover:bg-blue-600 hover:text-white hover:border-white"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLoanClick?.(vol);
                                }}
                            >
                                <ArrowLeftRight className="h-4 w-4" />
                            </div>
                        )}

                        {/* Status icon (possessed or loaned) */}
                        {vol.isPossessed && (
                            <div className={cn(
                                "absolute bottom-3 right-3 h-8 w-8 flex items-center justify-center text-white rounded-full shadow-xl border-2 border-background",
                                vol.manga?.is_loaned ? "bg-orange-500" : "bg-primary"
                            )}>
                                {vol.manga?.is_loaned ? <ArrowLeftRight className="h-3.5 w-3.5" /> : isLoanSelected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 opacity-0" />}
                            </div>
                        )}

                        {/* Loan overlay */}
                        {vol.manga?.is_loaned && (
                            <div className="absolute inset-0 bg-orange-500/10 backdrop-blur-[1px] flex items-center justify-center p-4">
                                <div className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20 text-center leading-tight">
                                    Prêté {vol.manga.loaned_to ? `à  ${vol.manga.loaned_to}` : ''}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
