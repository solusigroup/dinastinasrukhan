import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    CalendarDays,
    Crown,
    Eye,
    Layers,
    LayoutGrid,
    Pencil,
    Shield,
    ShieldCheck,
    TrendingUp,
    TreesIcon,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember, FamilyTreeStats } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// ── Types ────────────────────────────────────────────────────────

type SuperadminData = {
    roleDistribution?: Record<string, number>;
    membersPerGeneration?: Record<string, number>;
    recentActivity?: ActivityItem[];
    recentRegistrations?: RecentUser[];
};

type ActivityItem = {
    id: number;
    description: string;
    subject_type: string | null;
    causer: string;
    created_at: string;
    created_at_full: string;
};

type RecentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
};

type DashboardStats = FamilyTreeStats & {
    totalUsers?: number;
    pendingUsers?: number;
    membersThisMonth?: number;
    activeUsers?: number;
};

// ── Stat Card ────────────────────────────────────────────────────

function DashStatCard({
    icon: Icon,
    label,
    value,
    color,
    subtitle,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
    subtitle?: string;
}) {
    const colorClasses: Record<string, string> = {
        amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
        emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        sky: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
        purple: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400',
        rose: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
        cyan: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    };

    return (
        <div
            className={`rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorClasses[color] || colorClasses.amber}`}
        >
            <div className="flex items-center justify-between">
                <Icon className="h-6 w-6" />
                {subtitle && <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">{subtitle}</span>}
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

// ── Role Distribution Donut (CSS only) ──────────────────────────

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
    superadmin: { label: 'Superadmin', color: '#a855f7', bg: 'bg-purple-500' },
    editor: { label: 'Editor', color: '#10b981', bg: 'bg-emerald-500' },
    viewer: { label: 'Viewer', color: '#06b6d4', bg: 'bg-cyan-500' },
    pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-500' },
};

function RoleDistributionChart({ data }: { data: Record<string, number> }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    // Build conic gradient segments
    let accumulated = 0;
    const segments: string[] = [];
    const entries = Object.entries(data);

    entries.forEach(([role, count]) => {
        const pct = (count / total) * 100;
        const cfg = roleConfig[role] || { color: '#6b7280' };
        segments.push(`${cfg.color} ${accumulated}% ${accumulated + pct}%`);
        accumulated += pct;
    });

    const gradientStyle = {
        background: `conic-gradient(${segments.join(', ')})`,
    };

    return (
        <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-full" style={gradientStyle} />
                <div className="absolute inset-[20%] rounded-full bg-background" />
                <span className="relative z-10 text-2xl font-bold text-foreground">{total}</span>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-2">
                {entries.map(([role, count]) => {
                    const cfg = roleConfig[role] || { label: role, bg: 'bg-gray-500' };
                    return (
                        <div key={role} className="flex items-center gap-2 text-sm">
                            <div className={`h-3 w-3 rounded-full ${cfg.bg}`} />
                            <span className="text-muted-foreground">{cfg.label}</span>
                            <span className="ml-auto font-semibold text-foreground">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Generation Bar Chart (CSS only) ─────────────────────────────

function GenerationBarChart({ data }: { data: Record<string, number> }) {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;

    const maxVal = Math.max(...entries.map(([, v]) => v), 1);

    return (
        <div className="flex flex-col gap-3">
            {entries.map(([gen, count]) => (
                <div key={gen} className="flex items-center gap-3">
                    <span className="w-16 text-right text-xs font-medium text-muted-foreground">Gen {gen}</span>
                    <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-muted/30">
                        <div
                            className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                            style={{ width: `${Math.max((count / maxVal) * 100, 4)}%` }}
                        />
                        <span className="relative z-10 flex h-full items-center px-3 text-xs font-bold text-foreground">
                            {count}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Activity Timeline ───────────────────────────────────────────

function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Activity className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-2 bottom-2 left-4 w-px bg-sidebar-border/50" />

            <div className="space-y-4">
                {activities.map((item) => (
                    <div key={item.id} className="group relative flex items-start gap-4 pl-0">
                        {/* Dot */}
                        <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sidebar-border/70 bg-background transition-colors group-hover:border-amber-500/50">
                            <Pencil className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-foreground leading-relaxed">
                                {item.description}
                                {item.subject_type && (
                                    <span className="ml-1.5 text-xs text-muted-foreground">({item.subject_type})</span>
                                )}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/70">{item.causer}</span>
                                <span>·</span>
                                <span title={item.created_at_full}>{item.created_at}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Recent Registrations ────────────────────────────────────────

const statusBadge: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400',
    pending: 'bg-amber-500/10 text-amber-400',
    rejected: 'bg-red-500/10 text-red-400',
};

const roleBadge: Record<string, string> = {
    superadmin: 'text-purple-400',
    editor: 'text-emerald-400',
    viewer: 'text-cyan-400',
    pending: 'text-amber-400',
};

function RecentRegistrations({ users }: { users: RecentUser[] }) {
    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Belum ada pendaftaran.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {users.map((u) => (
                <Link
                    key={u.id}
                    href={`/admin/users/${u.id}`}
                    className="flex items-center gap-3 rounded-xl border border-sidebar-border/50 bg-background px-4 py-3 transition-all hover:border-purple-500/30 hover:bg-purple-500/[0.03]"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white">
                        {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${roleBadge[u.role] || 'text-muted-foreground'}`}>
                            {u.role}
                        </span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[u.status] || ''}`}>
                            {u.status === 'active' ? 'Aktif' : u.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

// ── Main Dashboard ──────────────────────────────────────────────

export default function Dashboard() {
    const { stats, recentMembers, superadminData } = usePage<{
        stats?: DashboardStats;
        recentMembers?: FamilyMember[];
        superadminData?: SuperadminData;
    }>().props;
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';

    const totalMembers = stats?.totalMembers ?? 0;
    const totalGenerations = stats?.totalGenerations ?? 0;

    // ── Superadmin Dashboard ─────────────────────────────
    if (isSuperadmin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Superadmin" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    {/* Hero Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 via-indigo-500/15 to-violet-600/20 border border-purple-500/20 p-8">
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-purple-500/5 to-transparent" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 backdrop-blur-sm">
                                <Crown className="h-7 w-7 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Superadmin Dashboard
                                </h2>
                                <p className="text-muted-foreground">
                                    Silsilah Keluarga Besar Dinasti Nasrukhan — Pusat Kontrol
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <DashStatCard icon={Users} label="Total Anggota" value={totalMembers} color="amber" />
                        <DashStatCard icon={Layers} label="Total Generasi" value={totalGenerations} color="emerald" />
                        <DashStatCard icon={UserCheck} label="Pengguna Aktif" value={stats?.activeUsers ?? 0} color="sky" />
                        <DashStatCard icon={Shield} label="Total Pengguna" value={stats?.totalUsers ?? 0} color="purple" />
                        <DashStatCard
                            icon={UserPlus}
                            label="Menunggu Approval"
                            value={stats?.pendingUsers ?? 0}
                            color="rose"
                        />
                        <DashStatCard
                            icon={CalendarDays}
                            label="Anggota Baru"
                            value={stats?.membersThisMonth ?? 0}
                            color="cyan"
                            subtitle="Bulan Ini"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Role Distribution */}
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="border-b border-sidebar-border/70 bg-muted/20 px-6 py-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <ShieldCheck className="h-4.5 w-4.5 text-purple-400" />
                                    Distribusi Role
                                </h3>
                            </div>
                            <div className="p-6">
                                {superadminData?.roleDistribution ? (
                                    <RoleDistributionChart data={superadminData.roleDistribution} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada data.</p>
                                )}
                            </div>
                        </div>

                        {/* Members per Generation */}
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="border-b border-sidebar-border/70 bg-muted/20 px-6 py-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <BarChart3 className="h-4.5 w-4.5 text-amber-400" />
                                    Anggota per Generasi
                                </h3>
                            </div>
                            <div className="p-6">
                                {superadminData?.membersPerGeneration ? (
                                    <GenerationBarChart data={superadminData.membersPerGeneration} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada data.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid gap-6 lg:grid-cols-5">
                        {/* Activity Timeline */}
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 lg:col-span-3">
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 bg-muted/20 px-6 py-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <Activity className="h-4.5 w-4.5 text-emerald-400" />
                                    Aktivitas Terbaru
                                </h3>
                                <Link
                                    href="/admin/activity-logs"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Lihat semua
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto p-6">
                                <ActivityTimeline activities={superadminData?.recentActivity || []} />
                            </div>
                        </div>

                        {/* Recent Registrations */}
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 lg:col-span-2">
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 bg-muted/20 px-6 py-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <UserPlus className="h-4.5 w-4.5 text-purple-400" />
                                    Pendaftaran Terbaru
                                </h3>
                                <Link
                                    href="/admin/users"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Kelola
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto p-6">
                                <RecentRegistrations users={superadminData?.recentRegistrations || []} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Link
                            href="/admin/users"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/5"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                                <Shield className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Kelola Pengguna</h3>
                                <p className="text-xs text-muted-foreground">Approve, role, branch</p>
                            </div>
                        </Link>
                        <Link
                            href="/family-members"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                                <Users className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Kelola Anggota</h3>
                                <p className="text-xs text-muted-foreground">Tambah, edit, hapus</p>
                            </div>
                        </Link>
                        <Link
                            href="/family-tree"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                <TreesIcon className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Pohon Keluarga</h3>
                                <p className="text-xs text-muted-foreground">Lihat visualisasi</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/activity-logs"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-5 transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 transition-colors group-hover:bg-sky-500/20">
                                <Activity className="h-5 w-5 text-sky-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Log Aktivitas</h3>
                                <p className="text-xs text-muted-foreground">Lihat riwayat</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // ── Editor/Viewer Dashboard ──────────────────────────
    const isViewer = auth?.user?.role === 'viewer';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Selamat Datang di Dashboard 👋
                    </h2>
                    <p className="text-muted-foreground">
                        {isViewer
                            ? 'Anda memiliki akses Viewer — jelajahi silsilah Keluarga Besar Dinasti Nasrukhan.'
                            : 'Kelola silsilah Keluarga Besar Dinasti Nasrukhan dari sini.'}
                    </p>
                    {isViewer && (
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
                            <Eye className="h-3 w-3" />
                            Mode Viewer — Hanya Baca
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashStatCard icon={Users} label="Total Anggota" value={totalMembers} color="amber" />
                    <DashStatCard icon={Layers} label="Total Generasi" value={totalGenerations} color="emerald" />
                    <DashStatCard icon={TreesIcon} label="Pohon Keluarga" value={totalMembers > 0 ? 'Aktif' : 'Kosong'} color="sky" />
                    <DashStatCard icon={TrendingUp} label="Status" value="Online" color="purple" />
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href="/family-members"
                        className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                            <Users className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                {isViewer ? 'Lihat Anggota' : 'Kelola Anggota'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isViewer ? 'Jelajahi data anggota' : 'Tambah, edit, hapus anggota'}
                            </p>
                        </div>
                    </Link>
                    <Link
                        href="/family-tree"
                        className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                            <TreesIcon className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Pohon Keluarga</h3>
                            <p className="text-sm text-muted-foreground">Lihat visualisasi pohon</p>
                        </div>
                    </Link>
                    {!isViewer ? (
                        <Link
                            href="/family-members/create"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                                <LayoutGrid className="h-6 w-6 text-sky-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Tambah Anggota</h3>
                                <p className="text-sm text-muted-foreground">Daftarkan anggota baru</p>
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href="/gallery"
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                                <LayoutGrid className="h-6 w-6 text-sky-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Galeri Keluarga</h3>
                                <p className="text-sm text-muted-foreground">Lihat foto keluarga</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
