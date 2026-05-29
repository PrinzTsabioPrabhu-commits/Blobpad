import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { dashboard, login, register } from '@/routes';
import {
    Layers, Search, RefreshCw, Users, Bell, Download,
    Menu, X, ArrowRight, Star, Check
} from 'lucide-react';

// Intersection Observer for scroll animations
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}

// ============================================================
// NAVIGATION
// ============================================================
const NAV_ITEMS = [
    { label: 'Fitur', href: '#fitur', hoverBg: 'hover:bg-yellow-400', hoverText: 'hover:text-gray-900', hoverShadow: 'hover:shadow-md' },
    { label: 'Cara Kerja', href: '#cara-kerja', hoverBg: 'hover:bg-blue-400', hoverText: 'hover:text-white', hoverShadow: 'hover:shadow-lg' },
    { label: 'Testimoni', href: '#testimoni', hoverBg: 'hover:bg-green-400', hoverText: 'hover:text-gray-900', hoverShadow: 'hover:shadow-lg' },
    { label: 'FAQ', href: '#faq', hoverBg: 'hover:bg-purple-400', hoverText: 'hover:text-white', hoverShadow: 'hover:shadow-md' },
];

function Navbar() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-amber-50 transition-all duration-300 ${scrolled ? 'border-b-4 border-gray-900 shadow-xl' : 'border-b-4 border-gray-900'}`}>
            <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border-3 sm:border-4 border-gray-900 bg-yellow-400 shadow-md transition-transform hover:scale-110">
                        <span className="text-xs sm:text-base font-bold text-gray-900">C</span>
                    </div>
                    <span className="text-base sm:text-lg font-black text-gray-900 hidden sm:inline">CatatIN</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                    {NAV_ITEMS.map((item) => (
                        <a key={item.label} href={item.href}
                            className={`px-4 py-2 text-sm font-bold text-gray-700 rounded-lg border-2 border-transparent transition-all duration-300 ${item.hoverBg} ${item.hoverText} ${item.hoverShadow} hover:border-gray-900 hover:scale-105 hover:translate-y-[-2px]`}>
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Tablet links */}
                <div className="hidden md:flex lg:hidden items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <a key={item.label} href={item.href}
                            className={`px-3 py-1.5 text-xs font-bold text-gray-700 rounded border-2 border-transparent transition-all duration-300 ${item.hoverBg} ${item.hoverText} hover:border-gray-900 hover:scale-110`}>
                            {item.label.split(' ')[0]}
                        </a>
                    ))}
                </div>

                {/* Desktop auth */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    {auth.user ? (
                        <Link href={dashboard()} className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gray-900 border-2 sm:border-3 border-gray-900 rounded-lg shadow-md transition-all hover:bg-gray-800 hover:shadow-lg hover:translate-y-[-2px]">
                            Dasbor
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-gray-900 bg-white border-2 sm:border-3 border-gray-900 rounded-lg shadow-md transition-all hover:bg-yellow-50 hover:shadow-lg hover:translate-y-[-2px]">
                                Masuk
                            </Link>
                            <Link href={register()} className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-500 border-2 sm:border-3 border-blue-700 rounded-lg shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:translate-y-[-2px]">
                                Gratis
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setOpen(!open)} className="md:hidden rounded-lg border-2 border-gray-900 bg-white p-1.5 shadow-md hover:bg-gray-50 transition-all hover:scale-110">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t-4 border-gray-900 bg-amber-50 px-4 py-4 space-y-3">
                    {NAV_ITEMS.map((item) => (
                        <a key={item.label} href={item.href}
                            onClick={() => setOpen(false)}
                            className={`block px-4 py-3 text-sm font-bold text-gray-900 rounded-lg border-2 border-transparent transition-all ${item.hoverBg} ${item.hoverText} hover:border-gray-900 active:scale-95`}>
                            {item.label}
                        </a>
                    ))}
                    <div className="border-t-2 border-gray-900 pt-4 mt-4 flex flex-col gap-2">
                        {auth.user ? (
                            <Link href={dashboard()} onClick={() => setOpen(false)}
                                className="px-4 py-3 text-sm font-bold text-white bg-gray-900 border-2 border-gray-900 rounded-lg text-center shadow-md transition-all">
                                Dasbor
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-sm font-bold text-gray-900 bg-white border-2 border-gray-900 rounded-lg text-center shadow-md transition-all">
                                    Masuk
                                </Link>
                                <Link href={register()} onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-sm font-bold text-white bg-blue-500 border-2 border-blue-700 rounded-lg text-center shadow-md transition-all">
                                    Mulai Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
    return (
        <section className="bg-amber-50 px-6 pt-32 pb-20">
            <div className="mx-auto max-w-4xl text-center">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border-3 border-gray-900 bg-blue-400 px-5 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition-transform cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
                    KOSONGKAN PIKIRAN, BIAR KAMI YANG SIMPAN 
                </div>

                {/* Heading */}
                <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                    JANGAN LUPA{' '}
                    <span className="rounded-2xl border-4 border-gray-900 bg-yellow-400 px-4 py-2 inline-block shadow-lg hover:rotate-2 transition-transform">
                        DICATAT
                    </span>
                    <br />
                    BIAR NANTI{' '}
                    <span className="rounded-2xl border-4 border-gray-900 bg-yellow-400 px-4 py-2 inline-block shadow-lg hover:-rotate-2 transition-transform">
                        INGAT
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-gray-700 md:text-xl">
                    Berhenti membebani otakmu! CatatIN siap menampung coretan abstrakmu menjadi arsip yang rapi, secepat kilat, dan bikin tugas jadi lebih gampang.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href={register()} className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-600 hover:translate-y-[-2px] transition-all">
                        MULAI SEKARANG →
                    </Link>
                    <a href="#FEATURES" className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-lg hover:bg-gray-50 hover:translate-y-[-2px] transition-all">
                        LIHAT DEMO
                    </a>
                </div>

                {/* Social proof */}
                <div className="mt-12 flex items-center justify-center gap-3">
                    <div className="flex -space-x-2">
                        {['😀', '🌟', '🎉', '💡', '🚀', '🎨'].map((emoji, i) => (
                            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-2 ring-white" style={{ zIndex: 6 - i }}>
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">
                        Dipercaya oleh <span className="font-semibold text-gray-900">5+</span> pencatat
                    </p>
                </div>

                {/* Hero mockup */}
                <div className="relative mx-auto mt-16 max-w-4xl">
                    <div className="overflow-hidden rounded-2xl border-4 border-gray-900 bg-white shadow-2xl">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 border-b-4 border-gray-900 bg-yellow-400 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full border-2 border-gray-900 bg-red-500" />
                                <div className="h-3 w-3 rounded-full border-2 border-gray-900 bg-yellow-300" />
                                <div className="h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500" />
                            </div>
                            <div className="ml-4 flex-1 rounded-lg border-2 border-gray-900 bg-white px-3 py-1.5 text-xs font-bold text-gray-900">
                                catatin.app
                            </div>
                        </div>

                        {/* App preview */}
                        <div className="grid grid-cols-4 gap-4 bg-amber-50 p-6">
                            {/* Sidebar */}
                            <div className="space-y-3">
                                <div className="text-xs font-black uppercase tracking-wider text-gray-900">Folder</div>
                                {[
                                    { name: 'Kerja', color: 'bg-yellow-400 text-gray-900 border-yellow-600' },
                                    { name: 'Pribadi', color: 'bg-blue-400 text-white border-blue-600' },
                                    { name: 'Ide', color: 'bg-red-400 text-white border-red-600' },
                                ].map((f, i) => (
                                    <div key={i} className={`rounded-lg border-3 ${f.color} px-3 py-2.5 text-sm font-bold shadow-md`}>
                                        {f.name}
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            <div className="col-span-3 space-y-3">
                                <div className="rounded-xl border-4 border-gray-900 bg-yellow-300 p-4 shadow-lg">
                                    <div className="mb-1.5 text-sm font-black text-gray-900">Catatan Rapat</div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                        <span className="rounded-md border-2 border-gray-900 bg-yellow-400 px-2 py-0.5 text-xs font-black text-gray-900">#kerja</span>
                                        Perencanaan RAPAT Sekolah IDN, target tim...
                                    </div>
                                </div>
                                <div className="rounded-xl border-4 border-gray-900 bg-blue-300 p-4 shadow-lg">
                                    <div className="mb-1.5 text-sm font-black text-gray-900">Ide Proyek</div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                        <span className="rounded-md border-2 border-gray-900 bg-blue-400 px-2 py-0.5 text-xs font-black text-white">#ide</span>
                                        Fitur baru untuk dibuat...
                                    </div>
                                </div>
                                <div className="rounded-xl border-4 border-gray-900 bg-red-300 p-4 shadow-lg">
                                    <div className="mb-1.5 text-sm font-black text-gray-900">Daftar Belanja</div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                        <span className="rounded-md border-2 border-gray-900 bg-red-400 px-2 py-0.5 text-xs font-black text-white">#pribadi</span>
                                        Susu, telur, roti masuk semua...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating accent */}
                    <div className="absolute -top-3 -right-3 rounded-xl border-3 border-gray-900 bg-green-400 px-4 py-2 text-sm font-black text-gray-900 shadow-lg">
                        Secepat kilat
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// FEATURES SECTION
// ============================================================
const FEATURES = [
    { icon: Layers, title: 'Terorganisir', desc: 'Folder, tag, dan workspace menjaga semuanya tetap rapi di tempatnya.', bgColor: 'bg-yellow-400', textColor: 'text-gray-900', borderColor: 'border-yellow-600' },
    { icon: Search, title: 'Pencarian Cepat', desc: 'Temukan catatan apa pun secara instan dengan pencarian teks lengkap yang powerful.', bgColor: 'bg-blue-400', textColor: 'text-white', borderColor: 'border-blue-600' },
    { icon: RefreshCw, title: 'Sinkronisasi Otomatis', desc: 'Catatan Anda tersinkronisasi di semua perangkat secara otomatis dan real-time.', bgColor: 'bg-green-400', textColor: 'text-gray-900', borderColor: 'border-green-600' },
    { icon: Users, title: 'Kolaborasi', desc: 'Bagikan catatan dan bekerja bersama tim Anda secara real-time.', bgColor: 'bg-red-400', textColor: 'text-white', borderColor: 'border-red-600' },
    { icon: Bell, title: 'Pengingat', desc: 'Jangan pernah lupa dengan pengingat pintar yang terpasang pada catatan Anda.', bgColor: 'bg-purple-400', textColor: 'text-white', borderColor: 'border-purple-600' },
    { icon: Download, title: 'Ekspor', desc: 'Ekspor ke PDF, Markdown, atau teks biasa kapan pun Anda butuhkan.', bgColor: 'bg-orange-400', textColor: 'text-white', borderColor: 'border-orange-600' },
];

function FeaturesSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section id="fitur" className="bg-yellow-50 px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-yellow-400 px-5 py-2 text-sm font-black text-gray-900 shadow-md">
                        Fitur
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Semua yang Anda butuhkan
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
                        Fitur Kereeennn! dalam antarmuka yang sederhana dan indah.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className={`card-minimal group rounded-2xl border-4 border-gray-900 bg-white p-8 shadow-lg transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}>
                                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl border-3 border-gray-900 ${feature.bgColor} ${feature.textColor} shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <Icon size={28} strokeWidth={3} />
                                </div>
                                <h3 className="mb-2 text-lg font-black text-gray-900">{feature.title}</h3>
                                <p className="text-sm font-medium leading-relaxed text-gray-700">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// HOW IT WORKS SECTION
// ============================================================
const STEPS = [
    { num: '01', title: 'Buat catatan pertama Anda', desc: 'Buka CatatIN dan mulai mengetik. Tidak perlu mendaftar untuk mencoba — langsung saja dan catat pikiran Anda secara instan.', bgColor: 'bg-yellow-400', textColor: 'text-gray-900', borderColor: 'border-yellow-600', icon: '✍️' },
    { num: '02', title: 'Organisir dengan mudah', desc: 'Seret catatan ke folder, tambahkan tag berwarna, dan gunakan workspace untuk memisahkan kehidupan pribadi dan pekerjaan dengan sempurna.', bgColor: 'bg-blue-400', textColor: 'text-white', borderColor: 'border-blue-600', icon: '📁' },
    { num: '03', title: 'Akses di mana saja', desc: 'Catatan Anda tersinkronisasi ke cloud secara otomatis. Buka di perangkat apa pun, bagikan dengan siapa pun, dan jangan pernah kehilangan satu pikiran pun.', bgColor: 'bg-green-400', textColor: 'text-gray-900', borderColor: 'border-green-600', icon: '🌐' },
];

function HowItWorksSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section id="cara-kerja" className="bg-white px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-blue-400 px-5 py-2 text-sm font-black text-white shadow-md">
                        Cara kerja
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Tiga langkah sederhana
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
                        Memulai itu mudah. Anda akan menjadi ahli mencatat dalam waktu kurang dari satu menit.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <div
                            key={i}
                            className={`relative text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${i * 150}ms` }}>
                            {/* Step icon */}
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-gray-900 bg-white text-4xl shadow-lg">
                                {step.icon}
                            </div>

                            {/* Step number */}
                            <span className={`mb-3 inline-block rounded-lg border-3 border-gray-900 ${step.bgColor} ${step.textColor} px-4 py-1.5 text-sm font-black shadow-md`}>
                                {step.num}
                            </span>

                            <h3 className="mb-3 text-xl font-black text-gray-900">{step.title}</h3>
                            <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-gray-700">{step.desc}</p>

                            {/* Connector */}
                            {i < 2 && (
                                <div className="absolute -right-4 top-28 hidden text-gray-900 md:block">
                                    <ArrowRight size={32} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================
const TESTIMONIALS = [
    { name: 'Sarah K.', role: 'Product Manager di TechCo', text: 'CatatIN benar-benar mengubah cara saya mengelola tugas harian. Tag berwarna membuat semuanya jauh lebih menyenangkan!', rating: 5, bgColor: 'bg-yellow-400', textColor: 'text-gray-900' },
    { name: 'Marcus T.', role: 'Freelance Designer', text: 'Saya sudah mencoba semua aplikasi catatan di luar sana. CatatIN adalah yang pertama yang benar-benar membuat pengorganisasian terasa mudah.', rating: 5, bgColor: 'bg-blue-400', textColor: 'text-white' },
    { name: 'Priya M.', role: 'Mahasiswa & Peneliti', text: 'Dari catatan kelas hingga draft penelitian, CatatIN menangani semuanya dengan indah. Fitur AI-nya luar biasa!', rating: 5, bgColor: 'bg-green-400', textColor: 'text-gray-900' },
];

function TestimonialsSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section id="testimoni" className="bg-amber-50 px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-green-400 px-5 py-2 text-sm font-black text-gray-900 shadow-md">
                        Testimoni
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Dicintai oleh banyak pengguna
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
                        Inilah yang dikatakan pengguna nyata tentang CatatIN.
                    </p>
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className={`card-minimal rounded-2xl border-4 border-gray-900 bg-white p-6 shadow-lg transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${i * 150}ms` }}>
                            <div className="mb-3 flex gap-1">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                ))}
                            </div>
                            <p className="mb-4 text-sm font-medium leading-relaxed text-gray-700">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-3 border-gray-900 ${t.bgColor} ${t.textColor} text-lg font-black shadow-md`}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-black text-gray-900">{t.name}</div>
                                    <div className="text-xs font-medium text-gray-600">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Brand logos */}
                <div className={`mt-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
                    <p className="mb-6 text-center text-sm font-bold text-gray-700">
                        Dipercaya oleh tim di
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Netflix'].map((brand, i) => (
                         <div key={i} className="text-base font-black text-gray-400 transition-colors hover:text-blue-500">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// FAQ SECTION
// ============================================================
const FAQS = [
    {
        question: 'Apakah CatatIN benar-benar gratis?',
        answer: 'Ya! CatatIN sepenuhnya gratis untuk digunakan. Anda bisa membuat catatan tak terbatas, membuat folder, dan menggunakan semua fitur dasar tanpa biaya selamanya. Tidak ada biaya tersembunyi atau batasan waktu uji coba.',
        bgColor: 'bg-yellow-400',
    },
    {
        question: 'Bagaimana cara mengakses catatan saya dari berbagai perangkat?',
        answer: 'Semua catatan Anda disinkronisasi otomatis ke cloud. Cukup login ke akun Anda dari perangkat apa pun (ponsel, tablet, atau komputer) dan catatan Anda akan selalu tersedia. Sinkronisasi terjadi secara real-time tanpa perlu tindakan manual.',
        bgColor: 'bg-blue-400',
    },
    {
        question: 'Apakah data saya aman?',
        answer: 'Keamanan data Anda adalah prioritas utama kami. Semua catatan dienkripsi saat transit dan saat disimpan di server. Kami juga menggunakan standar keamanan industri terbaik dan tidak pernah membagikan data Anda kepada pihak ketiga.',
        bgColor: 'bg-green-400',
    },
    {
        question: 'Bisakah saya berbagi catatan dengan orang lain?',
        answer: 'Tentu saja! Anda bisa membagikan catatan individual atau seluruh folder dengan teman, keluarga, atau rekan kerja. Mereka bisa melihat, mengedit, atau hanya membaca, tergantung izin yang Anda berikan. Kolaborasi real-time juga didukung untuk bekerja bersama.',
        bgColor: 'bg-purple-400',
    },
    {
        question: 'Apakah ada batasan jumlah catatan atau folder?',
        answer: 'Tidak ada batasan! Anda bisa membuat catatan dan folder sebanyak yang Anda mau. CatatIN dirancang untuk tumbuh bersama dengan kebutuhan Anda, dari catatan pribadi sederhana hingga sistem organisasi yang kompleks.',
        bgColor: 'bg-red-400',
    },
    {
        question: 'Bagaimana jika saya ingin menghapus akun saya?',
        answer: 'Anda bisa menghapus akun kapan saja dari pengaturan. Semua data Anda akan dihapus secara permanen dalam 30 hari. Kami juga menyediakan opsi untuk mengekspor semua catatan Anda sebelum menghapus akun.',
        bgColor: 'bg-orange-400',
    },
];

function FaqSection() {
    const { ref, visible } = useReveal(0.1);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="bg-white px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-purple-400 px-5 py-2 text-sm font-black text-white shadow-md">
                        Pertanyaan Umum
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Semua yang Perlu Anda Ketahui
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
                        Temukan jawaban atas pertanyaan yang sering diajukan tentang CatatIN.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className={`rounded-xl border-3 border-gray-900 overflow-hidden shadow-lg transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${i * 75}ms` }}>
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className={`w-full px-6 py-4 text-left font-black text-white transition-all flex items-center justify-between hover:translate-y-[-2px] ${faq.bgColor}`}>
                                <span className="pr-4">{faq.question}</span>
                                <span className={`flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {openIndex === i && (
                                <div className="bg-gray-50 border-t-3 border-gray-900 px-6 py-4 animate-in fade-in duration-300">
                                    <p className="text-base font-medium leading-relaxed text-gray-700">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional help */}
                <div className={`mt-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
                    <p className="text-lg font-medium text-gray-700 mb-4">
                        Masih ada pertanyaan?
                    </p>
                    <a href="mailto:support@catatin.app" className="inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-purple-400 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl">
                        Hubungi Kami
                        <ArrowRight size={18} strokeWidth={3} />
                    </a>
                </div>          
            </div>
        </section>
    );
}

function CtaSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section className="bg-yellow-50 px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-3xl text-center">
                <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Siap untuk memulai?
                    </h2>
                    <p className="mb-8 text-lg font-medium text-gray-700">
                        Bergabunglah dengan banyak pencatat yang bahagia. Mulai gratis — tanpa basa basi.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href={register()} className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-600 hover:translate-y-[-2px] transition-all">
                            Mulai Gratis
                            <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                        <a href="#faq" className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-purple-400 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-purple-500 hover:translate-y-[-2px] transition-all">
                            Lihat FAQ
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
    return (
        <footer className="border-t-4 border-gray-900 bg-amber-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="mb-4 inline-flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-3 border-gray-900 bg-yellow-400 shadow-md">
                                <span className="text-sm font-black text-gray-900">C</span>
                            </div>
                            <span className="text-lg font-black text-gray-900">CatatIN</span>
                        </Link>
                        <p className="text-sm font-medium text-gray-700">
                            Membuat dunia lebih terorganisir, satu catatan pada satu waktu.
                        </p>
                    </div>

                    {/* Links */}
                    {[
                        { title: 'Produk', links: ['Fitur'] },
                        { title: 'Perusahaan', links: ['Tentang'] },
                    ].map((section) => (
                        <div key={section.title}>
                            <div className="mb-4 text-sm font-black text-gray-900">{section.title}</div>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="border-t-3 border-00 pt-8 text-center text-sm font-bold text-gray-700">
                    © 2025 CatatIN. Hak cipta dilindungi. IDN BOARDING SCHOOL
                </div>
            </div>
        </footer>
    );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Welcome() {
    return (
        <>
            <Head title="CatatIN — Ide Anda layak mendapat catatan yang lebih baik" />
            <div className="bg-amber-50">
                <Navbar />
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <FaqSection />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
}