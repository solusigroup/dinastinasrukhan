import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    TreesIcon,
    Maximize2,
    Image as ImageIcon,
    Grid,
    Layers,
    X,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { MosaicEnlargeModal } from '@/components/mosaic-enlarge-modal';
import { MosaicUploadDialog } from '@/components/mosaic-upload-dialog';
import type { BreadcrumbItem, FamilyMosaic } from '@/types';

interface MemberOption {
    id: number;
    name: string;
    generation: number;
    parent_id?: number | null;
}

interface RootBranch {
    id: number;
    name: string;
    generation: number;
}

interface PageProps {
    mosaics: {
        data: FamilyMosaic[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        member_id: string;
        branch_id: string;
    };
    uploadableMembers: MemberOption[];
    rootBranches: RootBranch[];
    allMembers: MemberOption[];
    canUpload: boolean;
    userRole: string | null;
    currentUserId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mozaik Keluarga', href: '/mosaic' },
];

export default function MosaicIndex({
    mosaics,
    filters,
    uploadableMembers,
    rootBranches,
    allMembers,
    canUpload,
}: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedBranch, setSelectedBranch] = useState(filters.branch_id || '');
    const [selectedMember, setSelectedMember] = useState(filters.member_id || '');

    // Dialog & Modal states
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingMosaic, setEditingMosaic] = useState<FamilyMosaic | null>(null);
    const [enlargeIndex, setEnlargeIndex] = useState<number | null>(null);

    // View layout preference (compact 3cm mozaik tiles vs narrative cards)
    const [viewMode, setViewMode] = useState<'mosaic' | 'cards'>('mosaic');

    const handleFilterApply = (branchId?: string, memberId?: string) => {
        router.get(
            '/mosaic',
            {
                search: search || undefined,
                branch_id: branchId !== undefined ? branchId : selectedBranch || undefined,
                member_id: memberId !== undefined ? memberId : selectedMember || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterApply();
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedBranch('');
        setSelectedMember('');
        router.get('/mosaic', {}, { preserveState: true, replace: true });
    };

    const openEnlarge = (index: number) => {
        setEnlargeIndex(index);
    };

    const handleEditFromEnlarge = (mosaic: FamilyMosaic) => {
        setEnlargeIndex(null);
        setEditingMosaic(mosaic);
        setIsUploadOpen(true);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mozaik Kegiatan Keluarga" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Mozaik Keluarga
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kumpulan dokumentasi foto dan cerita kegiatan keluarga Dinasti Nasrukhan
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center rounded-xl border border-sidebar-border/70 bg-muted/40 p-1">
                            <button
                                onClick={() => setViewMode('mosaic')}
                                title="Mode Mozaik 3x3 cm"
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                    viewMode === 'mosaic'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Grid className="h-3.5 w-3.5" />
                                <span>Mozaik (3x3 cm)</span>
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                title="Mode Kartu Cerita"
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                    viewMode === 'cards'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Layers className="h-3.5 w-3.5" />
                                <span>Kartu Cerita</span>
                            </button>
                        </div>

                        {/* Upload Button (Editor & Superadmin only) */}
                        {canUpload && (
                            <button
                                onClick={() => {
                                    setEditingMosaic(null);
                                    setIsUploadOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Pasang Foto</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-3 rounded-2xl border border-sidebar-border/70 bg-card p-4 sm:flex-row sm:items-center">
                    {/* Search Input */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari caption, momen kegiatan, atau nama anggota keluarga..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-xs sm:text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        />
                    </form>

                    {/* Filter by Branch */}
                    <div className="w-full sm:w-56">
                        <select
                            value={selectedBranch}
                            onChange={(e) => {
                                setSelectedBranch(e.target.value);
                                handleFilterApply(e.target.value, undefined);
                            }}
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        >
                            <option value="">Semua Cabang Silsilah</option>
                            {rootBranches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    Cabang: {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Member */}
                    <div className="w-full sm:w-56">
                        <select
                            value={selectedMember}
                            onChange={(e) => {
                                setSelectedMember(e.target.value);
                                handleFilterApply(undefined, e.target.value);
                            }}
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        >
                            <option value="">Semua Anggota</option>
                            {allMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} (Gen {member.generation})
                                </option>
                            ))}
                        </select>
                    </div>

                    {(search || selectedBranch || selectedMember) && (
                        <button
                            onClick={handleClearFilters}
                            title="Reset Filter"
                            className="flex items-center justify-center gap-1 rounded-xl border border-sidebar-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                        >
                            <X className="h-3.5 w-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>

                {/* Mosaic Content */}
                {mosaics.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/80 bg-muted/10 py-16 text-center">
                        <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
                        <h3 className="text-base font-semibold text-foreground">
                            Belum ada foto mozaik
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                            {search || selectedBranch || selectedMember
                                ? 'Tidak ada foto yang cocok dengan filter pencarian Anda.'
                                : 'Foto kegiatan dan momen kenangan keluarga yang diunggah akan muncul dalam susunan mozaik di sini.'}
                        </p>
                        {canUpload && (
                            <button
                                onClick={() => {
                                    setEditingMosaic(null);
                                    setIsUploadOpen(true);
                                }}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/20 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Unggah Foto Pertama</span>
                            </button>
                        )}
                    </div>
                ) : viewMode === 'mosaic' ? (
                    /* ── MODE 1: UNIFORM 3cm x 3cm MOSAIC TILES WITH CAPTION UNDERNEATH ── */
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card/60 p-4 sm:p-6 shadow-sm">
                        <div className="flex flex-wrap gap-4 sm:gap-5 justify-center sm:justify-start">
                            {mosaics.data.map((mosaic, index) => (
                                <div
                                    key={mosaic.id}
                                    className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                                    style={{ width: '3cm' }}
                                    onClick={() => openEnlarge(index)}
                                >
                                    {/* 3cm x 3cm Mosaic Image Container */}
                                    <div
                                        className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/40 shadow-xs transition-all duration-300 group-hover:border-amber-500/60 group-hover:shadow-md group-hover:shadow-amber-500/10"
                                        style={{ width: '3cm', height: '3cm' }}
                                    >
                                        <img
                                            src={`/storage/${mosaic.thumbnail_path || mosaic.photo_path}`}
                                            alt={mosaic.title || mosaic.caption}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Hover Overlay with Enlarge Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                                            <Maximize2 className="h-5 w-5 text-white drop-shadow" />
                                        </div>

                                        {/* Generation / Tree Badge */}
                                        {mosaic.family_member && (
                                            <div className="absolute top-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[8px] font-semibold text-white/90 backdrop-blur-xs">
                                                G{mosaic.family_member.generation}
                                            </div>
                                        )}
                                    </div>

                                    {/* Caption Underneath the 3cm x 3cm photo */}
                                    <div className="mt-1.5 w-full text-center px-0.5">
                                        {mosaic.title && (
                                            <p className="line-clamp-1 text-[11px] font-semibold text-foreground leading-tight group-hover:text-amber-500 transition-colors">
                                                {mosaic.title}
                                            </p>
                                        )}
                                        <p
                                            className="line-clamp-2 text-[10px] text-muted-foreground leading-snug mt-0.5"
                                            title={mosaic.caption}
                                        >
                                            {mosaic.caption}
                                        </p>
                                        {mosaic.family_member && (
                                            <span className="mt-1 inline-block truncate max-w-full text-[9px] font-medium text-amber-500/80">
                                                {mosaic.family_member.name.split(' ')[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ── MODE 2: NARRATIVE STORY CARDS (With 3cm x 3cm Photo Header) ── */
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {mosaics.data.map((mosaic, index) => (
                            <div
                                key={mosaic.id}
                                onClick={() => openEnlarge(index)}
                                className="group relative flex flex-col justify-between rounded-2xl border border-sidebar-border/70 bg-card p-4 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer"
                            >
                                <div className="flex gap-3">
                                    {/* 3cm x 3cm Photo Thumbnail */}
                                    <div
                                        className="relative shrink-0 overflow-hidden rounded-xl border border-sidebar-border bg-muted/40 shadow-xs"
                                        style={{ width: '3cm', height: '3cm' }}
                                    >
                                        <img
                                            src={`/storage/${mosaic.thumbnail_path || mosaic.photo_path}`}
                                            alt={mosaic.title || mosaic.caption}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Maximize2 className="h-4 w-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex flex-1 flex-col min-w-0">
                                        {mosaic.title && (
                                            <h3 className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                                                {mosaic.title}
                                            </h3>
                                        )}

                                        {mosaic.family_member && (
                                            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <TreesIcon className="h-3 w-3 text-amber-500 shrink-0" />
                                                <span className="truncate">
                                                    {mosaic.family_member.name}
                                                </span>
                                            </div>
                                        )}

                                        {mosaic.activity_date && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/70">
                                                <Calendar className="h-2.5 w-2.5 shrink-0" />
                                                <span>{formatDate(mosaic.activity_date)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Full Caption in Card */}
                                <div className="mt-3 pt-2.5 border-t border-sidebar-border/50">
                                    <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed">
                                        {mosaic.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {mosaics.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-4">
                        {mosaics.links.map((link, idx) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={idx}
                                        className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground/40"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-amber-500 text-white font-bold'
                                            : 'border border-sidebar-border text-foreground hover:bg-muted'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Enlarge Modal / Lightbox */}
            <MosaicEnlargeModal
                isOpen={enlargeIndex !== null}
                onClose={() => setEnlargeIndex(null)}
                mosaics={mosaics.data}
                currentIndex={enlargeIndex ?? 0}
                onNavigate={(idx) => setEnlargeIndex(idx)}
                onEdit={handleEditFromEnlarge}
            />

            {/* Upload / Edit Dialog */}
            <MosaicUploadDialog
                isOpen={isUploadOpen}
                onClose={() => {
                    setIsUploadOpen(false);
                    setEditingMosaic(null);
                }}
                uploadableMembers={uploadableMembers}
                allMembers={allMembers}
                editingMosaic={editingMosaic}
            />
        </AppLayout>
    );
}
