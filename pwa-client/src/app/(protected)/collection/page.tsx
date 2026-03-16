"use client";

import { Button } from '@/components/ui/button';
import { LucideBook, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SeriesList } from '@/components/collection/SeriesList';
import { useGroupedCollection } from '@/hooks/useGroupedCollection';
import { useMangas } from '@/hooks/queries';

export default function CollectionPage() {
    const { data: mangas = [], isLoading } = useMangas();
    const [searchQuery, setSearchQuery] = useState("");

    const seriesList = useGroupedCollection(mangas, searchQuery);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="relative overflow-hidden rounded-3xl bg-card border-2 border-border p-8 shadow-xl">
                <div className="absolute inset-0 bg-manga-dots opacity-5"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                            <LucideBook className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight leading-none">Ma Collection</h1>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
                                {isLoading ? "Chargement..." : `${seriesList.length} séries • ${mangas.length} tomes`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Filtrer ma collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-background/50 border-2 border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all w-full md:w-80 font-medium"
                            />
                        </div>
                        <Button asChild className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase tracking-wider">
                            <Link href="/search">
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>


            {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[2/3] animate-pulse bg-slate-900 rounded-2xl border border-slate-800" />
                    ))}
                </div>
            ) : seriesList.length > 0 ? (
                <SeriesList seriesList={seriesList} baseUrl="/collection" />
            ) : (
        <div className="p-20 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
          <div className="bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
            <LucideBook className="h-10 w-10 text-slate-700" />
                    </div>
          <h3 className="text-xl font-bold mb-2">Aucune série trouvée</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        {searchQuery
                            ? "Aucun résultat ne correspond à votre recherche dans votre collection."
                            : "Votre collection est vide. Commencez par ajouter vos mangas préférés !"}
                    </p>
          <Button asChild className="bg-primary hover:bg-primary font-bold rounded-xl px-8">
                        <Link href="/search">Rechercher un manga</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
