import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Star, Trash2, Pin, FolderOpen } from 'lucide-react';
import { notes, noteShow, favoriteToggle } from '@/lib/routes';

interface NoteShowProps {
    note: {
        id: number;
        title: string | null;
        content: any;
        folder_id: number | null;
        folder: { id: number; name: string } | null;
        tags: Array<{ id: number; name: string; color: string | null }>;
        color: string | null;
        is_pinned: boolean;
        is_archived: boolean;
        created_at: string;
        updated_at: string;
    };
    folders: Array<{ id: number; name: string }>;
    tags: Array<{ id: number; name: string }>;
    isFavorited: boolean;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function NoteShow({
    note,
    folders,
    tags,
    isFavorited,
}: NoteShowProps) {
    const contentText =
        typeof note.content === 'string'
            ? note.content
            : Array.isArray(note.content)
              ? JSON.stringify(note.content)
              : note.content
                ? JSON.stringify(note.content)
                : '';

    const { data, setData, put, processing } = useForm({
        title: note.title || '',
        content: contentText,
        folder_id: note.folder_id || ('' as string | number),
        is_pinned: note.is_pinned,
    });

    const save = (e?: React.FormEvent) => {
        e?.preventDefault();
        put(`/notes/${note.id}`, { preserveScroll: true });
    };

    const toggleFavorite = () => {
        router.post(favoriteToggle(note.id), {}, { preserveScroll: true });
    };

    const deleteNote = () => {
        if (confirm('Pindahkan catatan ini ke sampah?')) {
            router.delete(`/notes/${note.id}`);
        }
    };

    return (
        <>
            <Head title={`${note.title || 'Tanpa Judul'} — CatatIN`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={notes()}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <ArrowLeft size={20} strokeWidth={3} />
                        </Link>
                        <span className="text-sm font-bold text-gray-500">
                            Terakhir diubah: {formatDate(note.updated_at)}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleFavorite}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] ${isFavorited ? 'bg-yellow-400' : 'bg-white'}`}
                        >
                            <Star
                                size={20}
                                strokeWidth={3}
                                fill={isFavorited ? 'currentColor' : 'none'}
                            />
                        </button>
                        <button
                            onClick={() => {
                                setData('is_pinned', !data.is_pinned);
                            }}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] ${data.is_pinned ? 'bg-blue-400 text-white' : 'bg-white'}`}
                        >
                            <Pin size={20} strokeWidth={3} />
                        </button>
                        <button
                            onClick={deleteNote}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-4 border-gray-900 bg-red-500 text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Trash2 size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <form onSubmit={save} className="flex max-w-5xl flex-col gap-6">
                    <div className="overflow-hidden rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <div className="border-b-4 border-gray-900 bg-[#FDC700] px-6 py-4">
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Judul catatan..."
                                className="w-full bg-transparent text-2xl font-black text-gray-900 placeholder-gray-700 outline-none"
                            />
                        </div>

                        <div className="p-6">
                            <textarea
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                placeholder="Tulis isi catatan di sini..."
                                rows={16}
                                className="w-full resize-none bg-transparent text-base leading-relaxed font-medium text-gray-900 placeholder-gray-400 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-[200px] flex-1">
                            <label className="mb-1 block text-xs font-black text-gray-900">
                                Folder
                            </label>
                            <select
                                value={data.folder_id}
                                onChange={(e) =>
                                    setData('folder_id', e.target.value)
                                }
                                className="w-full rounded-xl border-4 border-gray-900 bg-white p-3 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none"
                            >
                                <option value="">Tanpa Folder</option>
                                {folders.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-lg border-3 border-gray-900 px-3 py-1 text-sm font-bold shadow-sm"
                                    style={{
                                        backgroundColor: tag.color || '#e5e7eb',
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-4 border-gray-900 bg-green-400 px-8 py-4 text-lg font-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                    >
                        <Save size={22} strokeWidth={3} />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </>
    );
}

NoteShow.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Semua Catatan', href: '/notes' },
        { title: 'Detail Catatan', href: '#' },
    ],
};
