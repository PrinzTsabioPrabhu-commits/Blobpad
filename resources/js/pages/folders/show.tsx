import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, FolderOpen, Clock } from 'lucide-react';
import { noteShow, folders } from '@/lib/routes';

interface FolderShowProps {
    folder: { id: number; name: string; color: string | null };
    notes: {
        data: Array<{
            id: number;
            title: string | null;
            color: string | null;
            is_pinned: boolean;
            updated_at: string;
            tags: Array<{ id: number; name: string; color: string | null }>;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
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

const COLORS = [
    'bg-[#FDC700]',
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-red-400',
];

export default function FolderShow({
    folder,
    notes: notesPaginated,
}: FolderShowProps) {
    return (
        <>
            <Head title={`${folder.name} — CatatIN`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">
                <div className="flex items-center gap-4">
                    <Link
                        href={folders()}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <ArrowLeft size={22} strokeWidth={3} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">
                            📂 {folder.name}
                        </h1>
                        <p className="mt-1 text-sm font-bold text-gray-600">
                            {notesPaginated.data.length} catatan dalam folder
                            ini
                        </p>
                    </div>
                </div>

                {notesPaginated.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <FolderOpen
                            size={64}
                            strokeWidth={2}
                            className="mb-4 text-gray-300"
                        />
                        <p className="text-xl font-black">Folder kosong</p>
                        <p className="mt-2 font-bold">
                            Belum ada catatan di folder ini
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {notesPaginated.data.map((note, i) => (
                            <Link
                                key={note.id}
                                href={noteShow(note.id)}
                                className="group flex flex-col overflow-hidden rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                            >
                                <div
                                    className={`border-b-4 border-gray-900 ${note.color || COLORS[i % COLORS.length]} flex items-center justify-between px-5 py-3`}
                                >
                                    <FileText
                                        size={18}
                                        strokeWidth={3}
                                        className="text-gray-900"
                                    />
                                    <span className="text-xs font-bold text-gray-900">
                                        {timeAgo(note.updated_at)}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="truncate text-lg font-black text-gray-900 group-hover:underline">
                                        {note.title || 'Tanpa Judul'}
                                    </h3>
                                    {note.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {note.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="rounded-md border-2 border-gray-900 px-2 py-0.5 text-xs font-bold"
                                                    style={{
                                                        backgroundColor:
                                                            tag.color ||
                                                            '#e5e7eb',
                                                    }}
                                                >
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
            </div>
        </>
    );
}

FolderShow.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Folder', href: '/folders' },
        { title: 'Detail Folder', href: '#' },
    ],
};
