import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { notes } from '@/lib/routes';

interface NoteCreateProps {
    folders: Array<{ id: number; name: string }>;
    tags: Array<{ id: number; name: string }>;
}

export default function NoteCreate({ folders, tags }: NoteCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        folder_id: '' as string | number,
        tags: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/notes');
    };

    const toggleTag = (tagId: number) => {
        setData('tags', data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId]
        );
    };

    return (
        <>
            <Head title="Buat Catatan — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-amber-50 to-yellow-50 p-6 md:p-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={notes()} className="flex h-12 w-12 items-center justify-center rounded-xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]">
                        <ArrowLeft size={22} strokeWidth={3} />
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">✏️ Buat Catatan Baru</h1>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6 max-w-4xl">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-black text-gray-900 mb-2">Judul</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Tulis judul catatan..."
                            className="w-full rounded-xl border-4 border-gray-900 bg-white p-4 text-lg font-bold text-gray-900 placeholder-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none transition-all focus:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1"
                        />
                        {errors.title && <p className="mt-1 text-sm font-bold text-red-500">{errors.title}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-black text-gray-900 mb-2">Isi Catatan</label>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Mulai menulis isi catatan di sini..."
                            rows={12}
                            className="w-full rounded-xl border-4 border-gray-900 bg-white p-4 text-base font-medium text-gray-900 placeholder-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none transition-all focus:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1"
                        />
                    </div>

                    {/* Folder */}
                    <div>
                        <label className="block text-sm font-black text-gray-900 mb-2">Folder (opsional)</label>
                        <select
                            value={data.folder_id}
                            onChange={e => setData('folder_id', e.target.value)}
                            className="w-full rounded-xl border-4 border-gray-900 bg-white p-4 text-base font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none"
                        >
                            <option value="">Tanpa Folder</option>
                            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div>
                            <label className="block text-sm font-black text-gray-900 mb-2">Tag (opsional)</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.id)}
                                        className={`rounded-lg border-3 border-gray-900 px-3 py-1.5 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 ${data.tags.includes(tag.id) ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-4 border-gray-900 bg-green-400 px-8 py-4 text-lg font-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                    >
                        <Save size={22} strokeWidth={3} />
                        {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                    </button>
                </form>
            </div>
        </>
    );
}

NoteCreate.layout = {
    breadcrumbs: [
        { title: 'Dasbor', href: '/dashboard' },
        { title: 'Semua Catatan', href: '/notes' },
        { title: 'Buat Catatan', href: '/notes/create' },
    ],
};
