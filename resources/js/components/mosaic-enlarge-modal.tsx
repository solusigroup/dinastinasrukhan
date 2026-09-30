import { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    TreesIcon,
    Pencil,
    Trash2,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Tag,
} from 'lucide-react';
import type { FamilyMosaic } from '@/types';

interface MosaicEnlargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    mosaics: FamilyMosaic[];
    currentIndex: number;
    onNavigate: (newIndex: number) => void;
    onEdit?: (mosaic: FamilyMosaic) => void;
}

export function MosaicEnlargeModal({
    isOpen,
    onClose,
    mosaics,
    currentIndex,
    onNavigate,
    onEdit,
}: MosaicEnlargeModalProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const currentMosaic = mosaics[currentIndex] || null;

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < mosaics.length - 1;

    const handlePrev = useCallback(() => {
        if (hasPrev) {
            setIsZoomed(false);
            onNavigate(currentIndex - 1);
        }
    }, [hasPrev, currentIndex, onNavigate]);

    const handleNext = useCallback(() => {
        if (hasNext) {
            setIsZoomed(false);
            onNavigate(currentIndex + 1);
        }
    }, [hasNext, currentIndex, onNavigate]);

    // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrev, handleNext, onClose]);

    if (!isOpen || !currentMosaic) {
        return null;
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const handleDelete = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus foto mozaik ini?')) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/mosaic/${currentMosaic.id}`, {
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
                alert('Gagal menghapus foto.');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md animate-in fade-in-0 duration-200">
            {/* Top Bar with Controls */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between text-white/90">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium backdrop-blur-md">
                        {currentIndex + 1} / {mosaics.length}
                    </span>
                    {currentMosaic.title && (
                        <h2 className="hidden text-sm font-semibold sm:inline truncate max-w-xs md:max-w-md">
                            {currentMosaic.title}
                        </h2>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom Toggle */}
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                    >
                        {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                    </button>

                    {/* Manage Actions */}
                    {currentMosaic.can_manage && (
                        <>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(currentMosaic)}
                                    title="Edit Foto & Caption"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors text-white"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                title="Hapus Foto"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 transition-colors text-white"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        title="Tutup (Esc)"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Navigation Arrows */}
            {hasPrev && (
                <button
                    onClick={handlePrev}
                    title="Foto Sebelumnya (Panah Kiri)"
                    className="absolute left-2 sm:left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/30 backdrop-blur-md transition-all hover:scale-105"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {hasNext && (
                <button
                    onClick={handleNext}
                    title="Foto Berikutnya (Panah Kanan)"
                    className="absolute right-2 sm:right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/30 backdrop-blur-md transition-all hover:scale-105"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}

            {/* Main Content Modal Layout */}
            <div className="flex h-[92vh] w-full max-w-6xl flex-col lg:flex-row overflow-hidden rounded-2xl bg-zinc-950/95 border border-white/10 shadow-2xl">
                {/* Photo Viewer (Left / Top) */}
                <div
                    className={`relative flex flex-1 items-center justify-center overflow-auto bg-black/80 select-none ${
                        isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <img
                        src={`/storage/${currentMosaic.photo_path}`}
                        alt={currentMosaic.title || currentMosaic.caption}
                        className={`transition-all duration-300 ${
                            isZoomed
                                ? 'max-h-none max-w-none scale-125 object-contain'
                                : 'max-h-[85vh] max-w-full object-contain'
                        }`}
                        loading="eager"
                    />
                </div>

                {/* Details & Caption Section (Right / Bottom) */}
                <div className="flex w-full lg:w-96 flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-900/90 p-5 text-white max-h-[40vh] lg:max-h-full overflow-y-auto">
                    <div className="space-y-4">
                        {/* Title & Date */}
                        <div>
                            {currentMosaic.title ? (
                                <h3 className="text-lg font-bold text-white leading-snug">
                                    {currentMosaic.title}
                                </h3>
                            ) : (
                                <h3 className="text-base font-semibold text-zinc-300">
                                    Dokumentasi Kegiatan Keluarga
                                </h3>
                            )}

                            {currentMosaic.activity_date && (
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formatDate(currentMosaic.activity_date)}</span>
                                </div>
                            )}
                        </div>

                        {/* Associated Family Member in Tree */}
                        {currentMosaic.family_member && (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                                    Terkait di Silsilah
                                </div>
                                <div className="mt-2 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                                                currentMosaic.family_member.gender === 'male'
                                                    ? 'bg-sky-600'
                                                    : 'bg-pink-600'
                                            }`}
                                        >
                                            {currentMosaic.family_member.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {currentMosaic.family_member.name}
                                            </p>
                                            <p className="text-[11px] text-zinc-400">
                                                Generasi {currentMosaic.family_member.generation}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/family-members/${currentMosaic.family_member.id}`}
                                        className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/30 transition-colors"
                                    >
                                        <TreesIcon className="h-3 w-3" />
                                        <span>Profil</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Tagged Members */}
                        {currentMosaic.tagged_members && currentMosaic.tagged_members.length > 0 && (
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>Anggota Lain yang Terlibat:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {currentMosaic.tagged_members.map((member) => (
                                        <Link
                                            key={member.id}
                                            href={`/family-members/${member.id}`}
                                            className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-zinc-200 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
                                        >
                                            {member.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Caption Section (formatted with whitespace) */}
                        <div className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Keterangan & Cerita
                            </span>
                            <div className="rounded-xl bg-black/30 p-3.5 text-sm text-zinc-200 leading-relaxed whitespace-pre-line border border-white/5 max-h-48 overflow-y-auto">
                                {currentMosaic.caption}
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>
                                Oleh {currentMosaic.user?.name || 'Editor'}{' '}
                                {currentMosaic.user?.role ? `(${currentMosaic.user.role})` : ''}
                            </span>
                        </div>
                        <span>
                            {currentMosaic.created_at ? formatDate(currentMosaic.created_at) : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
