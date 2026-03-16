"use client";

import { GroupedSeries } from "@/types/manga";
import { User, Library } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SeriesListProps {
    seriesList: GroupedSeries[];
    baseUrl: string;
}

export function SeriesList({ seriesList, baseUrl }: SeriesListProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {seriesList.map(({ series, volumes }) => (
                <Link 
                    key={series.id} 
                    href={`${baseUrl}/series/${series.id}`} 
                    className="group relative block"
                >
                    <div className="relative aspect-[2/3] w-full bg-card rounded-2xl overflow-hidden manga-panel transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                        {series.cover_url ? (
                            <Image
                                src={series.cover_url}
                                alt={series.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-black uppercase tracking-widest text-center px-4 bg-secondary/10">
                                Pas de couverture
                            </div>
                        )}
                        
                        {/* Overlay Gradient - More subtle at bottom, focused on readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Status/Badge */}
                        <div className="absolute top-3 left-3 flex gap-2">
                             <div className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
                                {volumes.length} Tome{volumes.length > 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Top Right Action Icon */}
                        <div className="absolute top-3 right-3 p-2 bg-background/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Library className="h-4 w-4 text-white" />
                        </div>
                        
                        {/* Bottom Info on Image - Centered on experience */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="space-y-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-widest">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">
                                        {series.authors && series.authors.length > 0 ? series.authors[0] : "Auteur inconnu"}
                                    </span>
                                </div>
                                <h3 className="text-white font-display font-black text-lg md:text-xl leading-tight line-clamp-2 uppercase tracking-tight drop-shadow-2xl">
                                    {series.title}
                                </h3>
                                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
