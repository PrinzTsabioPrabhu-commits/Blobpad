import { Head, Link, router } from '@inertiajs/react';
import { FileText, FolderOpen, Plus, Clock, Search, Star, Filter, SortAsc } from 'lucide-react';
import { noteShow, noteCreate, notes } from '@/lib/routes';
import { dashboard } from '@/routes';

interface NotesIndexProps {
    notes: {
        data: Array<{
            id: number;
            title: string | null;
            folder: { id: number; name: string } | null;
            tags: Array<{ id: number; name: string; color: string | null }>;
            color: string | null;
            is_pinned: boolean;
            updated_at: string;
        }>;
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    folders: Array<{ id: number; name: string }>;
    tags: Array<{ id: number; name: string; color: string | null }>;
    filters: { folder_id?: number; tag_id?: number; sort?: string };
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

const CARD_COLORS = ['bg-[#FDC700]', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-red-400', 'bg-orange-400'];

export default function NotesIndex({ notes: notesPaginated, folders, tags, filters }: NotesIndexProps) {
    const applyFilter = (key: string, value: string) => {
        const params: any = { ...filters, [key]: value || undefined };
        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        router.get('/notes', params, { preserveState: true });
    };

    return (
        <>
            <Head title="Semua Catatan — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">📝 Semua Catatan</h1>
                        <p className="mt-2 text-base font-bold text-gray-600">{notesPaginated.data.length > 0 ? `${notesPaginated.data.length} catatan ditemukan` : 'Belum ada catatan'}</p>
                    </div>
                    <Link href={noteCreate()} className="inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]">
                        <Plus size={20} strokeWidth={3} /> Catatan Baru
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.folder_id || ''}
                        onChange={e => applyFilter('folder_id', e.target.value)}
                        className="rounded-xl border-4 border-gray-900 bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none"
                    >
                        <option value="">Semua Folder</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <select
                        value={filters.tag_id || ''}
                        onChange={e => applyFilter('tag_id', e.target.value)}
                        className="rounded-xl border-4 border-gray-900 bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none"
                    >
                        <option value="">Semua Tag</option>
                        {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select
                        value={filters.sort || 'updated_at'}
                        onChange={e => applyFilter('sort', e.target.value)}
                        className="rounded-xl border-4 border-gray-900 bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none"
                    >
                        <option value="updated_at">Terbaru</option>
                        <option value="title">Judul A-Z</option>
                    </select>
                </div>

                {/* Notes Grid */}
                {notesPaginated.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <FileText size={64} strokeWidth={2} className="mb-4 text-gray-300" />
                        <p className="text-xl font-black">Belum ada catatan</p>
                        <p className="mt-2 font-bold">Mulai buat catatan pertamamu!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {notesPaginated.data.map((note, i) => (
                            <Link
                                key={note.id}
                                href={noteShow(note.id)}
                                className="group flex flex-col rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                <div className={`border-b-4 border-gray-900 ${note.color || CARD_COLORS[i % CARD_COLORS.length]} px-5 py-3 flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        {note.is_pinned && <Star size={16} strokeWidth={3} className="text-gray-900" fill="currentColor" />}
                                        <FileText size={18} strokeWidth={3} className="text-gray-900" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{timeAgo(note.updated_at)}</span>
                                </div>
                                <div className="flex flex-col flex-1 p-5">
                                    <h3 className="text-lg font-black text-gray-900 truncate group-hover:underline">{note.title || 'Tanpa Judul'}</h3>
                                    {note.folder && (
                                        <p className="mt-2 text-xs font-bold text-gray-500 flex items-center gap-1">
                                            <FolderOpen size={12} strokeWidth={3} /> {note.folder.name}
                                        </p>
                                    )}
                                    {note.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {note.tags.map(tag => (
                                                <span key={tag.id} className="rounded-md border-2 border-gray-900 px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: tag.color || '#e5e7eb' }}>
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {notesPaginated.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {notesPaginated.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg border-3 border-gray-900 px-4 py-2 text-sm font-bold shadow-md transition-all ${link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'} ${!link.url ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

NotesIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Semua Catatan', href: '/notes' },
    ],
};
