import { Head, Link, useForm, router } from '@inertiajs/react';
import { Tag, Plus, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TagsIndexProps {
    tags: Array<{ id: number; name: string; color: string | null; notes_count: number }>;
}

const TAG_COLORS = ['#FDC700', '#60a5fa', '#4ade80', '#c084fc', '#f87171', '#fb923c', '#f472b6', '#2dd4bf'];

export default function TagsIndex({ tags }: TagsIndexProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({ name: '', color: '#FDC700' });
    const [editingId, setEditingId] = useState<number | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tags', { onSuccess: () => { reset(); setShowForm(false); } });
    };

    const deleteTag = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Hapus tag ini?')) {
            router.delete(`/tags/${id}`);
        }
    };

    return (
        <>
            <Head title="Tag — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">🏷️ Tag</h1>
                        <p className="mt-2 text-base font-bold text-gray-600">{tags.length} tag</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Plus size={20} strokeWidth={3} /> Buat Tag
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-2xl border-4 border-gray-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-black text-gray-900 mb-1">Nama Tag</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama tag baru..."
                                className="w-full rounded-xl border-4 border-gray-900 bg-amber-50 p-3 text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none focus:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 transition-all"
                            />
                            {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-900 mb-1">Warna</label>
                            <input type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="h-12 w-12 rounded-lg border-4 border-gray-900 cursor-pointer" />
                        </div>
                        <button type="submit" disabled={processing} className="rounded-xl border-4 border-gray-900 bg-green-400 px-6 py-3 text-sm font-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50">
                            Simpan
                        </button>
                    </form>
                )}

                {/* Tags Grid */}
                {tags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Tag size={64} strokeWidth={2} className="mb-4 text-gray-300" />
                        <p className="text-xl font-black">Belum ada tag</p>
                        <p className="mt-2 font-bold">Buat tag untuk mengkategorikan catatan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tags.map(tag => (
                            <Link
                                key={tag.id}
                                href={`/notes?tag_id=${tag.id}`}
                                className="group flex items-center justify-between rounded-2xl border-4 border-gray-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-gray-900 shadow-md" style={{ backgroundColor: tag.color || '#FDC700' }}>
                                        <Tag size={20} strokeWidth={3} className="text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 group-hover:underline">{tag.name}</h3>
                                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
                                            <FileText size={10} strokeWidth={3} /> {tag.notes_count} catatan
                                        </p>
                                    </div>
                                </div>
                                <button onClick={(e) => deleteTag(tag.id, e)} className="flex h-10 w-10 items-center justify-center rounded-lg border-3 border-gray-900 bg-white text-gray-900 shadow-md transition-all hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} strokeWidth={3} />
                                </button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Tag', href: '/tags' },
    ],
};
