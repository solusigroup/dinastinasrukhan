import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    KeyRound,
    Search,
    Shield,
    ShieldCheck,
    ShieldX,
    Sparkles,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola Pengguna', href: '/admin/users' },
];

type PageProps = {
    users: (User & { branch_assignments_count: number })[];
    pendingCount: number;
    currentFilter: string;
    flash: { success?: string; error?: string };
};

const roleLabels: Record<string, { text: string; class: string }> = {
    superadmin: {
        text: 'Superadmin',
        class: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
    },
    editor: {
        text: 'Editor',
        class: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    },
    viewer: {
        text: 'Viewer',
        class: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
    },
    pending: {
        text: 'Pending',
        class: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    },
};

const statusLabels: Record<string, { text: string; class: string }> = {
    active: { text: 'Aktif', class: 'bg-emerald-500/10 text-emerald-400' },
    pending: { text: 'Menunggu', class: 'bg-amber-500/10 text-amber-400' },
    rejected: { text: 'Ditolak', class: 'bg-red-500/10 text-red-400' },
};

const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Aktif' },
    { key: 'rejected', label: 'Ditolak' },
];

export default function UsersIndex() {
    const { users, pendingCount, currentFilter, flash } =
        usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [resetUser, setResetUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formError, setFormError] = useState('');

    const openResetPasswordModal = (user: User) => {
        setResetUser(user);
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setFormError('');
        setCopied(false);
    };

    const closeResetPasswordModal = () => {
        setResetUser(null);
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setFormError('');
        setCopied(false);
    };

    const handleGenerateRandomPassword = () => {
        const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
        let randomPart = '';
        for (let i = 0; i < 4; i++) {
            randomPart += chars.charAt(
                Math.floor(Math.random() * chars.length),
            );
        }
        const numPart = Math.floor(1000 + Math.random() * 9000);
        const generated = `Nasrukhan#${randomPart}${numPart}`;
        setNewPassword(generated);
        setConfirmPassword(generated);
        setShowPassword(true);
        setFormError('');
    };

    const handleCopyPassword = () => {
        if (!newPassword) return;
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetUser) return;
        if (newPassword.length < 8) {
            setFormError('Password minimal harus 8 karakter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError('Konfirmasi password tidak cocok.');
            return;
        }

        setIsSubmitting(true);
        setFormError('');
        router.put(
            `/admin/users/${resetUser.id}/reset-password`,
            {
                password: newPassword,
                password_confirmation: confirmPassword,
            },
            {
                onSuccess: () => {
                    closeResetPasswordModal();
                },
                onError: (errors) => {
                    setFormError(errors.password || 'Gagal mereset password.');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    const handleApprove = (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menyetujui user ini?')) {
            router.post(`/admin/users/${userId}/approve`);
        }
    };

    const handleReject = (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menolak user ini?')) {
            router.post(`/admin/users/${userId}/reject`);
        }
    };

    const handleDelete = (userId: number, name: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus user "${name}"? Aksi ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                            <Shield className="h-7 w-7 text-purple-400" />
                            Kelola Pengguna
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {users.length} pengguna terdaftar
                            {pendingCount > 0 && (
                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                                    {pendingCount} menunggu persetujuan
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 rounded-xl border border-sidebar-border/70 bg-muted/20 p-1">
                    {filterTabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/users${tab.key !== 'all' ? `?status=${tab.key}` : ''}`}
                            preserveScroll
                            className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-all ${
                                currentFilter === tab.key
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                            {tab.key === 'pending' && pendingCount > 0 && (
                                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pr-4 pl-10 text-sm transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    />
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/30">
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Cabang
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Terdaftar
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
                                            <p>Tidak ada pengguna ditemukan.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const roleCfg =
                                            roleLabels[user.role] ||
                                            roleLabels.pending;
                                        const statusCfg =
                                            statusLabels[user.status] ||
                                            statusLabels.pending;

                                        return (
                                            <tr
                                                key={user.id}
                                                className={`border-b border-sidebar-border/50 transition-colors hover:bg-muted/20 ${
                                                    user.status === 'pending'
                                                        ? 'bg-amber-500/[0.02]'
                                                        : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${roleCfg.class}`}
                                                    >
                                                        {user.role ===
                                                            'superadmin' && (
                                                            <ShieldCheck className="h-3 w-3" />
                                                        )}
                                                        {roleCfg.text}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.class}`}
                                                    >
                                                        {statusCfg.text}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-muted-foreground">
                                                        {user.branch_assignments_count ||
                                                            0}{' '}
                                                        cabang
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link
                                                            href={`/admin/users/${user.id}`}
                                                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                            title="Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {user.role !==
                                                            'superadmin' && (
                                                            <button
                                                                onClick={() =>
                                                                    openResetPasswordModal(
                                                                        user,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                                                                title="Reset Password"
                                                            >
                                                                <KeyRound className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        {user.status ===
                                                            'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                                                                    title="Setujui"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                                    title="Tolak"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {user.role !==
                                                            'superadmin' && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
                                                                        user.name,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Reset Password */}
                {resetUser && (
                    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200 fade-in">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-sidebar-border bg-card shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                        <KeyRound className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            Reset Password
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Untuk {resetUser.name} (
                                            {resetUser.email})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeResetPasswordModal}
                                    className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleResetSubmit}
                                className="space-y-4 p-6"
                            >
                                {formError && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400">
                                        {formError}
                                    </div>
                                )}

                                {/* Generator Button */}
                                <div className="flex items-center justify-between rounded-xl border border-dashed border-sidebar-border/80 bg-muted/20 p-3">
                                    <span className="text-xs text-muted-foreground">
                                        Perlu saran password aman?
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleGenerateRandomPassword}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Buat Acak
                                    </button>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                                        Password Baru{' '}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setFormError('');
                                            }}
                                            placeholder="Minimal 8 karakter..."
                                            required
                                            minLength={8}
                                            className="w-full rounded-xl border border-sidebar-border bg-background py-2.5 pr-20 pl-3.5 text-sm transition-colors focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                        />
                                        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                                            {newPassword && (
                                                <button
                                                    type="button"
                                                    onClick={handleCopyPassword}
                                                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title="Salin Password"
                                                >
                                                    {copied ? (
                                                        <Check className="h-4 w-4 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                title={
                                                    showPassword
                                                        ? 'Sembunyikan'
                                                        : 'Tampilkan'
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {copied && (
                                        <p className="mt-1 text-[11px] font-medium text-emerald-400">
                                            Password disalin ke clipboard!
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                                        Konfirmasi Password Baru{' '}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value,
                                                );
                                                setFormError('');
                                            }}
                                            placeholder="Ketik ulang password..."
                                            required
                                            minLength={8}
                                            className="w-full rounded-xl border border-sidebar-border bg-background py-2.5 pr-10 pl-3.5 text-sm transition-colors focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                                        />
                                    </div>
                                    {confirmPassword &&
                                        newPassword !== confirmPassword && (
                                            <p className="mt-1 text-[11px] text-red-400">
                                                Password konfirmasi belum sama.
                                            </p>
                                        )}
                                </div>

                                {/* Footer Buttons */}
                                <div className="flex justify-end gap-2.5 border-t border-sidebar-border/70 pt-3">
                                    <button
                                        type="button"
                                        onClick={closeResetPasswordModal}
                                        disabled={isSubmitting}
                                        className="rounded-xl border border-sidebar-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            isSubmitting ||
                                            newPassword.length < 8 ||
                                            newPassword !== confirmPassword
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                                    >
                                        <KeyRound className="h-3.5 w-3.5" />
                                        {isSubmitting
                                            ? 'Menyimpan...'
                                            : 'Simpan Password Baru'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
