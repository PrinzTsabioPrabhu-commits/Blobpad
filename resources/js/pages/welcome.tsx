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
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-amber-50 transition-all duration-300 ${scrolled ? 'border-b-4 border-gray-900 shadow-lg' : 'border-b-4 border-gray-900'}`}>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-gray-900 bg-yellow-400 shadow-md">
                        <span className="text-base font-bold text-gray-900">C</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">CatatIN</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-8 md:flex">
                    {['Fitur', 'Harga'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                            {item}
                        </a>
                    ))}
                </div>

                {/* Desktop auth */}
                <div className="hidden items-center gap-3 md:flex">
                    {auth.user ? (
                        <Link href={dashboard()} className="btn-minimal border-3 border-gray-900 bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-gray-800">
                            Dasbor
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="rounded-lg border-3 border-gray-900 bg-white px-5 py-2 text-sm font-bold text-gray-900 shadow-md hover:bg-gray-50">
                                Masuk
                            </Link>
                            <Link href={register()} className="btn-minimal rounded-lg border-3 border-gray-900 bg-blue-500 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-600">
                                Mulai Gratis
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setOpen(!open)} className="rounded-xl border-3 border-gray-900 bg-white p-2 shadow-md hover:bg-gray-50 md:hidden">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t-4 border-gray-900 bg-amber-50 px-6 py-4 md:hidden">
                    {['Fitur', 'Harga'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`}
                            onClick={() => setOpen(false)}
                            className="block py-3 text-sm font-bold text-gray-900">
                            {item}
                        </a>
                    ))}
                    <div className="mt-4 flex flex-col gap-3">
                        {auth.user ? (
                            <Link href={dashboard()} onClick={() => setOpen(false)}
                                className="btn-minimal rounded-lg border-3 border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-bold text-white shadow-md">
                                Dasbor
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} onClick={() => setOpen(false)}
                                    className="block rounded-lg border-3 border-gray-900 bg-white py-2.5 text-center text-sm font-bold text-gray-900 shadow-md">
                                    Masuk
                                </Link>
                                <Link href={register()} onClick={() => setOpen(false)}
                                    className="btn-minimal rounded-lg border-3 border-gray-900 bg-blue-500 py-2.5 text-center text-sm font-bold text-white shadow-md">
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
        <section className="bg-gradient-to-b from-amber-50 to-yellow-50 px-6 pt-32 pb-20">
            <div className="mx-auto max-w-4xl text-center">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border-3 border-gray-900 bg-blue-400 px-5 py-2 text-sm font-bold text-white shadow-lg">
                    <span className="flex h-2 w-2 rounded-full bg-white" />
                    LEBIH DARI SEKADAR CATATAN
                </div>

                {/* Heading */}
                <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                    MERAJUT{' '}
                    <span className="rounded-2xl border-4 border-gray-900 bg-yellow-400 px-4 py-2 inline-block shadow-lg">
                        DEDIKASI
                    </span>
                    <br />
                    MENGHADIRKAN{' '}
                    <span className="rounded-2xl border-4 border-gray-900 bg-yellow-400 px-4 py-2 inline-block shadow-lg">
                        PRESTASI
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-gray-700 md:text-xl">
                    CatatIN mengubah pikiran acak menjadi catatan yang indah dan terorganisir. Cepat, sederhana, dan powerful.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href={register()} className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-600 hover:translate-y-[-2px] transition-all">
                        MULAI SEKARANG →
                    </Link>
                    <a href="#fitur" className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-lg hover:bg-gray-50 hover:translate-y-[-2px] transition-all">
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
                        Dipercaya oleh <span className="font-semibold text-gray-900">12.000+</span> pencatat
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
                                        Perencanaan Q3, target tim...
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
                                        Susu, telur, roti...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating accent */}
                    <div className="absolute -top-3 -right-3 rounded-xl border-3 border-gray-900 bg-green-400 px-4 py-2 text-sm font-black text-gray-900 shadow-lg">
                        ⚡ Secepat kilat
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
        <section id="fitur" className="bg-gradient-to-b from-yellow-50 to-amber-50 px-6 py-20" ref={ref}>
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
                        Fitur powerful dalam antarmuka yang sederhana dan indah.
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
        <section className="bg-white px-6 py-20" ref={ref}>
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
        <section className="bg-gradient-to-b from-amber-50 to-yellow-50 px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-green-400 px-5 py-2 text-sm font-black text-gray-900 shadow-md">
                        Testimoni
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Dicintai ribuan pengguna
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
// PRICING SECTION
// ============================================================
const PLANS = [
    {
        name: 'Gratis',
        price: 'Rp0',
        period: 'selamanya',
        desc: 'Sempurna untuk memulai.',
        features: ['Catatan tak terbatas', '3 folder', 'Tag dasar', 'Akses aplikasi mobile'],
        cta: 'Mulai Gratis',
        highlight: false,
        accent: 'yellow',
        bgColor: 'bg-yellow-400',
        borderColor: 'border-yellow-600',
    },
    {
        name: 'Pro',
        price: 'Rp49k',
        period: '/bulan',
        desc: 'Untuk pengguna power.',
        features: ['Semua fitur Gratis', 'Folder tak terbatas', 'Pencarian bertenaga AI', 'Sinkronisasi prioritas', 'Ekspor ke PDF & Markdown'],
        cta: 'Dapatkan Pro',
        highlight: true,
        accent: 'blue',
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-700',
    },
    {
        name: 'Tim',
        price: 'Rp99k',
        period: '/bulan per anggota',
        desc: 'Untuk tim dengan ukuran apa pun.',
        features: ['Semua fitur Pro', 'Anggota tim tak terbatas', 'Kolaborasi real-time', 'Workspace bersama', 'Kontrol admin'],
        cta: 'Mulai Tim',
        highlight: false,
        accent: 'green',
        bgColor: 'bg-green-400',
        borderColor: 'border-green-600',
    },
];

function PricingSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section id="harga" className="bg-white px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="mb-3 inline-block rounded-full border-3 border-gray-900 bg-red-400 px-5 py-2 text-sm font-black text-white shadow-md">
                        Harga
                    </span>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Harga sederhana dan transparan
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
                        Mulai gratis, upgrade saat Anda siap.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {PLANS.map((plan, i) => {
                        return (
                            <div
                                key={i}
                                className={`relative rounded-2xl border-4 border-gray-900 p-8 shadow-lg transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl ${
                                    plan.highlight
                                        ? `${plan.bgColor} text-white`
                                        : 'bg-white'
                                } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}>
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-3 border-gray-900 bg-yellow-400 px-5 py-1.5 text-xs font-black text-gray-900 shadow-md">
                                        PALING POPULER
                                    </div>
                                )}

                                <h3 className={`mb-2 text-xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                <p className={`mb-6 text-sm font-medium ${plan.highlight ? 'text-blue-100' : 'text-gray-700'}`}>{plan.desc}</p>

                                <div className="mb-6">
                                    <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                                    <span className={`text-sm font-bold ${plan.highlight ? 'text-blue-100' : 'text-gray-700'}`}>{plan.period}</span>
                                </div>

                                <ul className="mb-8 space-y-3">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-medium">
                                            <Check size={18} strokeWidth={3} className={plan.highlight ? 'text-white' : 'text-green-500'} />
                                            <span className={plan.highlight ? 'text-blue-100' : 'text-gray-700'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href={register()} className={`btn-minimal block w-full rounded-xl border-3 border-gray-900 py-3 text-center text-sm font-black shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg ${
                                    plan.highlight
                                     ? 'bg-white text-blue-600'
                                        : `${plan.bgColor} text-gray-900`
                                }`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Money back guarantee */}
                <p className={`mt-8 text-center text-sm font-bold text-gray-700 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                    🔒 Garansi uang kembali 30 hari. Batalkan kapan saja, tanpa pertanyaan.
                </p>
            </div>
        </section>
    );
}

// ============================================================
// CTA SECTION
// ============================================================
function CtaSection() {
    const { ref, visible } = useReveal(0.1);

    return (
        <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50 px-6 py-20" ref={ref}>
            <div className="mx-auto max-w-3xl text-center">
                <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Siap untuk memulai?
                    </h2>
                    <p className="mb-8 text-lg font-medium text-gray-700">
                        Bergabunglah dengan 12.000+ pencatat yang bahagia. Mulai gratis — tanpa kartu kredit.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href={register()} className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-600 hover:translate-y-[-2px] transition-all">
                            Mulai Gratis
                            <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                        <a href="#harga" className="btn-minimal inline-flex items-center gap-2 rounded-xl border-4 border-gray-900 bg-yellow-400 px-8 py-4 text-base font-bold text-gray-900 shadow-lg hover:bg-yellow-500 hover:translate-y-[-2px] transition-all">
                            Lihat Harga
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
                        { title: 'Produk', links: ['Fitur', 'Harga', 'Changelog', 'Roadmap'] },
                        { title: 'Perusahaan', links: ['Tentang', 'Blog', 'Karir', 'Pers'] },
                        { title: 'Legal', links: ['Privasi', 'Ketentuan', 'Keamanan', 'Cookies'] },
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
                    © 2025 CatatIN. Hak cipta dilindungi.
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
            <div className="bg-gradient-to-b from-amber-50 to-yellow-50">
                <Navbar />
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <PricingSection />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
}