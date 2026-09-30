import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { TreesIcon, Users, Layers, LogIn, UserPlus, ChevronRight, BookOpen, ShieldCheck, Image, Network, Heart, Sparkles, Download } from 'lucide-react';
import { PwaInstallBanner } from '@/components/pwa-install-banner';
import { PwaInstallDialog } from '@/components/pwa-install-dialog';
import type { FamilyTreeStats } from '@/types';

type WelcomeProps = {
    stats: FamilyTreeStats;
};

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color?: string }) {
    const colorClasses = color || 'text-amber-400';
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-amber-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
                    <p className="mt-1 text-sm font-medium text-white/60">{label}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                    <Icon className={`h-6 w-6 ${colorClasses}`} />
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, badgeColor }: { icon: React.ElementType; title: string; description: string; badgeColor: string }) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-8 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${badgeColor} shadow-lg backdrop-blur-sm`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{description}</p>
        </div>
    );
}

export default function Welcome() {
    const { stats } = usePage<{ stats: FamilyTreeStats }>().props;
    const { auth } = usePage<{ auth?: { user?: { id: number } } }>().props;
    const [installDialogOpen, setInstallDialogOpen] = useState(false);
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="Silsilah Keluarga Besar Dinasti Nasrukhan" />

            <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
                {/* Decorative background ambient glows */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
                    <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[140px]" />
                </div>

                {/* Header Navigation */}
                <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-lg shadow-amber-500/20">
                                <TreesIcon className="h-6 w-6 text-slate-950 font-bold" />
                            </div>
                            <div>
                                <h1 className="text-lg font-extrabold tracking-wide text-white">DINASTI NASRUKHAN</h1>
                                <p className="text-xs font-medium text-amber-400/80">Silsilah Keluarga Besar</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setInstallDialogOpen(true)}
                                className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/20 cursor-pointer"
                            >
                                <Download className="h-4 w-4 text-amber-400" />
                                <span className="hidden sm:inline">Instal Aplikasi</span>
                            </button>
                            <a
                                href="/panduan.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                            >
                                <BookOpen className="h-4 w-4 text-amber-400" />
                                <span className="hidden sm:inline">Panduan</span>
                            </a>
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105"
                                >
                                    Dashboard
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 px-6 pt-24 pb-16">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                                Portal Silsilah Resmi Dinasti Nasrukhan
                            </span>
                        </div>
                        <h1 className="mb-6 bg-gradient-to-r from-white via-slate-100 to-white/60 bg-clip-text text-5xl leading-tight font-black tracking-tight text-transparent sm:text-6xl md:text-7xl">
                            Keluarga Besar
                            <br />
                            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                                DINASTI NASRUKHAN
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
                            Menghubungkan, mendokumentasikan, dan mengabadikan silsilah nasab Keluarga Besar Dinasti Nasrukhan dari generasi ke generasi dalam satu sistem digital yang terintegrasi.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        href="/register"
                                        className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 px-8 py-4 text-lg font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105"
                                    >
                                        Bergabung Sekarang
                                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                                    >
                                        Masuk Ke Akun
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/family-tree"
                                    className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 px-8 py-4 text-lg font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105"
                                >
                                    Lihat Pohon Keluarga
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Extended Stats Section */}
                <section className="relative z-10 px-6 py-12">
                    <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard icon={Users} label="Total Anggota Keluarga" value={stats.totalMembers ?? 0} color="text-amber-400" />
                        <StatCard icon={Layers} label="Generasi Nasab" value={stats.totalGenerations ?? 0} color="text-emerald-400" />
                        <StatCard icon={Heart} label="Pasangan / Matrimoni" value={stats.totalSpouses ?? 0} color="text-rose-400" />
                        <StatCard icon={TreesIcon} label="Laki-laki & Perempuan" value={`${stats.totalMale ?? 0} / ${stats.totalFemale ?? 0}`} color="text-sky-400" />
                    </div>
                </section>

                {/* Features Highlight Section */}
                <section className="relative z-10 px-6 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-14 text-center">
                            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Fitur Utama Platform Digital</h2>
                            <p className="mt-3 text-slate-400">Dirancang khusus untuk memfasilitasi pendataan silsilah Dinasti Nasrukhan secara terstruktur dan aman.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                icon={Network}
                                title="Pohon Silsilah Interaktif"
                                description="Visualisasi hirarki silsilah interaktif dengan fitur zoom, pan, panduan generasi, dan ekspor ke gambar PNG beresolusi tinggi."
                                badgeColor="bg-amber-500/20"
                            />
                            <FeatureCard
                                icon={Image}
                                title="Galeri Foto Keluarga"
                                description="Dokumentasi foto anggota keluarga dan pasangan untuk mempererat pengenalan antar generasi."
                                badgeColor="bg-emerald-500/20"
                            />
                            <FeatureCard
                                icon={Users}
                                title="Manajemen Per Cabang"
                                description="Otorisasi terpisah untuk Editor Cabang/Bani untuk mempermudah pembaruan data silsilah di setiap ranting."
                                badgeColor="bg-sky-500/20"
                            />
                            <FeatureCard
                                icon={ShieldCheck}
                                title="Keamanan & Log Aktivitas"
                                description="Setiap perubahan data tercatat dengan transparan dalam audit log untuk menjaga integritas silsilah keluarga."
                                badgeColor="bg-purple-500/20"
                            />
                        </div>
                    </div>
                </section>

                {/* About & Vision Section */}
                <section className="relative z-10 px-6 py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-10 backdrop-blur-md shadow-2xl">
                            <h2 className="mb-6 text-3xl font-extrabold text-white">Tentang Dinasti Nasrukhan</h2>
                            <div className="space-y-4 text-lg leading-relaxed text-slate-300">
                                <p>
                                    Keluarga Besar Dinasti Nasrukhan merupakan garis keturunan yang kokoh, berakar pada nilai-nilai persaudaraan, kehormatan, dan kebersamaan. Didirikan oleh "NASRUKHAN", nasab keluarga ini berkembang mengakar kuat hingga berbagai penjuru wilayah.
                                </p>
                                <p>
                                    Aplikasi silsilah digital ini dibangun sebagai wadah silaturahmi modern agar generasi muda dan pendatang baru dalam keluarga senantiasa mengenali garis keturunan, hubungan kekerabatan, serta sejarah Dinasti Nasrukhan.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 backdrop-blur-sm">
                                    <h3 className="mb-2 text-lg font-bold text-amber-400">Visi Utama</h3>
                                    <p className="text-sm leading-relaxed text-slate-300">
                                        Menyatukan, mempererat, dan melestarikan tali silaturahmi seluruh Bani dan keturunan Dinasti Nasrukhan melalui platform silsilah terpadu.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 backdrop-blur-sm">
                                    <h3 className="mb-2 text-lg font-bold text-emerald-400">Misi Utama</h3>
                                    <p className="text-sm leading-relaxed text-slate-300">
                                        Mendokumentasikan data biografi, foto, dan silsilah keluarga secara akurat, aman, dan dapat diakses dengan mudah oleh seluruh keluarga besar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 px-6 py-10">
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                                <TreesIcon className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-extrabold text-white">DINASTI NASRUKHAN</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            &copy; {new Date().getFullYear()} Silsilah Digital dibuat oleh Kurniawan dengan Cinta. Seluruh hak cipta dilindungi.
                        </p>
                    </div>
                </footer>
            </div>

            <PwaInstallBanner />
            <PwaInstallDialog open={installDialogOpen} onOpenChange={setInstallDialogOpen} />
        </>
    );
}
