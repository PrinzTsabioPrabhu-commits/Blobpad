import { Head, Link, useForm, router } from '@inertiajs/react';
import { FolderOpen, Plus, FileText } from 'lucide-react';
import { folderShow } from '@/lib/routes';
import { useState } from 'react';

interface FoldersIndexProps {
    folders: Array<{
        id: number;
        name: string;
        color: string | null;
        notes_count: number;
        created_at: string;
    }>;
}

const FOLDER_COLORS = [
    'bg-[#FDC700]',
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-red-400',
    'bg-orange-400',
];
const FOLDER_EMOJIS = ['📁', '💼', '🏠', '🚀', '💡', '📚', '🎨', '🔬'];

export default function FoldersIndex({ folders }: FoldersIndexProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        color: '#FDC700',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/folders', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <>
            <Head title="Folder — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                            📂 Folder
                        </h1>
                        <p className="mt-2 text-base font-bold text-gray-600">
                            {folders.length} folder
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Plus size={20} strokeWidth={3} /> Buat Folder
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={submit}
                        className="flex flex-wrap items-end gap-3 rounded-2xl border-4 border-gray-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    >
                        <div className="min-w-[200px] flex-1">
                            <label className="mb-1 block text-xs font-black text-gray-900">
                                Nama Folder
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Nama folder baru..."
                                className="w-full rounded-xl border-4 border-gray-900 bg-amber-50 p-3 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-y-1 focus:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs font-bold text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-black text-gray-900">
                                Warna
                            </label>
                            <input
                                type="color"
                                value={data.color}
                                onChange={(e) =>
                                    setData('color', e.target.value)
                                }
                                className="h-12 w-12 cursor-pointer rounded-lg border-4 border-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl border-4 border-gray-900 bg-green-400 px-6 py-3 text-sm font-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </form>
                )}

                {folders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <FolderOpen
                            size={64}
                            strokeWidth={2}
                            className="mb-4 text-gray-300"
                        />
                        <p className="text-xl font-black">Belum ada folder</p>
                        <p className="mt-2 font-bold">
                            Buat folder pertamamu untuk mengatur catatan!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {folders.map((folder, i) => (
                            <Link
                                key={folder.id}
                                href={folderShow(folder.id)}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                            >
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-xl border-3 border-gray-900 shadow-md transition-transform group-hover:scale-110`}
                                    style={{
                                        backgroundColor:
                                            folder.color || undefined,
                                    }}
                                >
                                    <span className="text-3xl">
                                        {
                                            FOLDER_EMOJIS[
                                                i % FOLDER_EMOJIS.length
                                            ]
                                        }
                                    </span>
                                </div>
                                <span className="w-full truncate text-center text-sm font-black text-gray-900">
                                    {folder.name}
                                </span>
                                <span className="flex items-center gap-1 rounded-md border-2 border-gray-900 bg-amber-50 px-2 py-0.5 text-xs font-bold text-gray-700">
                                    <FileText size={10} strokeWidth={3} />{' '}
                                    {folder.notes_count} catatan
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

FoldersIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Folder', href: '/folders' },
    ],
};
