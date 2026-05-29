import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    FileText, FolderOpen, Star, Plus, Clock,
    PenTool, TrendingUp, Zap, Users, Target,
    CheckCircle2, AlertCircle, Share2, Download,
    ArrowRight
} from 'lucide-react';
import { dashboard } from '@/routes';
import { notes, noteCreate, noteShow } from '@/lib/routes';

// ============================================================
// TYPES
// ============================================================
interface DashboardProps {
    stats: { totalNotes: number; totalFolders: number; totalFavorites: number };
    recentNotes: Array<{
        id: number;
        title: string | null;
        folder: { id: number; name: string } | null;
        tags: Array<{ id: number; name: string; color: string | null }>;
        color: string | null;
        is_pinned: boolean;
        updated_at: string;
    }>;
    workspaceId: number;
}

// ============================================================
// HELPERS
// ============================================================
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

const NOTE_COLORS = ['bg-[#FDC700]', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-red-400'];

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ icon: Icon, label, value, color, bgColor }: {
    icon: any; label: string; value: number; color: string; bgColor: string;
}) {
    return (
        <div className="group rounded-2xl border-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl border-3 border-gray-900 ${bgColor} ${color} shadow-md`}>
                    <Icon size={28} strokeWidth={3} />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-4xl font-black text-gray-900">{value}</div>
                <div className="text-sm font-bold text-gray-600 mt-1">{label}</div>
            </div>
        </div>
    );
}

// ============================================================
// QUICK ACTIONS
// ============================================================
const QUICK_ACTIONS = [
    { type: 'link', icon: Plus, label: 'Catatan Baru', color: 'bg-blue-500', textColor: 'text-white', href: noteCreate() },
    { type: 'link', icon: FolderOpen, label: 'Buat Folder', color: 'bg-[#FDC700]', textColor: 'text-gray-900', href: '/folders' },
    { type: 'share', icon: Share2, label: 'Bagikan', color: 'bg-green-400', textColor: 'text-gray-900', href: '#' },
    { type: 'export', icon: Download, label: 'Ekspor', color: 'bg-purple-400', textColor: 'text-white', href: '/export' },
];

// ============================================================
// DASHBOARD PAGE
// ============================================================
export default function Dashboard({ stats, recentNotes, workspaceId }: DashboardProps) {
    const { auth } = usePage().props;
    const user = (auth as any)?.user;
    const firstName = user?.name?.split(' ')[0] || 'Pengguna';

    const { data, setData, post, processing, reset } = useForm({
        content: '',
        quick: true,
    });

    const submitQuickNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.content.trim()) return;
        post('/notes', {
            onSuccess: () => reset(),
        });
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.origin);
        alert('Tautan aplikasi berhasil disalin ke clipboard!');
    };

    return (
        <>
            <Head title="Dasbor — CatatIN" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto bg-[#FFFDF4] p-6 md:p-10">

                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {/* ─── HEADER SECTION ─── */}
                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col gap-6">
                    {/* Greeting */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                                Halo, {firstName}!
                            </h1>
                            <p className="mt-3 text-base md:text-lg font-bold text-gray-700">
                                Siap mencatat hal penting hari ini?
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {QUICK_ACTIONS.map((action, i) => {
                            const Icon = action.icon;
                            const className = `rounded-xl border-4 border-gray-900 ${action.color} px-4 py-3 flex items-center justify-center gap-2 text-sm font-bold ${action.textColor} shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]`;
                            
                            if (action.type === 'share') {
                                return (
                                    <button key={i} onClick={handleShare} className={className}>
                                        <Icon size={18} strokeWidth={3} />
                                        <span className="hidden sm:inline">{action.label}</span>
                                    </button>
                                );
                            }
                            if (action.type === 'export') {
                                return (
                                    <a key={i} href={action.href} download className={className}>
                                        <Icon size={18} strokeWidth={3} />
                                        <span className="hidden sm:inline">{action.label}</span>
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={className}
                                >
                                    <Icon size={18} strokeWidth={3} />
                                    <span className="hidden sm:inline">{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {/* ─── STATS SECTION ─── */}
                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <StatCard icon={FileText} label="Total Catatan" value={stats.totalNotes} color="text-gray-900" bgColor="bg-[#FDC700]" />
                    <StatCard icon={FolderOpen} label="Folder" value={stats.totalFolders} color="text-white" bgColor="bg-blue-500" />
                    <StatCard icon={Star} label="Favorit" value={stats.totalFavorites} color="text-gray-900" bgColor="bg-green-400" />
                </div>

                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {/* ─── MAIN CONTENT GRID ─── */}
                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* ─── RECENT NOTES PANEL ─── */}
                    <div className="lg:col-span-2 flex flex-col rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b-4 border-gray-900 bg-[#FDC700] rounded-t-xl px-6 py-4">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <Clock size={22} strokeWidth={3} />
                                Catatan Terbaru
                            </h2>
                            <Link
                                href={notes()}
                                className="text-sm font-bold text-gray-900 border-2 border-gray-900 rounded-lg px-3 py-1 transition-all hover:bg-gray-900 hover:text-yellow-400 hover:shadow-md"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        {/* Notes List */}
                        <div className="divide-y-3 divide-gray-900 max-h-96 overflow-y-auto">
                            {recentNotes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <FileText size={48} strokeWidth={2} className="mb-3 text-gray-300" />
                                    <p className="font-bold">Belum ada catatan</p>
                                    <p className="text-sm">Mulai buat catatan pertamamu!</p>
                                </div>
                            ) : (
                                recentNotes.map((note, i) => (
                                    <Link
                                        key={note.id}
                                        href={noteShow(note.id)}
                                        className="flex items-center gap-4 p-5 transition-all hover:bg-gray-50 cursor-pointer group border-l-4 border-l-transparent hover:border-l-gray-900"
                                    >
                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-3 border-gray-900 ${note.color || NOTE_COLORS[i % NOTE_COLORS.length]} shadow-md group-hover:shadow-lg transition-all`}>
                                            <FileText size={22} strokeWidth={3} className="text-gray-900" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-black text-gray-900 truncate group-hover:underline">
                                                {note.title || 'Tanpa Judul'}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-500 flex items-center gap-2 mt-1 flex-wrap">
                                                {note.folder && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded border-2 border-gray-900 bg-blue-100 text-gray-900 font-bold text-xs">
                                                        <FolderOpen size={12} strokeWidth={3} />
                                                        {note.folder.name}
                                                    </span>
                                                )}
                                                {note.tags.slice(0, 2).map(tag => (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex items-center px-2 py-1 rounded border-2 border-gray-900 font-bold text-xs"
                                                        style={{ backgroundColor: tag.color || '#e5e7eb' }}
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <Clock size={12} strokeWidth={3} />
                                                    {timeAgo(note.updated_at)}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="shrink-0 p-2 rounded-lg border-2 border-gray-900 bg-white text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 hover:text-white">
                                            <ArrowRight size={18} strokeWidth={3} />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ─── QUICK NOTE SIDEBAR ─── */}
                    <div className="flex flex-col gap-6">

                        {/* QUICK NOTE */}
                        <div className="flex flex-col rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <div className="flex items-center gap-2 border-b-4 border-gray-900 bg-blue-500 rounded-t-xl px-6 py-4">
                                <PenTool size={22} strokeWidth={3} className="text-white" />
                                <h2 className="text-lg font-black text-white">Catat Cepat</h2>
                            </div>
                            <form onSubmit={submitQuickNote} className="flex flex-col p-5 gap-4">
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Ada ide melintas? Tulis langsung di sini..."
                                    className="w-full rounded-xl border-4 border-gray-900 bg-[#FFFDF4] p-4 text-base font-medium text-gray-900 placeholder-gray-500 shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none transition-all focus:bg-white focus:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1"
                                    rows={5}
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="w-full rounded-xl border-4 border-gray-900 bg-green-400 py-3 text-base font-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Zap size={18} strokeWidth={3} />
                                        {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                    </span>
                                </button>
                            </form>
                        </div>

                        {/* PRODUCTIVITY STATS */}
                        <div className="flex flex-col rounded-2xl border-4 border-gray-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <div className="flex items-center gap-2 border-b-4 border-gray-900 bg-green-400 rounded-t-xl px-6 py-4">
                                <Target size={22} strokeWidth={3} className="text-gray-900" />
                                <h2 className="text-lg font-black text-gray-900">Ringkasan</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-900 bg-[#FFFDF4]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FDC700] border-2 border-gray-900">
                                        <FileText size={18} strokeWidth={3} className="text-gray-900" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-600">Total Catatan</p>
                                        <p className="text-2xl font-black text-gray-900">{stats.totalNotes}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-900 bg-[#FFFDF4]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 border-2 border-gray-900">
                                        <FolderOpen size={18} strokeWidth={3} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-600">Total Folder</p>
                                        <p className="text-2xl font-black text-gray-900">{stats.totalFolders}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-900 bg-[#FFFDF4]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400 border-2 border-gray-900">
                                        <Star size={18} strokeWidth={3} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-600">Total Favorit</p>
                                        <p className="text-2xl font-black text-gray-900">{stats.totalFavorites}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}
Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dasbor',
            href: dashboard(),
        },
    ],
};
