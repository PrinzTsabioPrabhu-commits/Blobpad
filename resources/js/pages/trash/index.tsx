import { Head, router } from '@inertiajs/react';
import {
    Trash2,
    RotateCcw,
    AlertTriangle,
    FileText,
    FolderOpen,
} from 'lucide-react';
import { trashRestore, trashDestroy } from '@/lib/routes';

interface TrashIndexProps {
    notes: {
        data: Array<{
            id: number;
            title: string | null;
            deleted_at: string;
            folder: { id: number; name: string } | null;
        }>;
    };
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function TrashIndex({ notes: trashNotes }: TrashIndexProps) {
    const restoreNote = (id: number) => {
        router.post(trashRestore(id), {}, { preserveScroll: true });
    };

    const permanentDelete = (id: number) => {
        if (
            confirm('Hapus permanen? Catatan ini tidak bisa dikembalikan lagi.')
        ) {
            router.delete(trashDestroy(id), { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Sampah — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                        🗑️ Sampah
                    </h1>
                    <p className="mt-2 text-base font-bold text-gray-600">
                        {trashNotes.data.length} catatan di sampah
                    </p>
                </div>

                {trashNotes.data.length > 0 && (
                    <div className="flex items-center gap-3 rounded-2xl border-4 border-gray-900 bg-red-100 p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-3 border-gray-900 bg-red-500 text-white shadow-md">
                            <AlertTriangle size={20} strokeWidth={3} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                            Catatan di sampah bisa dipulihkan atau dihapus
                            secara permanen.
                        </p>
                    </div>
                )}

                {trashNotes.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Trash2
                            size={64}
                            strokeWidth={2}
                            className="mb-4 text-gray-300"
                        />
                        <p className="text-xl font-black">Sampah kosong</p>
                        <p className="mt-2 font-bold">
                            Tidak ada catatan yang dihapus
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {trashNotes.data.map((note) => (
                            <div
                                key={note.id}
                                className="flex items-center justify-between rounded-2xl border-4 border-gray-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-gray-900 bg-gray-200 shadow-md">
                                        <FileText
                                            size={20}
                                            strokeWidth={3}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900">
                                            {note.title || 'Tanpa Judul'}
                                        </h3>
                                        <p className="mt-1 flex items-center gap-2 text-xs font-bold text-gray-500">
                                            {note.folder && (
                                                <span className="flex items-center gap-1">
                                                    <FolderOpen
                                                        size={10}
                                                        strokeWidth={3}
                                                    />{' '}
                                                    {note.folder.name}
                                                </span>
                                            )}
                                            <span>
                                                Dihapus:{' '}
                                                {formatDate(note.deleted_at)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => restoreNote(note.id)}
                                        className="flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-green-400 px-4 py-2 text-sm font-bold text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <RotateCcw size={16} strokeWidth={3} />{' '}
                                        Pulihkan
                                    </button>
                                    <button
                                        onClick={() => permanentDelete(note.id)}
                                        className="flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Trash2 size={16} strokeWidth={3} />{' '}
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

TrashIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Sampah', href: '/trash' },
    ],
};
