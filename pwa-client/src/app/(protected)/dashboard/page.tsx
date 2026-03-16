"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
    LucideLayoutDashboard, 
    LucideBook, 
    LucideHeart, 
    LucideSettings, 
    Loader2, 
    Plus, 
    TrendingUp, 
    BarChart3, 
    Zap,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { MangaCard } from '@/components/manga/manga-card';
import { useMangas, useLoansQuery, useWishlist } from '@/hooks/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: mangas = [], isLoading: loadingMangas } = useMangas();
    const { data: loans = [], isLoading: loadingLoans } = useLoansQuery();
    const { data: wishlist = [], isLoading: loadingWishlist } = useWishlist();

    const isLoading = loadingMangas || loadingLoans || loadingWishlist;

    // Calculate stats
    const totalVolumes = mangas.length;
    const totalSeries = new Set(mangas.map(m => m.series?.id).filter(Boolean)).size;
    const activeLoans = loans.filter(l => !l.is_returned).length;
    const wishlistCount = wishlist.length;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-card border-2 border-border shadow-2xl">
                <div className="absolute inset-0 bg-manga-dots opacity-10"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                            <Zap className="h-3 w-3" />
                            <span>Tableau de bord</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight leading-none">
                            Salut, <span className="text-primary">{user?.name}</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl font-medium">
                            Ta bibliothèque s&apos;agrandit ! Voici un aperçu de ta collection et de tes lectures en cours.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button asChild className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase tracking-wider">
                                <Link href="/scan">Scanner un tome</Link>
                            </Button>
                            <Button asChild variant="outline" className="h-12 px-8 border-2 border-border bg-background/50 hover:bg-secondary/10 font-black rounded-xl transition-all active:scale-95 uppercase tracking-wider">
                                <Link href="/collection">Ma Collection</Link>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-auto grid grid-cols-2 gap-4">
                        <div className="p-6 bg-background/50 backdrop-blur-sm border border-border rounded-2xl flex flex-col items-center justify-center text-center manga-panel min-w-[140px]">
                            <span className="text-4xl font-display font-black text-primary leading-none">{totalVolumes}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Volumes</span>
                        </div>
                        <div className="p-6 bg-background/50 backdrop-blur-sm border border-border rounded-2xl flex flex-col items-center justify-center text-center manga-panel min-w-[140px]">
                            <span className="text-4xl font-display font-black text-foreground leading-none">{totalSeries}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Séries</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="manga-panel hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Collection</CardTitle>
                            <LucideBook className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-display font-black">{totalVolumes}</span>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">tomes possédés</span>
                        </div>
                        <div className="mt-4 h-1.5 w-full bg-secondary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="manga-panel hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Séries</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-display font-black">{totalSeries}</span>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">en cours</span>
                        </div>
                        <div className="mt-4 flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 5 ? 'bg-primary' : 'bg-secondary/20'}`}></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="manga-panel hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Prêts</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-display font-black">{activeLoans}</span>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">livre(s) sortis</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                            <BarChart3 className="h-3 w-3" />
                            <span>Suivi en temps réel</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="manga-panel hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Wishlist</CardTitle>
                            <LucideHeart className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-display font-black">{wishlistCount}</span>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">mangas surveillés</span>
                        </div>
                        <p className="mt-4 text-[10px] font-medium text-muted-foreground">Ne manque plus aucune sortie !</p>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Additions Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight">Dernières pépites</h3>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Les ajouts récents à ta collection</p>
                    </div>
                    <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-black uppercase text-xs tracking-widest">
                        <Link href="/collection">
                            Voir tout
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[2/3] animate-pulse bg-card rounded-xl border-2 border-border" />
                        ))}
                    </div>
                ) : mangas.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {mangas.slice(0, 6).map((manga) => (
                            <MangaCard key={manga.id} manga={manga} />
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center bg-card/50 border-2 border-dashed border-border rounded-3xl manga-panel">
                        <div className="p-4 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Plus className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="text-2xl font-display font-black uppercase mb-2">Ta collection attend patiemment...</h4>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Commence par ajouter ton premier manga ou scanne un code-barres pour remplir tes étagères !</p>
                        <Button asChild className="h-14 px-10 bg-primary hover:bg-primary/90 font-black rounded-xl shadow-xl shadow-primary/20 text-lg uppercase tracking-wider">
                            <Link href="/scan">Commencer le scan</Link>
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
