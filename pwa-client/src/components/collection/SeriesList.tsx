"use client";

import { GroupedSeries } from "@/types/manga";
import { Layers, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SeriesListProps {
    seriesList: GroupedSeries[];
    baseUrl: string;
}

export function SeriesList({ seriesList, baseUrl }: SeriesListProps) {
    return (
    <div className="manga-grid">
            {seriesList.map(({ series, volumes }) => (
                <Link 
                    key={series.id} 
                    href={`${baseUrl}/series/${series.id}`} 
          className="manga-card group"
                >
          <div className="relative aspect-[2/3] w-full bg-slate-800/50">
                        {series.cover_url ? (
                            <Image
                                src={series.cover_url}
                                alt={series.title}
                                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
              <div className="flex items-center justify-center h-full text-slate-600 text-sm text-center px-4">
                                Pas de couverture
                            </div>
                        )}
                        
                        {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Badge Tome Count */}
            <div className="manga-badge shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            {volumes.length} Tome{volumes.length > 1 ? 's' : ''}
                        </div>
                        
                        {/* Bottom Info on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Voir détails
                            </p>
              <h3 className="text-white font-display font-black text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-md">
                                {series.title}
                            </h3>
                        </div>
                    </div>
                    
                    {/* Extra Info Panel below Image */}
          <div className="p-3 bg-card border-t border-border/50">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              <User className="h-3 w-3 text-primary" />
              <span className="truncate">
                                {series.authors && series.authors.length > 0 ? series.authors[0] : "Auteur inconnu"}
                            </span>
                        </div>
                        
            <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium">
              <Layers className="h-2.5 w-2.5" />
              <span className="truncate ">
                                {Array.from(new Set(volumes.map(v => v.edition?.name).filter(Boolean))).join(', ') || 'Édition Standard'}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
