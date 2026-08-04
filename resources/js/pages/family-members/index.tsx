import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Users, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Anggota Keluarga', href: '/family-members' },
];

export default function FamilyMemberIndex() {
    const { members, manageableIds, userRole } = usePage<{
        members: FamilyMember[];
        manageableIds: number[];
        userRole: string;
    }>().props;
    const [search, setSearch] = useState('');

    const filteredMembers = members.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.birth_place?.toLowerCase().includes(search.toLowerCase()) ||
            m.spouses?.some(s => s.name.toLowerCase().includes(search.toLowerCase())),
    );

    const canManage = (memberId: number) => {
        return userRole === 'superadmin' || manageableIds.includes(memberId);
    };

    const canCreate = userRole === 'superadmin' || (userRole === 'editor' && manageableIds.length > 0);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
            router.delete(`/family-members/${id}`);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anggota Keluarga" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Anggota Keluarga</h1>
                        <p className="text-sm text-muted-foreground">
                            {members.length} anggota terdaftar
                            {userRole === 'editor' && manageableIds.length > 0 && (
                                <span className="ml-2 text-emerald-400">
                                    · {manageableIds.length} dapat Anda kelola
                                </span>
                            )}
                        </p>
                    </div>
                    {canCreate && (
                        <Link
                            href="/family-members/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Anggota
                        </Link>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama, tempat lahir, atau pasangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pl-10 pr-4 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>

                {/* Members Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/30">
                                    <th className="px-4 py-3 text-left font-semibold">Nama</th>
                                    <th className="px-4 py-3 text-left font-semibold">Gender</th>
                                    <th className="px-4 py-3 text-left font-semibold">Tempat Lahir</th>
                                    <th className="px-4 py-3 text-left font-semibold">Tgl Lahir</th>
                                    <th className="px-4 py-3 text-left font-semibold">Pasangan</th>
                                    <th className="px-4 py-3 text-left font-semibold">Generasi</th>
                                    <th className="px-4 py-3 text-left font-semibold">Orang Tua</th>
                                    <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                            <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
                                            <p>Tidak ada anggota ditemukan.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => {
                                        const manageable = canManage(member.id);
                                        return (
                                            <tr
                                                key={member.id}
                                                className={`border-b border-sidebar-border/50 transition-colors hover:bg-muted/20 ${
                                                    manageable && userRole === 'editor' ? 'bg-emerald-500/[0.02]' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-8 w-8 shrink-0 overflow-hidden items-center justify-center rounded-full text-xs font-bold text-white ${member.photo ? 'bg-muted/30' : (member.gender === 'male' ? 'bg-sky-500' : 'bg-pink-500')}`}>
                                                            {member.photo ? (
                                                                <img 
                                                                    src={`/storage/${member.photo}`} 
                                                                    alt="" 
                                                                    className="h-full w-full object-cover" 
                                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                />
                                                            ) : (
                                                                member.name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>{member.name}</span>
                                                            {manageable && userRole === 'editor' && (
                                                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" title="Dalam cabang Anda" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            member.gender === 'male'
                                                                ? 'bg-sky-500/10 text-sky-400'
                                                                : 'bg-pink-500/10 text-pink-400'
                                                        }`}
                                                    >
                                                        {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {member.birth_place || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(member.birth_date)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {member.spouses && member.spouses.length > 0
                                                        ? member.spouses.map(s => `${s.name}${s.status === 'divorced' ? ' (Cerai)' : ''}`).join(', ')
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                                                        Gen {member.generation}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {member.parent?.name || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link
                                                            href={`/family-members/${member.id}`}
                                                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                            title="Lihat"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {manageable && (
                                                            <>
                                                                <Link
                                                                    href={`/family-members/${member.id}/edit`}
                                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(member.id, member.name)}
                                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </>
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
            </div>
        </AppLayout>
    );
}
