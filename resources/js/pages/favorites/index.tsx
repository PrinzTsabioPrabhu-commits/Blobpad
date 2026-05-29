import { Head, Link, router } from '@inertiajs/react';
import { Star, FileText, FolderOpen, Clock } from 'lucide-react';
import { noteShow, favoriteToggle } from '@/lib/routes';

interface FavoritesIndexProps {
    notes: {
        data: Array<{
            id: number;
            title: string | null;
            folder: { id: number; name: string } | null;
            tags: Array<{ id: number; name: string; color: string | null }>;
            color: string | null;
            updated_at: string;
        }>;
    };
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

const COLORS = ['bg-[#FDC700]', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-red-400'];

export default function FavoritesIndex({ notes: notesPaginated }: FavoritesIndexProps) {
    const removeFavorite = (noteId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(favoriteToggle(noteId), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Favorit — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">

                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">⭐ Catatan Favorit</h1>
                    <p className="mt-2 text-base font-bold text-gray-600">{notesPaginated.data.length} catatan favorit</p>
                </div>

                {notesPaginated.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Star size={64} strokeWidth={2} className="mb-4 text-gray-300" />
                        <p className="text-xl font-black">Belum ada favorit</p>
                        <p className="mt-2 font-bold">Tandai catatan sebagai favorit untuk melihatnya di sini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {notesPaginated.data.map((note, i) => (
                            <Link
                                key={note.id}
                                href={noteShow(note.id)}
                                className="group relative flex flex-col rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                <div className={`border-b-4 border-gray-900 ${note.color || COLORS[i % COLORS.length]} px-5 py-3 flex items-center justify-between`}>
                                    <FileText size={18} strokeWidth={3} className="text-gray-900" />
                                    <button onClick={(e) => removeFavorite(note.id, e)} className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-gray-900 bg-white shadow-sm transition-all hover:bg-red-100 hover:scale-110">
                                        <Star size={14} strokeWidth={3} fill="currentColor" className="text-yellow-500" />
                                    </button>
                                </div>
                                <div className="p-5 flex-1">
                                    <h3 className="text-lg font-black text-gray-900 truncate group-hover:underline">{note.title || 'Tanpa Judul'}</h3>
                                    <div className="mt-2 flex items-center gap-2 text-xs font-bold text-gray-500">
                                        {note.folder && (
                                            <span className="flex items-center gap-1">
                                                <FolderOpen size={12} strokeWidth={3} /> {note.folder.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} strokeWidth={3} /> {timeAgo(note.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

FavoritesIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Favorit', href: '/favorites' },
    ],
};
