"use client";

import { useMemo, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    Search,
    BookMarked,
    Loader2,
    ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useReadingProgressQuery, useBulkToggleReadingProgress, useMangas } from "@/hooks/queries";
import { Manga } from "@/types/manga";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type GroupedEdition = {
    edition: string;
    editionId: number | undefined;
    readCount: number;
    totalOwned: number;
    items: { manga: Manga; readAt: string }[];
};

type GroupedSeries = {
    series: string;
    totalRead: number;
    totalOwned: number;
    editions: GroupedEdition[];
};

export default function ReadingProgressPage() {
    const { data: readingProgress = [], isLoading: isLoadingProgress } = useReadingProgressQuery();
    const { data: mangas = [], isLoading: isLoadingMangas } = useMangas();
    const bulkToggle = useBulkToggleReadingProgress();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openEditions, setOpenEditions] = useState<Set<string>>(new Set());

    const isLoading = isLoadingProgress || isLoadingMangas;

    const progressByVolumeId = useMemo(() => {
        const map = new Map<number, string>();
        readingProgress.forEach(rp => map.set(rp.volume_id, rp.read_at));
        return map;
    }, [readingProgress]);

    const mangaById = useMemo(() => {
        const map = new Map<number, Manga>();
        mangas.forEach(m => map.set(m.id, m));
        return map;
    }, [mangas]);

    const readVolumes = useMemo(() => {
        return readingProgress
            .map(rp => {
                const manga = mangaById.get(rp.volume_id);
                if (!manga) return null;
                return { manga, readAt: rp.read_at };
            })
            .filter((item): item is { manga: Manga; readAt: string } => item !== null);
    }, [readingProgress, mangaById]);

    const groupBySeries = (items: { manga: Manga; readAt: string }[]): GroupedSeries[] => {
        const seriesMap: Record<string, GroupedSeries> = {};

        items.forEach(({ manga, readAt }) => {
            const seriesName = manga.series?.title || "Série inconnue";
            const editionName = manga.edition?.name || "Édition inconnue";
            const editionId = manga.edition?.id;
            const editionKey = `${seriesName}|${editionName}`;

            if (!seriesMap[seriesName]) {
                seriesMap[seriesName] = {
                    series: seriesName,
                    totalRead: 0,
                    totalOwned: 0,
                    editions: [],
                };
            }

            const series = seriesMap[seriesName];
            let edition = series.editions.find(e => e.edition === editionName);

            if (!edition) {
                const totalVolumes = manga.edition?.total_volumes ?? mangas.filter(
                    m => m.edition?.id === editionId
                ).length;
                edition = {
                    edition: editionName,
                    editionId,
                    readCount: 0,
                    totalOwned: totalVolumes,
                    items: [],
                };
                series.editions.push(edition);
                series.totalOwned += totalVolumes;
            }

            edition.readCount++;
            edition.items.push({ manga, readAt });
            series.totalRead++;
        });

        return Object.values(seriesMap).sort((a, b) => a.series.localeCompare(b.series));
    };

    const filteredVolumes = useMemo(() => {
        if (!searchQuery) return readVolumes;
        const q = searchQuery.toLowerCase();
        return readVolumes.filter(({ manga }) => {
            return (
                manga.series?.title?.toLowerCase().includes(q) ||
                manga.edition?.name?.toLowerCase().includes(q) ||
                manga.title?.toLowerCase().includes(q)
            );
        });
    }, [readVolumes, searchQuery]);

    const groupedSeries = useMemo(() => groupBySeries(filteredVolumes), [filteredVolumes]);

    // Stats
    const ownedVolumeIds = useMemo(() => new Set(mangas.filter(m => m.is_owned).map(m => m.id)), [mangas]);
    const totalRead = readingProgress.filter(rp => ownedVolumeIds.has(rp.volume_id)).length;
    const totalOwned = ownedVolumeIds.size;
    const allEditions = groupedSeries.flatMap(s => s.editions);
    const completedEditions = allEditions.filter(e => e.readCount >= e.totalOwned && e.totalOwned > 0);
    const completedSeries = groupedSeries.filter(s => s.editions.every(e => e.readCount >= e.totalOwned && e.totalOwned > 0));
    const inProgressSeries = groupedSeries.filter(s => !s.editions.every(e => e.readCount >= e.totalOwned && e.totalOwned > 0));

    const isItemSelected = (id: number) => selectedIds.includes(id);

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            isItemSelected(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleEdition = (key: string) => {
        setOpenEditions(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleBulkUnmark = async () => {
        if (selectedIds.length === 0) return;
        await bulkToggle.mutateAsync(selectedIds);
        setSelectedIds([]);
        setIsSelectionMode(false);
    };

    const renderSeriesList = (seriesList: GroupedSeries[]) => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded-xl bg-slate-900/50 animate-pulse border border-slate-800/50" />
                    ))}
                </div>
            );
        }

        if (seriesList.length === 0) {
            return (
                <EmptyState
                    title="Aucun tome lu"
                    description="Marquez des tomes comme lus depuis la page d'une édition."
                    icon={<BookOpen className="h-10 w-10 text-slate-800" />}
                />
            );
        }

        return (
            <div className="space-y-6">
                {seriesList.map(series => (
                    <div key={series.series} className="space-y-1">
                        {/* Series header */}
                        <div className="flex items-center gap-3 px-1 mb-3">
                            <BookMarked className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="text-sm font-black uppercase tracking-tight text-white">
                                {series.series}
                            </span>
                        </div>

                        {/* Editions */}
                        <div className="space-y-1 ml-7">
                            {series.editions.map(edition => {
                                const key = `${series.series}|${edition.edition}`;
                                const isOpen = openEditions.has(key);
                                const isComplete = edition.readCount >= edition.totalOwned && edition.totalOwned > 0;

                                return (
                                    <div key={key} className="rounded-xl border border-slate-800/50 overflow-hidden">
                                        {/* Edition row (clickable) */}
                                        <button
                                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/30 hover:bg-slate-900/60 transition-colors text-left"
                                            onClick={() => toggleEdition(key)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <ChevronDown
                                                    className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                                />
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                                                    {edition.edition}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isComplete && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                        Complet
                                                    </span>
                                                )}
                                                <span className="font-black text-sm text-emerald-400">
                                                    {edition.readCount}
                                                </span>
                                                <span className="text-slate-600 text-xs font-bold">/ {edition.totalOwned}</span>
                                                <div className="w-12 h-1 rounded-full bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all bg-emerald-500"
                                                        style={{ width: `${edition.totalOwned > 0 ? Math.min((edition.readCount / edition.totalOwned) * 100, 100) : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Volumes list (collapsible) */}
                                        {isOpen && (
                                            <div className="border-t border-slate-800/50 divide-y divide-slate-800/30">
                                                {edition.items
                                                    .sort((a, b) => parseInt(a.manga.number || '0') - parseInt(b.manga.number || '0'))
                                                    .map(({ manga, readAt }) => (
                                                        <div
                                                            key={manga.id}
                                                            onClick={() => isSelectionMode && toggleSelection(manga.id)}
                                                            className={`flex items-center justify-between px-4 py-3 transition-all ${
                                                                isItemSelected(manga.id)
                                                                    ? "bg-emerald-500/5"
                                                                    : "bg-slate-950/30 hover:bg-slate-900/40"
                                                            } ${isSelectionMode ? "cursor-pointer" : ""}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {isSelectionMode && (
                                                                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                                                                        isItemSelected(manga.id)
                                                                            ? "bg-emerald-500 border-emerald-500"
                                                                            : "border-slate-700"
                                                                    }`}>
                                                                        {isItemSelected(manga.id) && <CheckCircle2 className="h-full w-full text-white" />}
                                                                    </div>
                                                                )}
                                                                <div className="bg-slate-800/60 rounded-md px-2 py-0.5">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{manga.number}</span>
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-300">{manga.title}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <div className="hidden sm:flex flex-col items-end">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">Lu le</span>
                                                                    <span className="text-[10px] font-bold text-slate-500">
                                                                        {format(new Date(readAt), "dd MMM yyyy", { locale: fr })}
                                                                    </span>
                                                                </div>
                                                                {!isSelectionMode && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            bulkToggle.mutate([manga.id]);
                                                                        }}
                                                                        disabled={bulkToggle.isPending}
                                                                        className="h-7 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                                                    >
                                                                        Non lu
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                        Suivi de lecture
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Progression dans votre collection
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-9 h-10 bg-slate-900/50 border-slate-800 rounded-lg text-sm focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex flex-col gap-1">
                    <span className="text-2xl font-black text-emerald-400">{totalRead}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tomes lus</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex flex-col gap-1">
                    <span className="text-2xl font-black text-white">
                        {totalOwned > 0 ? Math.round((totalRead / totalOwned) * 100) : 0}%
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">De la collection</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex flex-col gap-1">
                    <span className="text-2xl font-black text-primary">{completedEditions.length}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Éditions complètes</span>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 rounded-2xl h-14 w-full sm:w-auto self-start">
                        <TabsTrigger
                            value="all"
                            className="rounded-xl px-6 font-black uppercase tracking-widest text-[11px] data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all h-full gap-3 group"
                        >
                            Tous
                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-500 group-data-[state=active]:bg-emerald-500/20 group-data-[state=active]:text-emerald-400 text-[10px] transition-colors">
                                {groupedSeries.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="in-progress"
                            className="rounded-xl px-6 font-black uppercase tracking-widest text-[11px] data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all h-full gap-3 group"
                        >
                            En cours
                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-500 group-data-[state=active]:bg-emerald-500/20 group-data-[state=active]:text-emerald-400 text-[10px] transition-colors">
                                {inProgressSeries.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="rounded-xl px-6 font-black uppercase tracking-widest text-[11px] data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all h-full gap-3 group"
                        >
                            Terminés
                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-500 group-data-[state=active]:bg-emerald-500/20 group-data-[state=active]:text-emerald-400 text-[10px] transition-colors">
                                {completedSeries.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {totalRead > 0 && (
                        <div className="flex items-center gap-2 bg-slate-900/30 p-1.5 rounded-xl border border-slate-800/50">
                            <button
                                className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isSelectionMode
                                        ? "bg-slate-800 text-white"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                                }`}
                                onClick={() => {
                                    setIsSelectionMode(!isSelectionMode);
                                    setSelectedIds([]);
                                }}
                            >
                                {isSelectionMode ? "Annuler" : "Multi-sélection"}
                            </button>
                            {isSelectionMode && selectedIds.length > 0 && (
                                <button
                                    className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all flex items-center gap-2"
                                    onClick={handleBulkUnmark}
                                    disabled={bulkToggle.isPending}
                                >
                                    {bulkToggle.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <BookOpen className="h-3 w-3" />}
                                    Marquer non lu ({selectedIds.length})
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <TabsContent value="all" className="outline-none">
                    {renderSeriesList(groupedSeries)}
                </TabsContent>
                <TabsContent value="in-progress" className="outline-none">
                    {renderSeriesList(inProgressSeries)}
                </TabsContent>
                <TabsContent value="completed" className="outline-none">
                    {renderSeriesList(completedSeries)}
                </TabsContent>
            </Tabs>
        </div>
    );
}
