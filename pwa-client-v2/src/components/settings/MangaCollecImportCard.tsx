import { useState, useTransition } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useImportMangaCollec } from '@/hooks/queries';
import { getApiErrorMessage, getValidationErrors } from '@/lib/error';

export function MangaCollecImportCard() {
    const [url, setUrl] = useState('');
    const { mutateAsync: importCollection } = useImportMangaCollec();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleImport = () => {
        if (!url.trim()) return;

        setError(null);
        // rendering-usetransition-loading: Prefer useTransition for UI state updates tied to mutations
        startTransition(async () => {
            try {
                await importCollection(url.trim());
                setUrl('');
            } catch (err: unknown) {
                const validationErrors = getValidationErrors(err);
                if (validationErrors.url?.[0]) {
                    setError(validationErrors.url[0]);
                } else {
                    setError(getApiErrorMessage(err, 'Impossible d\'importer la collection. Vérifiez que le profil est public.'));
                }
            }
        });
    };

    return (
        <div
            className="rounded-[calc(var(--radius)*2)] overflow-hidden"
            style={{ background: 'var(--card)', border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}` }}
        >
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3 mb-3">
                    <Download size={16} aria-hidden style={{ color: 'var(--primary)', marginTop: 2 }} />
                    <div className="flex-1 min-w-0">
                        <label
                            htmlFor="mangacollec-url"
                            className="block text-sm font-semibold mb-0.5"
                            style={{ color: 'var(--foreground)' }}
                        >
                            Import MangaCollec
                        </label>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            Importez votre collection depuis MangaCollec. Les tomes déjà possédés seront ignorés.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        id="mangacollec-url"
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        disabled={isPending}
                        placeholder="https://www.mangacollec.com/user/pseudo/collection"
                        className="w-full h-10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)] disabled:opacity-50"
                        style={{
                            background: 'var(--input)',
                            color: 'var(--foreground)',
                            border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius)',
                            fontFamily: 'var(--font-mono)',
                        }}
                    />
                    {error && (
                        <p className="text-xs font-medium" style={{ color: 'var(--destructive)' }}>
                            {error}
                        </p>
                    )}
                </div>
            </div>

            <div className="px-5 py-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleImport}
                    disabled={isPending || !url.trim()}
                    className="h-9 px-5 text-sm font-semibold flex items-center gap-2 transition-opacity disabled:opacity-40 hover:opacity-90"
                    style={{
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        borderRadius: 'var(--radius)',
                    }}
                >
                    {isPending && <Loader2 size={14} className="animate-spin" aria-hidden />}
                    {isPending ? 'Importation en cours...' : 'Importer'}
                </button>
            </div>
        </div>
    );
}
