import { Head, Link, router } from '@inertiajs/react';
import { Search as SearchIcon, FileText, FolderOpen, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { noteShow } from '@/lib/routes';

interface SearchIndexProps {
    results: Array<{
        id: number;
        title: string | null;
        folder: { id: number; name: string } | null;
        updated_at: string;
    }> | null;
    query: string;
    recentSearches: Array<{ id: number; query: string; created_at: string }>;
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID');
}

export default function SearchIndex({ results, query: initialQuery, recentSearches }: SearchIndexProps) {
    const [query, setQuery] = useState(initialQuery || '');

    const doSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.get('/search', { q: query }, { preserveState: true });
        }
    };

    const searchRecent = (q: string) => {
        setQuery(q);
        router.get('/search', { q }, { preserveState: true });
    };

    return (
        <>
            <Head title="Pencarian — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">

                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">🔍 Pencarian</h1>
                    <p className="mt-2 text-base font-bold text-gray-600">Cari catatan berdasarkan judul atau isi</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={doSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <SearchIcon size={20} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Ketik kata kunci..."
                            className="w-full rounded-xl border-4 border-gray-900 bg-white py-4 pl-12 pr-4 text-base font-bold text-gray-900 placeholder-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none transition-all focus:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1"
                        />
                        {query && (
                            <button type="button" onClick={() => { setQuery(''); router.get('/search'); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
                                <X size={18} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                    <button type="submit" className="rounded-xl border-4 border-gray-900 bg-blue-500 px-6 py-4 text-sm font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]">
                        Cari
                    </button>
                </form>

                {/* Results */}
                {results !== null ? (
                    <div>
                        <h2 className="text-lg font-black text-gray-900 mb-4">
                            {results.length > 0 ? `${results.length} hasil ditemukan` : 'Tidak ada hasil'}
                        </h2>
                        {results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <SearchIcon size={48} strokeWidth={2} className="mb-3 text-gray-300" />
                                <p className="font-bold">Tidak ditemukan catatan dengan kata kunci "{initialQuery}"</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {results.map(note => (
                                    <Link
                                        key={note.id}
                                        href={noteShow(note.id)}
                                        className="flex items-center gap-4 rounded-2xl border-4 border-gray-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] group"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-3 border-gray-900 bg-[#FDC700] shadow-md">
                                            <FileText size={20} strokeWidth={3} className="text-gray-900" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-black text-gray-900 truncate group-hover:underline">{note.title || 'Tanpa Judul'}</h3>
                                            <p className="text-xs font-bold text-gray-500 flex items-center gap-2 mt-1">
                                                {note.folder && (
                                                    <span className="flex items-center gap-1">
                                                        <FolderOpen size={10} strokeWidth={3} /> {note.folder.name}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} strokeWidth={3} /> {timeAgo(note.updated_at)}
                                                </span>
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Recent Searches */
                    recentSearches.length > 0 && (
                        <div>
                            <h2 className="text-lg font-black text-gray-900 mb-4">Pencarian Terakhir</h2>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => searchRecent(s.query)}
                                        className="rounded-lg border-3 border-gray-900 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-md transition-all hover:-translate-y-0.5 hover:bg-amber-50"
                                    >
                                        🔍 {s.query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

SearchIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Pencarian', href: '/search' },
    ],
};
